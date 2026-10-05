// Lembretes: no horário de estudo de cada preparação e avisos de teste/plano acabando.
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { keyFromDay, nowHHMM, today, todayKey, weekday } from "@/lib/core/dates";
import { daysLeft, RENEW_NOTICE_DAYS } from "@/lib/billing";
import { formatMinutes } from "@/lib/utils";

const WINDOW_MIN = 5;
const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** A cada 5 minutos: quem chegou no horário escolhido e ainda tem sessão hoje recebe o lembrete (uma vez por dia). */
export async function sendStudyReminders(now = new Date()) {
  const preps = await db.preparation.findMany({ where: { status: "ACTIVE", user: { remindersEnabled: true } }, include: { user: true } });
  let sent = 0;
  for (const prep of preps) {
    const tz = prep.user.timezone;
    const day = today(tz, now);
    if (!prep.studyDays.includes(weekday(day))) continue;
    const delta = minutesOf(nowHHMM(tz, now)) - minutesOf(prep.studyTime);
    if (delta < 0 || delta >= WINDOW_MIN) continue;
    const pending = await db.plannedSession.findMany({ where: { plan: { preparationId: prep.id }, date: day, status: "PENDING" } });
    if (!pending.length) continue;
    const minutes = pending.reduce((s, p) => s + p.durationMin, 0);
    const n = await notify(prep.user.id, {
      type: "STUDY_REMINDER",
      title: `Hora de estudar: ${prep.title}`,
      body: `${pending.length} sessão(ões) hoje · ${formatMinutes(minutes)}. Bora manter a sequência!`,
      href: "/inicio",
      dedupeKey: `lembrete:${prep.id}:${keyFromDay(day)}`,
    });
    if (n) sent++;
  }
  return sent;
}

/**
 * A cada 5 minutos (sai uma vez por dia, a partir das 9h do aluno): aviso para pagar.
 * - plano vencendo: todo dia, a partir de 2 dias antes do vencimento;
 * - plano vencido: todo dia, por 7 dias (a conta continua salva; pagou, libera na hora).
 */
export async function sendBillingReminders(now = new Date()) {
  const subs = await db.subscription.findMany({
    where: {
      status: { in: ["ACTIVE", "PAST_DUE"] },
      currentPeriodEnd: { gt: new Date(now.getTime() - 7 * 86_400_000), lte: new Date(now.getTime() + (RENEW_NOTICE_DAYS + 1) * 86_400_000) },
    },
    include: { plan: true, user: { select: { timezone: true } } },
  });
  let sent = 0;
  for (const s of subs) {
    const tz = s.user.timezone;
    if (minutesOf(nowHHMM(tz, now)) < 9 * 60) continue;
    // já pagou o próximo mês (ou trocou de plano): nada a avisar
    const newer = await db.subscription.count({ where: { userId: s.userId, id: { not: s.id }, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: s.currentPeriodEnd } } });
    if (newer) continue;
    const left = daysLeft(s.currentPeriodEnd, tz, now);
    const ended = s.currentPeriodEnd <= now;
    if (!ended && left > RENEW_NOTICE_DAYS) continue;
    const when = left <= 0 ? "vence hoje" : left === 1 ? "vence amanhã" : `vence em ${left} dias`;
    const n = await notify(s.userId, {
      type: "PLAN_EXPIRING",
      title: ended ? `Seu plano ${s.plan.name} venceu` : `Seu plano ${s.plan.name} ${when}`,
      body: ended
        ? "Seus estudos estão guardados. Pague o próximo mês pelo Pix e volte a estudar na hora."
        : "Pague o próximo mês pelo Pix e continue estudando sem parar. Os 30 dias novos somam ao final do plano.",
      href: "/assinatura",
      dedupeKey: `plano:${s.id}:${s.currentPeriodEnd.toISOString().slice(0, 10)}:${todayKey(tz, now)}`,
    });
    if (n) sent++;
  }
  return sent;
}

// ───────────── Chamadas do dia (para o aluno voltar ao app) ─────────────

type Nudge = { kind: string; at: number; title: string[]; body: string[]; href: string };

