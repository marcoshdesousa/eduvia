"use server";
import { revalidatePath } from "next/cache";
import { requireReadyUser } from "@/lib/session";
import { answerQuestion, completeSession, lessonBlocker, nextLesson, openSession, retakeSession, SESSION_MINUTES, studyPulse } from "@/lib/study";
import { db } from "@/lib/db";
import { aiErrorMessage } from "@/lib/ai/client";
import { getAccess, sessionLimitError } from "@/lib/billing";
import { findLesson } from "@/lib/enem/catalog";
import { nextEnemLesson } from "@/lib/enem/progress";

export async function startSessionAction(plannedId: string, minutes?: number): Promise<{ ok: true } | { error: string; upgrade?: boolean }> {
  const user = await requireReadyUser();
  const planned = await db.plannedSession.findFirst({ where: { id: plannedId, plan: { preparation: { userId: user.id } } }, include: { studySession: true } });
  if (planned) {
    const blocker = await lessonBlocker(planned);
    if (blocker) return { error: `Esta aula ainda está bloqueada. Primeiro faça "${blocker.topic.title}" e tire pelo menos 75%.` };
  }
  if (planned?.kind === "STUDY" && !planned.studySession) {
    const limit = await sessionLimitError(user);
    if (limit) return { error: limit, upgrade: true };
  }
  // o aluno escolhe quanto tempo tem agora (5 a 45 min), em aula ou revisão
  if (planned && !planned.studySession && validMinutes(minutes) && minutes !== planned.durationMin) {
    await db.plannedSession.update({ where: { id: planned.id }, data: { durationMin: minutes } });
  }
  try {
    const s = await openSession(plannedId, user.id);
    if (!s) return { error: "Sessão não encontrada." };
    return { ok: true };
  } catch (e) {
    console.error("[sessão]", e);
    return { error: aiErrorMessage(e, "Não foi possível preparar a sessão agora. Tente de novo em instantes.") };
  }
}

export async function answerAction(input: { sessionId: string | null; questionId: string; answer: string; timeMs?: number }) {
  const user = await requireReadyUser();
  let context: "SESSION" | "REVIEW" | "ERROR_BANK" = "ERROR_BANK";
  if (input.sessionId) {
    const s = await db.studySession.findFirst({ where: { id: input.sessionId, userId: user.id } });
    if (!s || !s.questionIds.includes(input.questionId)) return { error: "Questão não pertence a esta sessão." } as const;
    const already = await db.attempt.findFirst({ where: { userId: user.id, questionId: input.questionId, contextId: s.id, createdAt: { gte: s.roundStartedAt } } });
    if (already) return { error: "Você já respondeu esta questão." } as const;
    context = s.kind === "REVIEW" ? "REVIEW" : "SESSION";
  }
  try {
    const result = await answerQuestion({ userId: user.id, questionId: input.questionId, answer: input.answer, context, contextId: input.sessionId ?? undefined, timeMs: input.timeMs });
    if (!result) return { error: "Questão não encontrada." } as const;
    return { result } as const;
  } catch (e) {
    console.error("[resposta]", e);
    return { error: aiErrorMessage(e, "Não foi possível corrigir agora. Tente de novo.") } as const;
  }
}

export async function completeSessionAction(sessionId: string) {
  const user = await requireReadyUser();
  const r = await completeSession(sessionId, user.id);
  if (!r) return null;
  const session = await db.studySession.findUnique({ where: { id: sessionId }, select: { topicId: true, plannedSession: { select: { plan: { select: { preparationId: true } } } } } });
  revalidatePath("/inicio");
  // Estudar ENEM: próxima aula da mesma matéria (ou volta para a matéria quando acabar)
  const enem = session ? findLesson(session.topicId) : null;
  if (enem) {
    const next = r.passed ? await nextEnemLesson(user.id, enem.materia.slug, (await getAccess(user)).limits.lessonsPct) : null;
    return { ...r, nextHref: next ? `/enem/aula/${next.topicId}` : r.passed ? `/enem/${enem.materia.slug}` : null };
  }
  const prepId = session?.plannedSession?.plan.preparationId;
  const next = r.passed && prepId ? await nextLesson(prepId) : null;
  return { ...r, nextHref: next ? `/estudar/${next.id}` : null };
}

const validMinutes = (m?: number): m is number => !!m && (SESSION_MINUTES as readonly number[]).includes(m);

/**
 * Refazer a aula (para passar ou para melhorar a nota) ou retomar uma aula aberta há muito tempo:
 * o aluno escolhe de novo quanto tempo tem, e o cronômetro começa do zero.
 */
export async function retakeSessionAction(sessionId: string, minutes?: number) {
  const user = await requireReadyUser();
  const s = await db.studySession.findFirst({ where: { id: sessionId, userId: user.id }, select: { plannedSessionId: true } });
  if (validMinutes(minutes)) {
    if (s?.plannedSessionId) await db.plannedSession.update({ where: { id: s.plannedSessionId }, data: { durationMin: minutes } });
    else if (s) await db.studySession.update({ where: { id: sessionId }, data: { chosenMinutes: minutes } });
  }
  await retakeSession(sessionId, user.id);
  revalidatePath("/inicio");
  return { ok: true };
}

/** A cada minuto com a aula aberta: soma o tempo de estudo do dia (a sequência vale com 5 min). */
export async function studyPulseAction(sessionId: string) {
  const user = await requireReadyUser();
  await studyPulse(sessionId, user.id);
}
