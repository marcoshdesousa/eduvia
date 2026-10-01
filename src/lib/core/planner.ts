// Gerador de plano de estudo: determinístico, sem IA, testável.
// Recebe tópicos (com estimativa de tempo e prioridade), revisões pendentes e a agenda do aluno,
// e devolve as sessões dia a dia, com diagnóstico de viabilidade até a data da prova.

import type { MasteryStatus } from "@/generated/prisma/enums";
import { addDays, diffDays, weekday } from "./dates";

export type PlanTopic = {
  id: string;
  subjectId: string;
  subjectWeight: number;
  order: number;
  estimatedMinutes: number;
  weight: number;
  difficulty: number;
  mastery?: MasteryStatus;
  /** Partes já concluídas (o plano continua da próxima). */
  completedParts: number;
};

export type PlanReview = {
  topicId: string;
  /** 1..n = R1..Rn; 0 = reforço extra (assunto crítico). */
  reviewNumber: number;
  dueDate: Date;
};

export type PlanInput = {
  start: Date;
  examDate?: Date | null;
  studyDays: number[];
  dailyMinutes: number;
  reviewIntervals: number[];
  topics: PlanTopic[];
  reviews: PlanReview[];
  /** Minutos já estudados hoje (sessões concluídas), descontados do primeiro dia. */
  usedMinutesToday?: number;
  /** Sem data de prova: limite de dias do plano. */
  maxHorizonDays?: number;
};

export type PlannedItem = {
  date: Date;
  kind: "STUDY" | "REVIEW";
  topicId: string;
  part: number;
  partCount: number;
  durationMin: number;
  reviewNumber: number | null;
  order: number;
};

export type PlanResult = {
  sessions: PlannedItem[];
  feasibility: "OK" | "APERTADO" | "INSUFICIENTE";
  /** Minutos de estudo (conteúdo novo) necessários. */
  totalMinutes: number;
  /** Minutos disponíveis até a prova (ou no horizonte). */
  capacityMinutes: number;
  /** Minutos de conteúdo que não couberam até a prova (sempre 0: todo o conteúdo é distribuído). */
  missingMinutes: number;
  /** Maior tempo de estudo planejado num dia (fica acima do escolhido quando a prova está perto). */
  maxDailyMinutes: number;
  unscheduledTopicIds: string[];
  lastStudyDate: Date | null;
};

export const MAX_BLOCK_MINUTES = 50;
export const MIN_PART_MINUTES = 10;
export const REVIEW_MINUTES = 15;
/** Fração máxima do dia que revisões podem ocupar (o resto é conteúdo novo). */
const REVIEW_SHARE = 0.4;

/** Duração de cada bloco de estudo: cabe exatamente no tempo diário (até 50 min por bloco). */
export function blockLength(dailyMinutes: number): number {
  return Math.max(5, Math.min(dailyMinutes, MAX_BLOCK_MINUTES));
}

/** Divide o tópico em partes que cabem no bloco. Última parte pode ser menor (mín. 10 min). */
export function splitParts(estimatedMinutes: number, dailyMinutes: number): number[] {
  const block = blockLength(dailyMinutes);
  const count = Math.max(1, Math.ceil(estimatedMinutes / block));
  if (count === 1) return [Math.min(block, Math.max(estimatedMinutes, Math.min(block, MIN_PART_MINUTES)))];
  const last = estimatedMinutes - block * (count - 1);
  const parts = Array.from({ length: count }, () => block);
  parts[count - 1] = Math.max(Math.min(block, MIN_PART_MINUTES), Math.min(block, last));
  return parts;
}

const MASTERY_FACTOR: Record<MasteryStatus, number> = {
  SEM_DADOS: 1,
  CRITICO: 1.5,
  EM_DESENVOLVIMENTO: 1.2,
  BOM: 0.8,
};

export function topicPriority(t: Pick<PlanTopic, "weight" | "difficulty" | "mastery">): number {
  return t.weight * (1 + t.difficulty / 5) * MASTERY_FACTOR[t.mastery ?? "SEM_DADOS"];
}

