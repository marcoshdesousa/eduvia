// Simulados: montagem proporcional ao peso das disciplinas, correção e resultado.
import { db } from "@/lib/db";
import { ensureQuestionPool, questionStyleFor } from "@/lib/question-bank";
import { answerQuestion } from "@/lib/study";
import { addXp } from "@/lib/gamification";

export const EXAM_SIZES = [10, 20, 30, 50] as const;
export const MINUTES_PER_QUESTION = 3;
/** Tolerância para entregas que chegam um pouco depois do fim do tempo (rede lenta). */
const GRACE_MS = 60_000;

/** Divide `total` questões entre as disciplinas proporcionalmente ao peso (mínimo 1 cada). */
export function allocateBySubject(subjects: { id: string; weight: number }[], total: number): Map<string, number> {
  const sum = subjects.reduce((s, x) => s + Math.max(0.1, x.weight), 0);
  const raw = subjects.map((s) => ({ id: s.id, exact: (total * Math.max(0.1, s.weight)) / sum }));
  const out = new Map(raw.map((r) => [r.id, Math.max(1, Math.floor(r.exact))]));
  let left = total - [...out.values()].reduce((a, b) => a + b, 0);
  for (const r of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break;
    out.set(r.id, out.get(r.id)! + 1);
    left--;
  }
  // se o mínimo de 1 estourou o total, tira das maiores
  while (left < 0) {
    const [id, n] = [...out.entries()].sort((a, b) => b[1] - a[1])[0];
    if (n <= 1) break;
    out.set(id, n - 1);
    left++;
  }
  return out;
}

export async function createExam(input: { userId: string; preparationId: string; subjectIds: string[]; questionCount: number; durationMin: number; title?: string }) {
  const prep = await db.preparation.findFirst({
    where: { id: input.preparationId, userId: input.userId },
    include: { editalAnalysis: true, subjects: { include: { topics: { select: { id: true } } } } },
  });
  if (!prep) throw new ExamError("Preparação não encontrada.");
  const subjects = prep.subjects.filter((s) => s.topics.length && (!input.subjectIds.length || input.subjectIds.includes(s.id)));
  if (!subjects.length) throw new ExamError("Escolha disciplinas que já tenham assuntos (envie os materiais primeiro).");

  const allocation = allocateBySubject(subjects, input.questionCount);
  const questionIds: string[] = [];
  for (const s of subjects) {
    const ids = await ensureQuestionPool({ userId: input.userId, prep, topicIds: s.topics.map((t) => t.id), needed: allocation.get(s.id) ?? 0, purpose: "simulado" });
    questionIds.push(...ids);
  }
  if (questionIds.length < Math.min(5, input.questionCount)) throw new ExamError("Ainda não há material suficiente para montar este simulado.");

  const n = await db.exam.count({ where: { ownerId: input.userId, preparationId: prep.id } });
  return db.exam.create({
    data: {
      ownerId: input.userId,
      preparationId: prep.id,
      title: input.title?.trim() || `Simulado ${n + 1} — ${prep.title}`,
      style: questionStyleFor(prep),
      durationMin: input.durationMin,
      subjectIds: subjects.map((s) => s.id),
      questionIds,
    },
  });
}

export class ExamError extends Error {}

export async function startAttempt(examId: string, userId: string) {
  const exam = await db.exam.findFirst({ where: { id: examId, ownerId: userId } });
  if (!exam) return null;
  const open = await db.examAttempt.findFirst({ where: { examId, userId, finishedAt: null } });
  if (open) return open;
  return db.examAttempt.create({ data: { examId, userId, deadline: new Date(Date.now() + exam.durationMin * 60_000) } });
}

export async function saveAnswers(attemptId: string, userId: string, answers: Record<string, string>) {
  const attempt = await db.examAttempt.findFirst({ where: { id: attemptId, userId, finishedAt: null }, include: { exam: true } });
  if (!attempt || Date.now() > attempt.deadline.getTime() + GRACE_MS) return false;
  const clean = Object.fromEntries(Object.entries(answers).filter(([k, v]) => attempt.exam.questionIds.includes(k) && typeof v === "string" && v.length < 10));
  await db.examAttempt.update({ where: { id: attemptId }, data: { answers: clean } });
  return true;
}

/** Entrega: corrige todas as questões (em branco conta como erro e vai para o banco de erros). */
export async function submitAttempt(attemptId: string, userId: string, answers?: Record<string, string>) {
  if (answers) await saveAnswers(attemptId, userId, answers);
  const attempt = await db.examAttempt.findFirst({ where: { id: attemptId, userId }, include: { exam: true } });
  if (!attempt) return null;
  if (attempt.finishedAt) return attempt;
  const saved = (attempt.answers ?? {}) as Record<string, string>;
  const questions = await db.question.findMany({ where: { id: { in: attempt.exam.questionIds } }, include: { topic: { include: { subject: true } } } });

  const perSubject = new Map<string, { name: string; correct: number; total: number }>();
  let correct = 0;
  for (const q of questions) {
    const given = saved[q.id] ?? "";
    const r = await answerQuestion({ userId, questionId: q.id, answer: given, context: "EXAM", contextId: attempt.id });
    const ok = !!r?.isCorrect;
    if (ok) correct++;
    const s = perSubject.get(q.topic.subjectId) ?? { name: q.topic.subject.name, correct: 0, total: 0 };
    s.total++;
    if (ok) s.correct++;
    perSubject.set(q.topic.subjectId, s);
  }
  const finishedAt = new Date();
  const timeSpentSec = Math.round((Math.min(finishedAt.getTime(), attempt.deadline.getTime()) - attempt.startedAt.getTime()) / 1000);
  const total = questions.length;
  const done = await db.examAttempt.update({
    where: { id: attempt.id },
    data: {
      finishedAt,
      correct,
      total,
      score: total ? Math.round((correct / total) * 1000) / 100 : 0,
      perSubject: [...perSubject.entries()].map(([id, s]) => ({ subjectId: id, ...s })),
      timeSpentSec,
    },
  });
  await addXp(userId, 10 + correct * 2, "simulado", attempt.id);
  return done;
}
