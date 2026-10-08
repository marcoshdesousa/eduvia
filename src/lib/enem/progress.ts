// Progresso de cada aluno no Estudar ENEM: aula aprovada (75%+), melhor nota e quais aulas estão liberadas.
import { db } from "@/lib/db";
import { PASS_SCORE } from "@/lib/study";
import { lessonsAllowed } from "@/lib/plans";
import { findLesson, lessonTopicId, MATERIAS, type Materia } from "./catalog";

export type LessonState = {
  topicId: string;
  index: number;
  title: string;
  /** já abriu a aula (tem sessão) */
  sessionId: string | null;
  best: number | null;
  last: number | null;
  tries: number;
  passed: boolean;
  /** liberada: a primeira, ou a anterior aprovada */
  unlocked: boolean;
  /** fora do plano do aluno: qual plano libera (Grátis 10%, Básico 50%, Completo tudo) */
  planLock: "Básico" | "Completo" | null;
};

/** Sessão de estudo do aluno numa aula do ENEM (uma por aula; refazer começa uma nova rodada na mesma). */
export function enemSession(userId: string, topicId: string) {
  return db.studySession.findFirst({ where: { userId, topicId, plannedSessionId: null }, orderBy: { startedAt: "desc" } });
}

/** Situação de todas as aulas (de uma matéria ou de todas). `lessonsPct`: parte das aulas que o plano libera. */
export async function lessonStates(userId: string, materias: Materia[] = MATERIAS, lessonsPct = 100) {
  const ids = materias.flatMap((m) => m.lessons.map((_, i) => lessonTopicId(m.slug, i)));
  const sessions = await db.studySession.findMany({ where: { userId, topicId: { in: ids }, plannedSessionId: null }, orderBy: { startedAt: "asc" } });
  const byTopic = new Map(sessions.map((s) => [s.topicId, s]));
  const out = new Map<string, LessonState[]>();
  for (const m of materias) {
    let prevPassed = true;
    out.set(
      m.slug,
      m.lessons.map((l, i) => {
        const topicId = lessonTopicId(m.slug, i);
        const s = byTopic.get(topicId);
        const passed = !!s?.passedAt;
        const n = m.lessons.length;
        const planLock = i < lessonsAllowed(n, lessonsPct) ? null : i < lessonsAllowed(n, 50) ? "Básico" : "Completo";
        const st: LessonState = { topicId, index: i, title: l.title, sessionId: s?.id ?? null, best: s?.bestScore ?? null, last: s?.lastScore ?? null, tries: s?.tries ?? 0, passed, unlocked: prevPassed, planLock };
        prevPassed = passed;
        return st;
      }),
    );
  }
  return out;
}

/** A aula está liberada para o aluno? (a anterior da mesma matéria foi aprovada com 75%+) */
export async function lessonUnlocked(userId: string, topicId: string) {
  const found = findLesson(topicId);
  if (!found) return false;
  if (found.index === 0) return true;
  const prev = await enemSession(userId, lessonTopicId(found.materia.slug, found.index - 1));
  return !!prev?.passedAt && (prev.bestScore ?? 0) >= PASS_SCORE - 1e-9;
}

/** Próxima aula para estudar: na matéria (se informada) ou, no "estudar geral", na matéria com menos progresso. */
export async function nextEnemLesson(userId: string, materiaSlug?: string, lessonsPct = 100) {
  const states = await lessonStates(userId, materiaSlug ? MATERIAS.filter((m) => m.slug === materiaSlug) : MATERIAS, lessonsPct);
  const candidates = [...states.entries()]
    .map(([slug, ls]) => ({ slug, done: ls.filter((l) => l.passed).length / Math.max(1, ls.length), next: ls.find((l) => l.unlocked && !l.passed && !l.planLock), r: Math.random() }))
    .filter((c) => c.next);
  // a matéria mais atrasada primeiro; empate: sorteia (para variar as matérias)
  candidates.sort((a, b) => a.done - b.done || a.r - b.r);
  return candidates[0]?.next ?? null;
}
