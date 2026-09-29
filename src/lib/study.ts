// Sessão de estudo: montagem do conteúdo (com cache), respostas, banco de erros e conclusão.
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import type { AttemptContext, StudentType } from "@/generated/prisma/enums";
import { generateSessionContent, gradeOpenAnswer, PROMPT_VERSION, type RetrievedChunk } from "@/lib/ai/tasks";
import { PROFILES, profileVoice } from "@/lib/core/profiles";
import { masteryStatus, nextReview, topicReviewDates } from "@/lib/core/spaced";
import { today } from "@/lib/core/dates";
import { searchChunks } from "@/lib/rag";
import { addXp, registerStudy, XP } from "@/lib/gamification";

export type SourceRef = { label: string; materialId: string; title: string; pageStart: number; pageEnd: number };

const MAX_CONTEXT_CHARS = 60_000;

/** Carrega a sessão planejada garantindo que pertence ao usuário. */
export async function getOwnedPlanned(plannedId: string, userId: string) {
  return db.plannedSession.findFirst({
    where: { id: plannedId, plan: { preparation: { userId } } },
    include: { topic: { include: { subject: true } }, plan: { include: { preparation: { include: { editalAnalysis: true } } } }, studySession: true },
  });
}

/** Abre (ou retoma) a sessão: gera o texto e as questões na primeira vez; depois usa o cache. */
export async function openSession(plannedId: string, userId: string) {
  const planned = await getOwnedPlanned(plannedId, userId);
  if (!planned) return null;
  if (planned.studySession) return planned.studySession;

  const prep = planned.plan.preparation;
  let studyTextId: string | null = null;
  let questionIds: string[];

  if (planned.kind === "STUDY") {
    const text = await getOrCreateStudyText({
      userId,
      topicId: planned.topicId,
      part: planned.part,
      partCount: planned.partCount,
      minutes: planned.durationMin,
      prep,
    });
    studyTextId = text.id;
    const qs = await db.question.findMany({ where: { studyTextId: text.id }, orderBy: { createdAt: "asc" }, select: { id: true, type: true } });
    // recuperação ativa primeiro, depois objetivas
    questionIds = [...qs.filter((q) => q.type === "OPEN_RECALL"), ...qs.filter((q) => q.type !== "OPEN_RECALL")].map((q) => q.id);
  } else {
    questionIds = await pickReviewQuestions(userId, planned.topicId, Math.max(4, Math.round(planned.durationMin / 2)));
  }

  try {
    return await db.studySession.create({
      data: { userId, plannedSessionId: planned.id, topicId: planned.topicId, kind: planned.kind, studyTextId, questionIds },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return db.studySession.findUniqueOrThrow({ where: { plannedSessionId: planned.id } });
    }
    throw e;
  }
}

async function getOrCreateStudyText(input: {
  userId: string;
  topicId: string;
  part: number;
  partCount: number;
  minutes: number;
  prep: { id: string; studentType: StudentType; details: Prisma.JsonValue; editalAnalysis: { banca: string | null; questionStyle: string } | null };
}) {
  const key = { topicId: input.topicId, part: input.part, partCount: input.partCount, studentType: input.prep.studentType, promptVersion: PROMPT_VERSION };
  const cached = await db.studyText.findUnique({ where: { topicId_part_partCount_studentType_promptVersion: key } });
  if (cached) return cached;

  const topic = await db.topic.findUniqueOrThrow({ where: { id: input.topicId }, include: { subject: true } });
  const chunks = await chunksForPart(input.prep.id, topic, input.part, input.partCount);
  const refs: SourceRef[] = chunks.map((c) => ({ label: c.label, materialId: c.materialId, title: c.materialTitle, pageStart: c.pageStart, pageEnd: c.pageEnd }));
  const profile = PROFILES[input.prep.studentType];
  const questionStyle = input.prep.editalAnalysis?.questionStyle === "CERTO_ERRADO" ? "CERTO_ERRADO" : profile.defaultQuestionType;

  const content = await generateSessionContent({
    userId: input.userId,
    voice: profileVoice(input.prep.studentType, (input.prep.details ?? {}) as Record<string, unknown>, input.prep.editalAnalysis?.banca),
    topicTitle: topic.title,
    subjectName: topic.subject.name,
    part: input.part,
    partCount: input.partCount,
    minutes: input.minutes,
    questionStyle,
    optionsCount: profile.optionsCount,
    chunks,
  });

  const refFor = (label: string) => refs.filter((r) => r.label === label);
  try {
    return await db.$transaction(async (tx) => {
      const text = await tx.studyText.create({
        data: {
          ...key,
          content: content.studyText,
          highlights: content.highlights,
          keyPoints: content.keyPoints,
          sourceRefs: refs.filter((r) => content.sources.includes(r.label) || content.studyText.includes(`[${r.label}]`)),
        },
      });
      for (const q of content.recallQuestions) {
        await tx.question.create({
          data: { topicId: topic.id, studyTextId: text.id, type: "OPEN_RECALL", statement: q.question, correctAnswer: q.expectedAnswer, explanation: q.expectedAnswer, sourceRefs: refFor(q.source) },
        });
      }
      for (const q of content.objectiveQuestions) {
        if (q.options.length < 2 || q.correctIndex < 0 || q.correctIndex >= q.options.length) continue;
        await tx.question.create({
          data: {
            topicId: topic.id,
            studyTextId: text.id,
            type: questionStyle === "CERTO_ERRADO" ? "CERTO_ERRADO" : "MULTIPLE_CHOICE",
            statement: q.statement,
            options: q.options,
            correctAnswer: String(q.correctIndex),
            explanation: q.explanation,
            difficulty: Math.max(1, Math.min(5, q.difficulty)),
            sourceRefs: refFor(q.source),
          },
        });
      }
      return text;
    });
  } catch (e) {
    // outra requisição gerou o mesmo texto ao mesmo tempo
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return db.studyText.findUniqueOrThrow({ where: { topicId_part_partCount_studentType_promptVersion: key } });
    }
    throw e;
  }
}

