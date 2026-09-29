"use server";
import { aiErrorMessage } from "@/lib/ai/client";
import { redirect } from "next/navigation";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError } from "@/lib/billing";
import { createExam, EXAM_DURATIONS, EXAM_SIZES, ExamError, saveAnswers, startAttempt, submitAttempt } from "@/lib/exams";
import type { FormState } from "./account";

export async function createExamAction(_: FormState, f: FormData): Promise<FormState & { upgrade?: boolean }> {
  const user = await requireReadyUser();
  const limit = await featureLimitError(user, "exam");
  if (limit) return { error: limit, upgrade: true };
  const count = Number(f.get("questionCount"));
  const duration = Number(f.get("durationMin"));
  if (!EXAM_SIZES.includes(count as (typeof EXAM_SIZES)[number])) return { error: "Quantidade de questões inválida." };
  if (!EXAM_DURATIONS.includes(duration as (typeof EXAM_DURATIONS)[number])) return { error: "Escolha 30 minutos, 1 hora ou 3 horas." };
  let examId: string;
  try {
    const exam = await createExam({
      userId: user.id,
      preparationId: String(f.get("preparationId")),
      subjectIds: f.getAll("subjectIds").map(String),
      questionCount: count,
      durationMin: duration,
      title: String(f.get("title") ?? ""),
    });
    examId = exam.id;
  } catch (e) {
    if (e instanceof ExamError) return { error: e.message };
    console.error("[simulado]", e);
    return { error: aiErrorMessage(e, "Não foi possível montar o simulado agora. Tente de novo.") };
  }
  redirect(`/simulados/${examId}`);
}

export async function startAttemptAction(examId: string) {
  const user = await requireReadyUser();
  await startAttempt(examId, user.id);
  redirect(`/simulados/${examId}`);
}

export async function saveAnswersAction(attemptId: string, answers: Record<string, string>) {
  const user = await requireReadyUser();
  return saveAnswers(attemptId, user.id, answers);
}

export async function submitAttemptAction(attemptId: string, answers: Record<string, string>) {
  const user = await requireReadyUser();
  const a = await submitAttempt(attemptId, user.id, answers);
  if (a) redirect(`/simulados/${a.examId}?resultado=${a.id}`);
}
