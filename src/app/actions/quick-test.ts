"use server";
import { redirect } from "next/navigation";
import { aiErrorMessage } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError } from "@/lib/billing";
import { ensureQuestionPool } from "@/lib/question-bank";
import { answerQuestion } from "@/lib/study";
import { addXp } from "@/lib/gamification";
import { checkAchievementsSafe } from "@/lib/achievements";
import { QUICK_COUNTS, QUICK_MAX_CORRECT_SHARE, QUICK_SECONDS, QUICK_TEST_SLUG, type QuickAnswerResult } from "@/lib/quick-test";
import type { FormState } from "./account";

const MIN_QUESTIONS = 5;

export async function createQuickTestAction(_: FormState, f: FormData): Promise<FormState & { upgrade?: boolean }> {
  const user = await requireReadyUser();
  const limit = await featureLimitError(user, "game");
  if (limit) return { error: limit, upgrade: true };
  const count = Number(f.get("count"));
  const seconds = Number(f.get("seconds"));
  if (!(QUICK_COUNTS as readonly number[]).includes(count)) return { error: "Escolha 10, 15 ou 20 perguntas." };
  if (!(QUICK_SECONDS as readonly number[]).includes(seconds)) return { error: "Escolha 10, 15, 20 ou 30 segundos por pergunta." };
  const done = await db.gameRun.count({ where: { userId: user.id, gameSlug: QUICK_TEST_SLUG } });
  const name = String(f.get("name") ?? "").trim().slice(0, 60) || `Teste ${done + 1}`;

  const prep = await db.preparation.findFirst({ where: { id: String(f.get("preparationId")), userId: user.id }, include: { editalAnalysis: true } });
  if (!prep) return { error: "Escolha uma preparação." };
  const subjectId = String(f.get("subjectId") ?? "") || null;
  const topics = await db.topic.findMany({
    where: { subject: { preparationId: prep.id, ...(subjectId ? { id: subjectId } : {}) } },
    select: { id: true, mastery: { where: { userId: user.id }, select: { studyDone: true } } },
  });
  // prioriza o que o aluno já estudou (as perguntas são sobre o que ele viu)
  const studied = topics.filter((t) => t.mastery[0]?.studyDone).map((t) => t.id);
  const topicIds = studied.length ? studied : topics.map((t) => t.id);
  if (!topicIds.length) return { error: "Essa preparação ainda não tem assuntos. Envie seus materiais primeiro." };

  let questionIds: string[];
  try {
    questionIds = await ensureQuestionPool({ userId: user.id, prep, topicIds, needed: count, purpose: "jogo", maxCorrectShare: QUICK_MAX_CORRECT_SHARE });
  } catch (e) {
    console.error("[teste rápido]", e);
    return { error: aiErrorMessage(e, "Não foi possível preparar as perguntas agora. Tente de novo.") };
  }
  if (questionIds.length < MIN_QUESTIONS) return { error: "Ainda há poucas perguntas sobre esses assuntos. Estude mais sessões ou envie mais material." };

  const run = await db.gameRun.create({
    data: { userId: user.id, preparationId: prep.id, gameSlug: QUICK_TEST_SLUG, name, topicIds, questionIds, config: { count, seconds } },
  });
  redirect(`/teste-rapido/${run.id}`);
}

/** Resposta de uma pergunta (vazia = tempo esgotado). Cada pergunta só pode ser respondida uma vez. */
export async function answerQuickAction(runId: string, questionId: string, answer: string, timeMs: number): Promise<QuickAnswerResult | null> {
  const user = await requireReadyUser();
  const run = await db.gameRun.findFirst({ where: { id: runId, userId: user.id, endedAt: null } });
  if (!run || !run.questionIds.includes(questionId)) return null;
  const already = await db.attempt.findFirst({ where: { contextId: runId, questionId } });
  if (already) return null;
  const r = await answerQuestion({ userId: user.id, questionId, answer, context: "GAME", contextId: runId, timeMs: Math.max(0, Math.min(timeMs, 600_000)) });
  return r ? { isCorrect: r.isCorrect, correctAnswer: r.correctAnswer, explanation: r.explanation } : null;
}

/** Encerra o teste (calculado no servidor a partir das respostas registradas). Não dá para refazer. */
export async function finishQuickAction(runId: string) {
  const user = await requireReadyUser();
  const run = await db.gameRun.findFirst({ where: { id: runId, userId: user.id } });
  if (!run) return;
  if (!run.endedAt) {
    const attempts = await db.attempt.findMany({ where: { contextId: runId, userId: user.id } });
    const correct = attempts.filter((a) => a.isCorrect).length;
    const avgTimeMs = attempts.length ? Math.round(attempts.reduce((s, a) => s + (a.timeMs ?? 0), 0) / attempts.length) : null;
    await db.gameRun.update({
      where: { id: run.id },
      data: { score: correct, correct, wrong: run.questionIds.length - correct, avgTimeMs, endedReason: "finished", endedAt: new Date() },
    });
    if (correct > 0) await addXp(user.id, correct * 2, "teste-rapido", run.id);
    await checkAchievementsSafe(user.id);
  }
}