/** Trechos da parte da sessão: os ligados ao assunto (divididos entre as partes) ou, se não houver, busca semântica. */
async function chunksForPart(
  preparationId: string,
  topic: { id: string; title: string; description: string | null; subject: { name: string } },
  part: number,
  partCount: number,
): Promise<(RetrievedChunk & { materialId: string })[]> {
  const linked = await db.topicChunk.findMany({
    where: { topicId: topic.id },
    include: { chunk: { include: { blob: { include: { materials: { where: { preparationId }, take: 1 } } } } } },
  });
  let rows = linked
    .filter((l) => l.chunk.blob.materials.length)
    .sort((a, b) => a.chunk.blobId.localeCompare(b.chunk.blobId) || a.chunk.index - b.chunk.index)
    .map((l) => ({ content: l.chunk.content, pageStart: l.chunk.pageStart, pageEnd: l.chunk.pageEnd, materialId: l.chunk.blob.materials[0].id, materialTitle: l.chunk.blob.materials[0].title }));

  if (rows.length) {
    const size = Math.ceil(rows.length / partCount);
    rows = rows.slice((part - 1) * size, part * size);
  } else {
    const hits = await searchChunks(preparationId, `${topic.subject.name}: ${topic.title}. ${topic.description ?? ""}`, 6);
    rows = hits.map((h) => ({ content: h.content, pageStart: h.pageStart, pageEnd: h.pageEnd, materialId: h.materialId, materialTitle: h.materialTitle }));
  }

  const out: (RetrievedChunk & { materialId: string })[] = [];
  let total = 0;
  for (const r of rows) {
    if (total + r.content.length > MAX_CONTEXT_CHARS) break;
    total += r.content.length;
    out.push({ ...r, label: `T${out.length + 1}` });
  }
  return out;
}

/** Revisão: prioriza questões do banco de erros e as vencidas; completa com as menos recentes do assunto. */
async function pickReviewQuestions(userId: string, topicId: string, count: number) {
  const due = await db.reviewItem.findMany({
    where: { userId, question: { topicId } },
    orderBy: [{ inErrorBank: "desc" }, { dueAt: "asc" }],
    take: count,
    select: { questionId: true },
  });
  const ids = due.map((d) => d.questionId);
  if (ids.length < count) {
    const more = await db.question.findMany({
      where: { topicId, id: { notIn: ids } },
      orderBy: { createdAt: "asc" },
      take: count - ids.length,
      select: { id: true },
    });
    ids.push(...more.map((m) => m.id));
  }
  return ids;
}

export type AnswerResult = {
  isCorrect: boolean;
  score: number;
  feedback: string | null;
  correctAnswer: string;
  explanation: string;
  verdict?: "CORRETA" | "PARCIAL" | "INCORRETA";
  missingPoints?: string[];
};

