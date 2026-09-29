import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { getOwnedPlanned } from "@/lib/study";
import type { SourceRef } from "@/components/question-card";
import { SessionLoader } from "./session-loader";
import { SessionView, type SessionQuestion } from "./session-view";

export const metadata = { title: "Estudar" };

export default async function Page({ params }: { params: Promise<{ plannedId: string }> }) {
  const user = await requireReadyUser();
  const { plannedId } = await params;
  const planned = await getOwnedPlanned(plannedId, user.id);
  if (!planned) notFound();

  const header = {
    topic: planned.topic.title,
    subject: planned.topic.subject.name,
    preparation: planned.plan.preparation.title,
    preparationId: planned.plan.preparation.id,
    kind: planned.kind,
    label: planned.kind === "REVIEW" ? (planned.reviewNumber ? `Revisão R${planned.reviewNumber}` : "Reforço") : planned.partCount > 1 ? `Parte ${planned.part} de ${planned.partCount}` : "Estudo",
    minutes: planned.durationMin,
  };

  const session = planned.studySession;
  if (!session) return <SessionLoader plannedId={plannedId} header={header} />;

  const [text, questions, attempts] = await Promise.all([
    session.studyTextId ? db.studyText.findUnique({ where: { id: session.studyTextId } }) : null,
    db.question.findMany({ where: { id: { in: session.questionIds } } }),
    db.attempt.findMany({ where: { userId: user.id, contextId: session.id } }),
  ]);
  // Na revisão, relembra os pontos-chave dos textos já estudados do assunto.
  const recap =
    !text && planned.kind === "REVIEW"
      ? await db.studyText.findMany({ where: { topicId: planned.topicId, studentType: planned.plan.preparation.studentType }, orderBy: { part: "asc" } })
      : [];

  const byId = new Map(questions.map((q) => [q.id, q]));
  const ordered: SessionQuestion[] = session.questionIds.flatMap((id) => {
    const q = byId.get(id);
    if (!q) return [];
    const a = attempts.find((x) => x.questionId === id);
    return [
      {
        id: q.id,
        type: q.type,
        statement: q.statement,
        options: (q.options as string[] | null) ?? null,
        sourceRefs: q.sourceRefs as SourceRef[],
        answered: a
          ? { answer: a.answer, isCorrect: a.isCorrect, score: a.score, feedback: a.feedback, correctAnswer: q.correctAnswer, explanation: q.explanation }
          : null,
      },
    ];
  });

  return (
    <SessionView
      header={header}
      sessionId={session.id}
      completed={!!session.completedAt}
      text={
        text
          ? { content: text.content, highlights: text.highlights as string[], keyPoints: text.keyPoints as { term: string; explanation: string }[], refs: text.sourceRefs as SourceRef[] }
          : recap.length
            ? { content: null, highlights: recap.flatMap((r) => r.highlights as string[]), keyPoints: recap.flatMap((r) => r.keyPoints as { term: string; explanation: string }[]), refs: recap.flatMap((r) => r.sourceRefs as SourceRef[]) }
            : null
      }
      questions={ordered}
    />
  );
}
