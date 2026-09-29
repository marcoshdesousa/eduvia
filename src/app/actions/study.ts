"use server";
import { revalidatePath } from "next/cache";
import { requireReadyUser } from "@/lib/session";
import { answerQuestion, completeSession, openSession } from "@/lib/study";
import { db } from "@/lib/db";
import { AiRefusalError } from "@/lib/ai/client";

export async function startSessionAction(plannedId: string): Promise<{ ok: true } | { error: string }> {
  const user = await requireReadyUser();
  try {
    const s = await openSession(plannedId, user.id);
    if (!s) return { error: "Sessão não encontrada." };
    return { ok: true };
  } catch (e) {
    console.error("[sessão]", e);
    if (e instanceof AiRefusalError) return { error: e.message };
    return { error: "Não foi possível preparar a sessão agora. Tente de novo em instantes." };
  }
}

export async function answerAction(input: { sessionId: string | null; questionId: string; answer: string; timeMs?: number }) {
  const user = await requireReadyUser();
  let context: "SESSION" | "REVIEW" | "ERROR_BANK" = "ERROR_BANK";
  if (input.sessionId) {
    const s = await db.studySession.findFirst({ where: { id: input.sessionId, userId: user.id } });
    if (!s || !s.questionIds.includes(input.questionId)) return { error: "Questão não pertence a esta sessão." } as const;
    const already = await db.attempt.findFirst({ where: { userId: user.id, questionId: input.questionId, contextId: s.id } });
    if (already) return { error: "Você já respondeu esta questão." } as const;
    context = s.kind === "REVIEW" ? "REVIEW" : "SESSION";
  }
  try {
    const result = await answerQuestion({ userId: user.id, questionId: input.questionId, answer: input.answer, context, contextId: input.sessionId ?? undefined, timeMs: input.timeMs });
    if (!result) return { error: "Questão não encontrada." } as const;
    return { result } as const;
  } catch (e) {
    console.error("[resposta]", e);
    return { error: "Não foi possível corrigir agora. Tente de novo." } as const;
  }
}

export async function completeSessionAction(sessionId: string) {
  const user = await requireReadyUser();
  await completeSession(sessionId, user.id);
  const attempts = await db.attempt.findMany({ where: { userId: user.id, contextId: sessionId } });
  revalidatePath("/inicio");
  return { correct: attempts.filter((a) => a.isCorrect).length, total: attempts.length };
}