/** Horários do dia (minutos) de cada chamada; mudam um pouco por aluno e por dia para não parecer robô. */
const NUDGES: Nudge[] = [
  { kind: "teste1", at: 10 * 60, title: ["Bora de teste rápido? ⚡", "5 minutinhos de teste rápido?"], body: ["Responda umas perguntas do seu material e suba de fase.", "Um teste rápido agora fixa o que você estudou."], href: "/praticar" },
  { kind: "erros", at: 12 * 60 + 30, title: ["Seus erros estão te esperando 🎯", "Olhe o seu banco de erros"], body: ["Refazer o que você errou é o jeito mais rápido de aprender.", "Acerte as questões que você errou e elas saem do banco."], href: "/revisoes?filtro=erros" },
  { kind: "teste2", at: 15 * 60, title: ["Teste rápido da tarde ⚡", "Desafio: acerte 10 seguidas?"], body: ["Rapidinho: 10 perguntas e você vê o quanto lembra.", "Teste rápido para não esquecer o conteúdo."], href: "/praticar" },
  { kind: "simulado", at: 11 * 60 + 30, title: ["Que tal um simulado hoje? 📝", "Treine como na prova"], body: ["Um simulado mostra onde você precisa reforçar.", "Faça um simulado e veja sua nota por disciplina."], href: "/simulados/novo" },
  { kind: "redacao", at: 17 * 60, title: ["Hora da redação ✍️", "Escreva uma redação hoje"], body: ["Tema sorteado e correção na hora. Bora treinar?", "Cada redação corrigida deixa sua nota maior."], href: "/redacao/nova" },
  { kind: "teste3", at: 20 * 60 + 30, title: ["Último teste rápido do dia ⚡", "Fecha o dia com um teste rápido?"], body: ["Revise antes de dormir: ajuda a memória.", "Mais um teste rápido e o dia está ganho."], href: "/praticar" },
  { kind: "instalar", at: 18 * 60 + 30, title: ["Instale o app do Eduvia 📲", "Leve o Eduvia na tela do celular"], body: ["Abre mais rápido e avisa a hora de estudar.", "Instale o app e receba os lembretes certinho."], href: "/instalar" },
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Minuto do dia em que a chamada sai para este aluno hoje (horário base ± 40 min). */
export function nudgeMinute(userId: string, dayKey: string, n: Pick<Nudge, "kind" | "at">) {
  return n.at + (hash(`${userId}:${dayKey}:${n.kind}`) % 81) - 40;
}

/**
 * A cada 5 minutos: envia as chamadas do dia que chegaram na hora (uma vez por dia cada, pelo dedupeKey).
 * Pula o que não faz sentido (sem banco de erros, plano sem simulado, app já com notificações ativas).
 */
export async function sendDailyNudges(now = new Date()) {
  const users = await db.user.findMany({
    where: { remindersEnabled: true, handle: { not: null }, geminiKey: { not: null } },
    select: { id: true, timezone: true, _count: { select: { pushSubs: true } } },
  });
  let sent = 0;
  for (const u of users) {
    const dayKey = keyFromDay(today(u.timezone, now));
    const nowMin = minutesOf(nowHHMM(u.timezone, now));
    const due = NUDGES.filter((n) => {
      const at = nudgeMinute(u.id, dayKey, n);
      return nowMin >= at && nowMin < at + 30;
    });
    for (const n of due) {
      if (n.kind === "instalar" && u._count.pushSubs > 0) continue;
      if (n.kind === "erros" && !(await db.reviewItem.count({ where: { userId: u.id, inErrorBank: true } }))) continue;
      if (n.kind === "simulado") {
        const { getAccess } = await import("@/lib/billing");
        if ((await getAccess(u)).limits.examsPerMonth === 0) continue;
      }
      const pick = hash(`${u.id}:${dayKey}:${n.kind}:txt`);
      const created = await notify(
        u.id,
        { type: "NUDGE", title: n.title[pick % n.title.length], body: n.body[pick % n.body.length], href: n.href, dedupeKey: `nudge:${n.kind}:${dayKey}` },
        { push: true },
      ).catch(() => null);
      if (created) sent++;
    }
  }
  return sent;
}
