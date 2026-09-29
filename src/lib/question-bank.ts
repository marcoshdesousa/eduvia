// Banco de questões por assunto: reaproveita as que já existem e só gera (com IA) o que faltar.
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { generateQuestionSet } from "@/lib/ai/tasks";
import { PROFILES, profileVoice } from "@/lib/core/profiles";
import { chunksForPart, type SourceRef } from "@/lib/study";

const PER_CALL = { jogo: 8, simulado: 12 } as const;
const MAX_CALLS = 10;
const CONTEXT_CHARS = 24_000;

type Prep = Prisma.PreparationGetPayload<{ include: { editalAnalysis: true } }>;

export function questionStyleFor(prep: Prep): "MULTIPLE_CHOICE" | "CERTO_ERRADO" {
  return prep.editalAnalysis?.questionStyle === "CERTO_ERRADO" ? "CERTO_ERRADO" : PROFILES[prep.studentType].defaultQuestionType;
}

/**
 * Garante pelo menos `needed` questões objetivas nos assuntos e devolve os ids:
 * primeiro as que o aluno errou, depois as nunca vistas e, por último, as que ele já acertou.
 * `maxCorrectShare` limita a fração de questões já acertadas (ex.: 0.1 no teste rápido: o foco é aprender
 * o que errou e ver coisas novas); se faltarem questões novas, a IA gera mais.
 */
export async function ensureQuestionPool(input: {
  userId: string;
  prep: Prep;
  topicIds: string[];
  needed: number;
  purpose: "jogo" | "simulado";
  maxCorrectShare?: number;
}): Promise<string[]> {
  const share = input.maxCorrectShare ?? 1;
  const perCall = PER_CALL[input.purpose];
  const style = questionStyleFor(input.prep);
  const type = style === "CERTO_ERRADO" ? "CERTO_ERRADO" : "MULTIPLE_CHOICE";
  const where = { topicId: { in: input.topicIds }, type } as const;
  let existing = await db.question.findMany({ where, select: { id: true, topicId: true, statement: true } });
  const lastResults = async (ids: string[]) =>
    new Map((await db.reviewItem.findMany({ where: { userId: input.userId, questionId: { in: ids } }, select: { questionId: true, lastResult: true } })).map((i) => [i.questionId, i.lastResult]));

  // quantas questões "não acertadas ainda" (erradas ou novas) o teste precisa ter
  const maxCorrect = Math.floor(input.needed * share);
  const neededFresh = input.needed - maxCorrect;
  const last0 = await lastResults(existing.map((q) => q.id));
  const fresh = existing.filter((q) => last0.get(q.id) !== true).length;
  const deficit = Math.max(input.needed - existing.length, neededFresh - fresh);
  if (deficit > 0) {
    const topics = await db.topic.findMany({ where: { id: { in: input.topicIds } }, include: { subject: true } });
    // assuntos com menos questões primeiro
    const countBy = new Map<string, number>();
    for (const q of existing) countBy.set(q.topicId, (countBy.get(q.topicId) ?? 0) + 1);
    topics.sort((a, b) => (countBy.get(a.id) ?? 0) - (countBy.get(b.id) ?? 0));
    const calls = Math.min(MAX_CALLS, Math.ceil(deficit / perCall));
    const jobs = Array.from({ length: calls }, (_, i) => topics[i % topics.length]);
    const profile = PROFILES[input.prep.studentType];
    const voice = profileVoice(input.prep.studentType, (input.prep.details ?? {}) as Record<string, unknown>, input.prep.editalAnalysis?.banca);

    for (let i = 0; i < jobs.length; i += 3) {
      await Promise.all(
        jobs.slice(i, i + 3).map(async (topic) => {
          const chunks = await chunksForPart(input.prep.id, topic, 1, 1, CONTEXT_CHARS);
          if (!chunks.length) return;
          const set = await generateQuestionSet({
            userId: input.userId,
            voice,
            topicTitle: topic.title,
            subjectName: topic.subject.name,
            count: perCall,
            questionStyle: style,
            optionsCount: profile.optionsCount,
            avoid: existing.filter((q) => q.topicId === topic.id).map((q) => q.statement),
            chunks,
            purpose: input.purpose,
          });
          const refs: SourceRef[] = chunks.map((c) => ({ label: c.label, materialId: c.materialId, title: c.materialTitle, pageStart: c.pageStart, pageEnd: c.pageEnd }));
          const valid = set.questions.filter((q) => q.options.length >= 2 && q.correctIndex >= 0 && q.correctIndex < q.options.length);
          await db.question.createMany({
            data: valid.map((q) => ({
              topicId: topic.id,
              type,
              statement: q.statement,
              options: q.options,
              correctAnswer: String(q.correctIndex),
              explanation: q.explanation,
              difficulty: Math.max(1, Math.min(5, q.difficulty)),
              sourceRefs: refs.filter((r) => r.label === q.source),
            })),
          });
        }),
      );
    }
    existing = await db.question.findMany({ where, select: { id: true, topicId: true, statement: true } });
  }

  // erradas primeiro, depois nunca vistas; acertadas só até o limite (e para completar, se faltar)
  const last = await lastResults(existing.map((q) => q.id));
  const rank = (id: string) => (last.get(id) === true ? 2 : last.has(id) ? 0 : 1);
  const ordered = shuffle(existing.map((q) => q.id)).sort((a, b) => rank(a) - rank(b));
  const notCorrect = ordered.filter((id) => rank(id) < 2);
  const correct = ordered.filter((id) => rank(id) === 2);
  const picked = notCorrect.slice(0, input.needed);
  picked.push(...correct.slice(0, input.needed - picked.length));
  return shuffle(picked);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