/** Ordena tópicos por prioridade, intercalando disciplinas por peso (round-robin ponderado suave). */
export function orderTopics(topics: PlanTopic[]): PlanTopic[] {
  const bySubject = new Map<string, PlanTopic[]>();
  for (const t of topics) {
    const list = bySubject.get(t.subjectId) ?? [];
    list.push(t);
    bySubject.set(t.subjectId, list);
  }
  const queues = [...bySubject.entries()].map(([subjectId, list]) => ({
    subjectId,
    weight: Math.max(0.1, list[0].subjectWeight),
    current: 0,
    items: list.sort((a, b) => topicPriority(b) - topicPriority(a) || a.order - b.order),
  }));
  // disciplinas mais prioritárias primeiro em caso de empate
  queues.sort((a, b) => topicPriority(b.items[0]) * b.weight - topicPriority(a.items[0]) * a.weight);

  const result: PlanTopic[] = [];
  while (queues.some((q) => q.items.length)) {
    const active = queues.filter((q) => q.items.length);
    const total = active.reduce((s, q) => s + q.weight, 0);
    for (const q of active) q.current += q.weight;
    const pick = active.reduce((best, q) => (q.current > best.current ? q : best));
    pick.current -= total;
    result.push(pick.items.shift()!);
  }
  return result;
}

/**
 * Monta o plano com TODO o conteúdo, na ordem do material (não escolhe assuntos "de maior peso").
 * Com data de prova: se o tempo diário escolhido não der, aumenta o estudo de cada dia para que tudo
 * caiba até a prova. Sem data: segue o tempo diário normalmente até acabar o conteúdo.
 */
