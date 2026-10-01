import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { getOwnedPlanned, lessonBlocker, nearestSessionMinutes, SESSION_MINUTES } from "@/lib/study";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";
import { restAdvice, restSuggestions } from "@/lib/rest";
import { RestCard } from "@/components/rest-card";
import { SessionStart } from "./session-start";
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

  // a próxima aula só libera quando as anteriores foram aprovadas (75% ou mais)
  const blocker = await lessonBlocker(planned);
  if (blocker) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div>
          <p className="text-sm text-muted">{header.subject} · {header.label}</p>
          <h1 className="text-2xl font-bold">{header.topic}</h1>
        </div>
        <Card className="space-y-3 text-center">
          <Lock className="mx-auto text-muted" size={32} />
          <p className="font-semibold">Aula bloqueada</p>
          <p className="text-sm text-muted">
            Para liberar esta aula, faça antes <strong className="text-foreground">{blocker.topic.title}</strong> e tire pelo menos 75%.
            Assim você aprende de verdade, um passo de cada vez.
          </p>
          <Link href={`/estudar/${blocker.id}`} className={buttonClass("primary")}>Ir para a aula pendente</Link>
        </Card>
      </div>
    );
  }

  const session = planned.studySession;
  if (!session) {
    if (planned.kind !== "STUDY") return <SessionLoader plannedId={plannedId} header={header} />;
    const advice = await restAdvice(user);
    const rest = advice ? (
      <RestCard
        title={advice.reason === "time" ? `Você já estudou ${Math.floor(advice.minutesToday / 60)}h${advice.minutesToday % 60 ? ` ${advice.minutesToday % 60}min` : ""} hoje. Descanse um pouco! 🌿` : "Três sessões seguidas sem pausa! Descanse um pouco. 🌿"}
        suggestions={await restSuggestions(user, planned.topicId)}
      >
        <span />
      </RestCard>
    ) : null;
    return <SessionStart plannedId={plannedId} header={header} options={SESSION_MINUTES} suggested={nearestSessionMinutes(planned.durationMin)} rest={rest} />;
  }

  const [text, questions, attempts] = await Promise.all([
    session.studyTextId ? db.studyText.findUnique({ where: { id: session.studyTextId } }) : null,
    db.question.findMany({ where: { id: { in: session.questionIds } } }),
    db.attempt.findMany({ where: { userId: user.id, contextId: session.id, createdAt: { gte: session.roundStartedAt } } }),
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
      key={session.roundStartedAt.toISOString()}
      grade={planned.kind === "STUDY" ? { tries: session.tries, best: session.bestScore, last: session.lastScore, passed: !!session.passedAt } : null}
      header={header}
      sessionId={session.id}
      startedAt={session.roundStartedAt.toISOString()}
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
