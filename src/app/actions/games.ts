"use server";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError } from "@/lib/billing";
import { ensureQuestionPool } from "@/lib/question-bank";
import { answerQuestion } from "@/lib/study";
import { addXp } from "@/lib/gamification";
import { answerPoints, getGame, sanitizeConfig } from "@/games/catalog";
import type { GameEndReason, GameQuestion } from "@/games/types";

const MIN_QUESTIONS = 5;

export async function startGameAction(input: { slug: string; preparationId: string; subjectId: string | null; config: Record<string, string> }):
  Promise<{ runId: string; questions: GameQuestion[]; config: Record<string, string> } | { error: string; upgrade?: boolean }> {
  const user = await requireReadyUser();
  const game = getGame(input.slug);
  if (!game) return { error: "Jogo não encontrado." };
  const limit = await featureLimitError(user, "game");
  if (limit) return { error: limit, upgrade: true };
  const prep = await db.preparation.findFirst({ where: { id: input.preparationId, userId: user.id }, include: { editalAnalysis: true } });
  if (!prep) return { error: "Preparação não encontrada." };

  const topics = await db.topic.findMany({
    where: { subject: { preparationId: prep.id, ...(input.subjectId ? { id: input.subjectId } : {}) } },
    select: { id: true, mastery: { where: { userId: user.id }, select: { studyDone: true } } },
  });
  // prioriza assuntos já estudados (as perguntas são sobre o que o aluno viu)
  const studied = topics.filter((t) => t.mastery[0]?.studyDone).map((t) => t.id);
  const topicIds = studied.length >= 1 ? studied : topics.map((t) => t.id);
  if (!topicIds.length) return { error: "Essa preparação ainda não tem assuntos. Envie seus materiais primeiro." };

  let questionIds: string[];
  try {
    questionIds = await ensureQuestionPool({ userId: user.id, prep, topicIds, needed: game.questionCount, purpose: "jogo" });
  } catch (e) {
    console.error("[jogo]", e);
    return { error: "Não foi possível preparar as perguntas agora. Tente de novo." };
  }
  if (questionIds.length < MIN_QUESTIONS) return { error: "Ainda há poucas perguntas sobre esses assuntos. Estude mais sessões ou envie mais material." };

  const config = sanitizeConfig(game, input.config);
  const run = await db.gameRun.create({
    data: { userId: user.id, preparationId: prep.id, gameSlug: game.slug, topicIds, questionIds, config },
  });
  const qs = await db.question.findMany({ where: { id: { in: questionIds } } });
  const byId = new Map(qs.map((q) => [q.id, q]));
  return {
    runId: run.id,
    config,
    questions: questionIds.flatMap((id) => {
      const q = byId.get(id);
      return q ? [{ id: q.id, type: q.type, statement: q.statement, options: (q.options as string[]) ?? [] }] : [];
    }),
  };
}

export async function answerGameAction(runId: string, questionId: string, answer: string, timeMs: number) {
  const user = await requireReadyUser();
  const run = await db.gameRun.findFirst({ where: { id: runId, userId: user.id, endedAt: null } });
  if (!run || !run.questionIds.includes(questionId)) return null;
  const already = await db.attempt.findFirst({ where: { contextId: runId, questionId } });
  if (already) return null;
  const r = await answerQuestion({ userId: user.id, questionId, answer, context: "GAME", contextId: runId, timeMs: Math.max(0, Math.min(timeMs, 600_000)) });
  return r ? { isCorrect: r.isCorrect, correctAnswer: r.correctAnswer, explanation: r.explanation } : null;
}

export type GameResult = { score: number; correct: number; wrong: number; avgTimeMs: number | null; reason: GameEndReason; best: number; isRecord: boolean };

/** Fecha a partida calculando tudo no servidor a partir das respostas registradas. */
export async function finishGameAction(runId: string, reason: GameEndReason): Promise<GameResult | null> {
  const user = await requireReadyUser();
  const run = await db.gameRun.findFirst({ where: { id: runId, userId: user.id } });
  if (!run) return null;
  const attempts = await db.attempt.findMany({ where: { contextId: runId, userId: user.id } });
  const correct = attempts.filter((a) => a.isCorrect);
  const score = correct.reduce((s, a) => s + answerPoints(a.timeMs ?? 10_000), 0);
  const avgTimeMs = attempts.length ? Math.round(attempts.reduce((s, a) => s + (a.timeMs ?? 0), 0) / attempts.length) : null;
  const previousBest = await db.gameRun.aggregate({ _max: { score: true }, where: { userId: user.id, gameSlug: run.gameSlug, id: { not: run.id }, endedAt: { not: null } } });

  if (!run.endedAt) {
    await db.gameRun.update({
      where: { id: run.id },
      data: { score, correct: correct.length, wrong: attempts.length - correct.length, avgTimeMs, endedReason: reason, endedAt: new Date() },
    });
    if (score > 0) await addXp(user.id, Math.round(score / 100), "jogo", run.id);
  }
  const best = Math.max(score, previousBest._max.score ?? 0);
  return { score, correct: correct.length, wrong: attempts.length - correct.length, avgTimeMs, reason, best, isRecord: score > 0 && score >= best && score > (previousBest._max.score ?? 0) };
}
