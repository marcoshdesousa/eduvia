"use server";
import { aiErrorMessage } from "@/lib/ai/client";
import { explainCorrectAnswer } from "@/lib/ai/tasks";
import { profileVoice } from "@/lib/core/profiles";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { chunksForPart } from "@/lib/study";

/** Aula curta ensinando a resposta certa de uma questão do banco de erros (gerada uma vez e guardada). */
export async function lessonAction(questionId: string): Promise<{ lesson: string } | { error: string }> {
  const user = await requireReadyUser();
  const item = await db.reviewItem.findFirst({
    where: { userId: user.id, questionId },
    include: { question: { include: { topic: { include: { subject: { include: { preparation: { include: { editalAnalysis: true } } } } } } } } },
  });
  if (!item) return { error: "Questão não encontrada." };
  const q = item.question;
  if (q.lesson) return { lesson: q.lesson };
  const prep = q.topic.subject.preparation;
  const options = (q.options as string[] | null) ?? [];
  try {
    const chunks = await chunksForPart(prep.id, q.topic, 1, 1, 8_000);
    const lesson = await explainCorrectAnswer({
      userId: user.id,
      voice: profileVoice(prep.studentType, (prep.details ?? {}) as Record<string, unknown>, prep.editalAnalysis?.banca),
      statement: q.statement,
      options,
      correct: options[Number(q.correctAnswer)] ?? q.correctAnswer,
      explanation: q.explanation,
      chunks,
    });
    await db.question.update({ where: { id: q.id }, data: { lesson } });
    return { lesson };
  } catch (e) {
    console.error("[aula]", e);
    return { error: aiErrorMessage(e, "Não foi possível preparar a explicação agora. Tente de novo.") };
  }
}