export function buildPlan(input: PlanInput): PlanResult {
  const daily = input.dailyMinutes;
  const reviewLen = Math.min(REVIEW_MINUTES, daily);
  const horizon = input.maxHorizonDays ?? 365;
  const endExclusive = input.examDate ?? addDays(input.start, horizon);

  // Fila de partes de estudo, na ordem do material.
  type Part = { topicId: string; part: number; partCount: number; duration: number; isLast: boolean };
  const queue: Part[] = [];
  let totalMinutes = 0;
  for (const t of [...input.topics].sort((a, b) => a.order - b.order)) {
    const parts = splitParts(t.estimatedMinutes, daily);
    for (let i = t.completedParts; i < parts.length; i++) {
      queue.push({ topicId: t.id, part: i + 1, partCount: parts.length, duration: parts[i], isLast: i === parts.length - 1 });
      totalMinutes += parts[i];
    }
  }

  // Dias de estudo até a prova. Se nenhum dia escolhido cair antes dela, usa todos os dias até lá;
  // se a prova for hoje (ou já passou), tudo vai para hoje.
  let studyDays = new Set(input.studyDays);
  if (input.examDate) {
    let any = false;
    for (let d = input.start; d < input.examDate; d = addDays(d, 1)) if (studyDays.has(weekday(d))) any = true;
    if (!any) studyDays = new Set([0, 1, 2, 3, 4, 5, 6]);
  }
  const lastDay = input.examDate && input.examDate > input.start ? addDays(input.examDate, -1) : input.start;
  const remainingStudyDays = (from: Date) => {
    let n = 0;
    for (let d = from; d <= lastDay; d = addDays(d, 1)) if (studyDays.has(weekday(d))) n++;
    return n;
  };

  const pendingReviews: PlanReview[] = [...input.reviews].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const sessions: PlannedItem[] = [];
  let capacityMinutes = 0;
  let maxDailyMinutes = 0;
  let lastStudyDate: Date | null = null;
  let reviewTail: Date | null = null; // sem prova: continua só com revisões até a última R
  const examToday = !!input.examDate && input.examDate <= input.start;

  for (let day = input.start; day < endExclusive || (examToday && day <= input.start); day = addDays(day, 1)) {
    if (queue.length === 0 && !input.examDate) {
      if (pendingReviews.length === 0) break;
      reviewTail ??= addDays(day, Math.max(...input.reviewIntervals, 0) + 1);
      if (day > reviewTail) break;
    }
    if (!studyDays.has(weekday(day)) && !examToday) continue;

    const isFirstDay = diffDays(day, input.start) === 0;
    const usedToday = isFirstDay ? input.usedMinutesToday ?? 0 : 0;
    // com prova: o conteúdo restante é dividido pelos dias que sobram (nunca menos que o tempo escolhido)
    const left = queue.reduce((s, p) => s + p.duration, 0);
    const daysLeft = input.examDate ? Math.max(1, remainingStudyDays(day)) : 1;
    const needed = input.examDate ? Math.ceil(left / daysLeft) : 0;
    const isLastDay = !!input.examDate && (examToday || diffDays(day, lastDay) >= 0);
    let budget = (isLastDay ? Number.POSITIVE_INFINITY : Math.max(daily, needed)) - usedToday;
    const dayStart = budget;
    capacityMinutes += daily;
    let order = 0;

    // 1) Revisões vencidas (limitadas a uma fração do dia, exceto se não houver conteúdo novo).
    const reviewCap = queue.length ? Math.max(reviewLen, Math.floor(daily * REVIEW_SHARE)) : daily;
    let reviewUsed = 0;
    for (let i = 0; i < pendingReviews.length; ) {
      const r = pendingReviews[i];
      if (r.dueDate > day) break;
      if (budget < reviewLen || reviewUsed + reviewLen > reviewCap) break;
      sessions.push({ date: day, kind: "REVIEW", topicId: r.topicId, part: 1, partCount: 1, durationMin: reviewLen, reviewNumber: r.reviewNumber || null, order: order++ });
      budget -= reviewLen;
      reviewUsed += reviewLen;
      pendingReviews.splice(i, 1);
    }
    // revisões não tiram espaço do conteúdo novo quando a prova está perto
    if (input.examDate && needed > daily) budget += reviewUsed;

    // 2) Conteúdo novo: blocos inteiros que cabem no que sobrou do dia.
    while (queue.length && queue[0].duration <= budget) {
      const p = queue.shift()!;
      sessions.push({ date: day, kind: "STUDY", topicId: p.topicId, part: p.part, partCount: p.partCount, durationMin: p.duration, reviewNumber: null, order: order++ });
      budget -= p.duration;
      lastStudyDate = day;
      if (p.isLast) {
        // revisões projetadas R1..Rn a partir do término do assunto
        input.reviewIntervals.forEach((d, i) => {
          insertSorted(pendingReviews, { topicId: p.topicId, reviewNumber: i + 1, dueDate: addDays(day, d) });
        });
      }
    }
    if (Number.isFinite(dayStart)) maxDailyMinutes = Math.max(maxDailyMinutes, dayStart - budget + usedToday);
    else maxDailyMinutes = Math.max(maxDailyMinutes, sessions.filter((x) => x.date === day).reduce((s, x) => s + x.durationMin, 0));
  }

  const missingMinutes = queue.reduce((s, p) => s + p.duration, 0);
  const unscheduledTopicIds = [...new Set(queue.map((p) => p.topicId))];
  let feasibility: PlanResult["feasibility"] = "OK";
  if (missingMinutes > 0) feasibility = "INSUFICIENTE";
  else if (maxDailyMinutes > daily) feasibility = "APERTADO";
  else if (input.examDate && capacityMinutes > 0 && totalMinutes > capacityMinutes * 0.75) feasibility = "APERTADO";

  return { sessions, feasibility, totalMinutes, capacityMinutes, missingMinutes, maxDailyMinutes, unscheduledTopicIds, lastStudyDate };
}

function insertSorted(list: PlanReview[], item: PlanReview) {
  const idx = list.findIndex((r) => r.dueDate > item.dueDate);
  if (idx === -1) list.push(item);
  else list.splice(idx, 0, item);
}

/** Estimativa de minutos para estudar um conteúdo com N tokens (texto de estudo + perguntas). */
export function estimateMinutes(tokens: number, paceFactor = 1): number {
  // ~450 tokens de material por minuto de sessão (leitura do texto condensado + perguntas)
  const raw = Math.round((tokens / 450) * paceFactor);
  return Math.max(MIN_PART_MINUTES, Math.min(240, raw));
}