/** Registra a resposta, corrige (aberta com IA), atualiza banco de erros/repetição, domínio e XP. */
export async function answerQuestion(input: {
  userId: string;
  questionId: string;
  answer: string;
  context: AttemptContext;
  contextId?: string;
  timeMs?: number;
}): Promise<AnswerResult | null> {
  const question = await db.question.findFirst({
    where: { id: input.questionId, topic: { subject: { preparation: { userId: input.userId } } } },
    include: { topic: { include: { subject: { include: { preparation: true } } } } },
  });
  if (!question) return null;
  const prep = question.topic.subject.preparation;
  const user = await db.user.findUniqueOrThrow({ where: { id: input.userId } });

  let result: AnswerResult;
  if (question.type === "OPEN_RECALL") {
    const cacheKey = `grade:${PROMPT_VERSION}:${question.id}:${createHash("sha256").update(input.answer.trim().toLowerCase()).digest("hex")}`;
    const cached = await db.aiCache.findUnique({ where: { key: cacheKey } });
    const grade = (cached?.value as Awaited<ReturnType<typeof gradeOpenAnswer>> | undefined) ??
      (await gradeOpenAnswer({
        userId: input.userId,
        voice: profileVoice(prep.studentType, (prep.details ?? {}) as Record<string, unknown>),
        question: question.statement,
        expectedAnswer: question.correctAnswer,
        answer: input.answer,
      }));
    if (!cached && input.answer.trim()) {
      await db.aiCache.create({ data: { key: cacheKey, task: "grade", value: grade } }).catch(() => {});
    }
    result = {
      isCorrect: grade.verdict === "CORRETA",
      score: Math.max(0, Math.min(1, grade.score)),
      feedback: grade.feedback,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      verdict: grade.verdict,
      missingPoints: grade.missingPoints,
    };
  } else {
    const isCorrect = input.answer === question.correctAnswer;
    result = { isCorrect, score: isCorrect ? 1 : 0, feedback: null, correctAnswer: question.correctAnswer, explanation: question.explanation };
  }

  const day = today(user.timezone);
  // Aberta "parcial" não é erro grave, mas também não consolida: volta como erro para revisão.
  const countsAsCorrect = result.isCorrect;
  const prev = await db.reviewItem.findUnique({ where: { userId_questionId: { userId: input.userId, questionId: question.id } } });
  const next = nextReview(prev, countsAsCorrect, day);

  await db.$transaction([
    db.attempt.create({
      data: {
        userId: input.userId,
        questionId: question.id,
        context: input.context,
        contextId: input.contextId,
        answer: input.answer.slice(0, 5000),
        isCorrect: result.isCorrect,
        score: result.score,
        feedback: result.feedback,
        timeMs: input.timeMs,
      },
    }),
    db.reviewItem.upsert({
      where: { userId_questionId: { userId: input.userId, questionId: question.id } },
      create: {
        userId: input.userId,
        questionId: question.id,
        step: next.step,
        dueAt: next.dueAt,
        lapses: next.lapses,
        correctCount: next.correctCount,
        lastResult: next.lastResult,
        inErrorBank: next.inErrorBank,
      },
      update: {
        step: next.step,
        dueAt: next.dueAt,
        lapses: next.lapses,
        correctCount: next.correctCount,
        lastResult: next.lastResult,
        inErrorBank: next.inErrorBank,
        resolvedAt: next.resolved ? new Date() : undefined,
      },
    }),
  ]);
  await updateMastery(input.userId, question.topicId, result.score);
  await addXp(input.userId, result.isCorrect ? XP.correct : XP.attempt, "resposta", question.id);
  return result;
}

async function updateMastery(userId: string, topicId: string, score: number) {
  const m = await db.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } });
  const attempts = (m?.attempts ?? 0) + 1;
  const correct = (m?.correct ?? 0) + score;
  const accuracy = correct / attempts;
  await db.topicMastery.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: { userId, topicId, attempts, correct, accuracy, status: masteryStatus(attempts, accuracy) },
    update: { attempts, correct, accuracy, status: masteryStatus(attempts, accuracy) },
  });
}

/** Conclui a sessão: marca no plano, agenda R1..Rn ao terminar o assunto, soma XP, minutos e sequência. */
export async function completeSession(sessionId: string, userId: string) {
  const session = await db.studySession.findFirst({
    where: { id: sessionId, userId },
    include: { plannedSession: { include: { plan: { include: { preparation: true } } } } },
  });
  if (!session || session.completedAt) return session;
  const planned = session.plannedSession;
  const minutes = planned?.durationMin ?? Math.max(1, Math.round((Date.now() - session.startedAt.getTime()) / 60000));
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const day = today(user.timezone);

  await db.studySession.update({ where: { id: sessionId }, data: { completedAt: new Date(), minutesSpent: minutes } });
  if (planned) {
    await db.plannedSession.update({ where: { id: planned.id }, data: { status: "DONE" } });
    const prep = planned.plan.preparation;

    if (planned.kind === "STUDY" && planned.part >= planned.partCount) {
      await db.topicMastery.upsert({
        where: { userId_topicId: { userId, topicId: planned.topicId } },
        create: { userId, topicId: planned.topicId, studyDone: true },
        update: { studyDone: true },
      });
      for (const r of topicReviewDates(day, prep.reviewIntervals)) {
        await db.topicReview.upsert({
          where: { userId_topicId_reviewNumber: { userId, topicId: planned.topicId, reviewNumber: r.reviewNumber } },
          create: { userId, topicId: planned.topicId, reviewNumber: r.reviewNumber, dueDate: r.dueDate },
          update: { dueDate: r.dueDate, doneAt: null },
        });
      }
    }
    if (planned.kind === "REVIEW" && planned.reviewNumber) {
      await db.topicReview.updateMany({
        where: { userId, topicId: planned.topicId, reviewNumber: planned.reviewNumber },
        data: { doneAt: new Date() },
      });
    }
  }
  await addXp(userId, planned?.kind === "REVIEW" ? XP.reviewDone : XP.sessionDone, "sessao", sessionId);
  await registerStudy(userId, minutes);
  return session;
}
