import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { BookOpen, Lock } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { warmLesson } from "@/lib/ai/tts";
import { ENEM_TITLE, findLesson, LESSON_MINUTES, LESSON_QUESTIONS, lessonTopicId } from "@/lib/enem/catalog";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { enemSession, lessonUnlocked } from "@/lib/enem/progress";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SessionView, type SessionQuestion } from "../../../estudar/[plannedId]/session-view";
import { StartLesson } from "./start-lesson";
import { nearestSessionMinutes, SESSION_MINUTES } from "@/lib/study";

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }) {
  const f = findLesson((await params).topicId);
  return { title: f ? `${f.lesson.title} · ${f.materia.name}` : ENEM_TITLE };
}

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
  const user = await requireReadyUser();
  const { topicId } = await params;
  const found = findLesson(topicId);
  if (!found) notFound();
  await ensureEnemCatalog();
  const { materia, index, lesson } = found;
  const back = `/enem/${materia.slug}`;
  const header = {
    topic: lesson.title,
    subject: materia.name,
    preparation: materia.name,
    preparationId: "enem",
    backHref: back,
    kind: "STUDY",
    label: `Aula ${index + 1} de ${materia.lessons.length}`,
    minutes: LESSON_MINUTES,
  };
  const title = (
    <div>
      <Link href={back} className="text-sm text-muted hover:text-foreground">← {materia.name}</Link>
      <p className="mt-2 text-sm text-muted">{header.subject} · {header.label}</p>
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
    </div>
  );

  if (!(await lessonUnlocked(user.id, topicId))) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {title}
        <Card className="space-y-3 text-center">
          <Lock className="mx-auto text-muted" size={32} />
          <p className="font-semibold">Aula bloqueada</p>
          <p className="text-sm text-muted">Para liberar esta aula, faça antes <strong className="text-foreground">{materia.lessons[index - 1]?.title}</strong> e tire pelo menos 75%.</p>
          <Link href={`/enem/aula/${lessonTopicId(materia.slug, index - 1)}`} className={buttonClass("primary")}>Ir para a aula anterior</Link>
        </Card>
      </div>
    );
  }

  const session = await enemSession(user.id, topicId);
  const minutes = session?.chosenMinutes ?? 20;
  // aula aberta há muito tempo e não terminada: escolhe o tempo de novo e recomeça
  const stale = !!session && !session.completedAt && Date.now() - session.roundStartedAt.getTime() > (minutes + 60) * 60_000;
  if (!session || stale) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {title}
        <Card className="space-y-3">
          <p className="flex items-center gap-2 font-semibold"><BookOpen size={18} className="text-primary" /> Como é a aula</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>Leia o texto (ou ouça o robô lendo para você).</li>
            <li>Responda {LESSON_QUESTIONS} questões reais do ENEM de {materia.name}. Elas são do conteúdo geral da matéria, como na prova.</li>
            <li>Com 75% ou mais, a próxima aula é liberada. Pode refazer quantas vezes quiser.</li>
          </ol>
          <StartLesson topicId={topicId} options={SESSION_MINUTES} suggested={nearestSessionMinutes(minutes)} resume={stale} />
        </Card>
      </div>
    );
  }

  const [text, questions, attempts] = await Promise.all([
    session.studyTextId ? db.studyText.findUnique({ where: { id: session.studyTextId } }) : db.studyText.findFirst({ where: { topicId } }),
    db.question.findMany({ where: { id: { in: session.questionIds } } }),
    db.attempt.findMany({ where: { userId: user.id, contextId: session.id, createdAt: { gte: session.roundStartedAt } } }),
  ]);
  if (text?.content) {
    const { content } = text;
    after(() => warmLesson(content, []).catch(() => {}));
  }
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
        sourceRefs: [],
        answered: a ? { answer: a.answer, isCorrect: a.isCorrect, score: a.score, feedback: a.feedback, correctAnswer: q.correctAnswer, explanation: q.explanation } : null,
      },
    ];
  });

  return (
    <SessionView
      key={session.roundStartedAt.toISOString()}
      minuteOptions={{ options: SESSION_MINUTES, suggested: nearestSessionMinutes(minutes) }}
      grade={{ tries: session.tries, best: session.bestScore, last: session.lastScore, passed: !!session.passedAt }}
      header={{ ...header, minutes }}
      sessionId={session.id}
      startedAt={session.roundStartedAt.toISOString()}
      completed={!!session.completedAt}
      text={text ? { content: text.content, highlights: text.highlights as string[], keyPoints: text.keyPoints as { term: string; explanation: string }[], refs: [] } : null}
      questions={ordered}
    />
  );
}
