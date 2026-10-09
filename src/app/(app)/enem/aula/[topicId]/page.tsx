import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { BookOpen, Crown, Lock, Mic, PenLine, Timer, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { warmLesson } from "@/lib/ai/tts";
import { getAccess, lessonPlanLock } from "@/lib/billing";
import { ENEM_TITLE, findLesson, LESSON_MINUTES, LESSON_QUESTIONS, lessonTopicId } from "@/lib/enem/catalog";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { enemSession, lessonUnlocked } from "@/lib/enem/progress";
import { recordingNotice } from "@/lib/enem/video-voice";
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

  const lock = lessonPlanLock(await getAccess(user), index, materia.lessons.length);
  if (lock) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {title}
        <Card className="space-y-3 text-center">
          <Crown className="mx-auto text-primary" size={32} />
          <p className="font-semibold">Aula do plano {lock.needs}</p>
          <p className="text-sm text-muted">
            O seu plano libera uma parte das aulas de cada matéria. Assine o plano {lock.needs} para estudar esta aula
            {lock.needs === "Completo" ? " e todas as outras" : " e metade das aulas de cada matéria"}.
          </p>
          <Link href="/assinatura" className={buttonClass("primary")}>Ver planos</Link>
        </Card>
      </div>
    );
  }

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

  // voz da aula ainda sendo gravada (gravação de todas as aulas em andamento): aula bloqueada, com aviso e o que fazer
  const recording = await recordingNotice(topicId);
  if (recording) {
    const when = recording.readyOn
      ? `no dia ${recording.readyOn.toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" }).replace(/^1 /, "1º ")}`
      : "hoje mesmo, em instantes";
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {title}
        <Card className="space-y-3 text-center">
          <Mic className="mx-auto text-primary" size={32} />
          <p className="font-semibold">Esta aula está sendo gravada</p>
          <p className="text-sm text-muted">
            Estamos gravando a voz desta aula para ela ficar ainda melhor. Ela fica pronta <strong className="text-foreground">{when}</strong>.
          </p>
          <p className="text-sm text-muted">Você já estudou bastante este tema por agora. Que tal colocar em prática o que aprendeu?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link href="/redacao/nova" className={buttonClass("primary")}><PenLine size={16} /> Fazer redação</Link>
            <Link href="/teste-rapido" className={buttonClass("secondary")}><Timer size={16} /> Teste rápido</Link>
            <Link href="/simulados/novo" className={buttonClass("secondary")}><Trophy size={16} /> Simulado</Link>
          </div>
          <Link href={back} className="block text-sm text-muted hover:text-foreground">Ver outras aulas de {materia.name}</Link>
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
            <li>Assista à aula em vídeo (slides com a voz do robô) ou leia o texto, se preferir.</li>
            {lesson.quiz ? (
              <li>
                Responda o quiz: {lesson.quiz.choices.length} perguntas de marcar e {lesson.quiz.open.length} de escrever, sobre o que você estudou.
                As de escrever são corrigidas pela IA.
              </li>
            ) : (
              <li>Responda {LESSON_QUESTIONS} questões reais do ENEM de {materia.name}.</li>
            )}
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

  const view = (
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
      video={{ topicId, slug: materia.slug, materia: materia.name, lesson: index + 1, title: lesson.title, highlights: lesson.highlights, keyPoints: lesson.keyPoints }}
    />
  );
  if (!lesson.essay) return view;
  return (
    <div className="space-y-6">
      {view}
      <Card className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 border-primary/40 bg-primary/5">
        <PenLine className="shrink-0 text-primary" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">Atividade de redação desta aula</p>
          <p className="text-muted">Tema: {lesson.essay.theme}</p>
        </div>
        <Link href={`/redacao/nova?aula=${topicId}`} className={buttonClass("primary", "sm")}>Escrever a redação</Link>
      </Card>
    </div>
  );
}
