"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { LessonNarrator } from "@/components/lesson-narrator";
import { ContentReadyToast, finishMessage, StudyTimer } from "./study-timer";
import { BookOpen, Brain, CheckCircle2, Lightbulb, PartyPopper, RotateCcw, XCircle } from "lucide-react";
import { completeSessionAction, retakeSessionAction } from "@/app/actions/study";
import { useRouter } from "next/navigation";
import { QuestionCard, SourceLinks, type QuestionData, type SourceRef } from "@/components/question-card";
import { linkSources } from "@/lib/sources";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/badge";
import { cn, formatMinutes } from "@/lib/utils";

export type SessionQuestion = QuestionData;

type Header = { topic: string; subject: string; preparation: string; preparationId: string; kind: string; label: string; minutes: number };
type Text = { content: string | null; highlights: string[]; keyPoints: { term: string; explanation: string }[]; refs: SourceRef[] } | null;

type Grade = { tries: number; best: number | null; last: number | null; passed: boolean } | null;
const pct = (x: number) => `${Math.round(x * 100)}%`;

export function SessionView({
  header,
  sessionId,
  startedAt,
  completed,
  text,
  questions,
  grade,
}: {
  header: Header;
  sessionId: string;
  startedAt: string;
  completed: boolean;
  text: Text;
  questions: SessionQuestion[];
  grade: Grade;
}) {
  const router = useRouter();
  const recall = questions.filter((q) => q.type === "OPEN_RECALL");
  const objective = questions.filter((q) => q.type !== "OPEN_RECALL");
  const steps = useMemo(
    () => [
      ...(text ? [{ key: "texto", label: header.kind === "REVIEW" ? "Relembre" : "Estude", icon: BookOpen }] : []),
      ...(recall.length ? [{ key: "recall", label: "Recupere", icon: Brain }] : []),
      ...(objective.length ? [{ key: "questoes", label: "Pratique", icon: Lightbulb }] : []),
      { key: "fim", label: "Concluir", icon: CheckCircle2 },
    ],
    [text, recall.length, objective.length, header.kind],
  );
  const [step, setStep] = useState(completed ? steps.length - 1 : 0);
  const [answeredIds, setAnsweredIds] = useState(() => new Set(questions.filter((q) => q.answered).map((q) => q.id)));
  const [summary, setSummary] = useState<{ correct: number; total: number; score: number; passed: boolean; best: number; nextPlannedId: string | null } | null>(null);
  const [comfort, setComfort] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const current = steps[step].key;
  const markAnswered = (id: string) => setAnsweredIds((s) => new Set(s).add(id));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href={`/preparacoes/${header.preparationId}`} className="text-sm text-muted hover:text-foreground">← {header.preparation}</Link>
        <p className="mt-2 text-sm text-muted">{header.subject} · {header.label} · {formatMinutes(header.minutes)}</p>
        <h1 className="text-2xl font-bold">{header.topic}</h1>
      </div>
      {!completed && !summary && <StudyTimer startedAt={startedAt} minutes={header.minutes} />}
      <ContentReadyToast />

      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => (i <= step || completed) && setStep(i)}
              className={cn("flex w-full flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium", i === step ? "bg-primary/15 text-primary" : i < step ? "text-success" : "text-muted")}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          </li>
        ))}
      </ol>

      {current === "texto" && text && (
        <div className="space-y-4">
          {text.content && <LessonNarrator text={text.content} />}
          {text.content && (
            <Card>
              <article className="prose-study">
                <ReactMarkdown components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" className="text-xs text-primary no-underline hover:underline" /> }}>
                  {linkSources(text.content, text.refs)}
                </ReactMarkdown>
              </article>
            </Card>
          )}
          {text.highlights.length > 0 && (
            <Card className="border-primary/40">
              <CardTitle>Destaques</CardTitle>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">{text.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </Card>
          )}
          {text.keyPoints.length > 0 && (
            <Card>
              <CardTitle>Para entender</CardTitle>
              <dl className="mt-2 space-y-2 text-sm">
                {text.keyPoints.map((k, i) => (
                  <div key={i}><dt className="font-semibold">{k.term}</dt><dd className="text-muted">{k.explanation}</dd></div>
                ))}
              </dl>
            </Card>
          )}
          {text.refs.length > 0 && (
            <div className="space-y-1"><div className="text-xs font-medium text-muted">Fontes no seu material</div><SourceLinks refs={text.refs} /></div>
          )}
          <Button className="w-full sm:w-auto" onClick={() => setStep(step + 1)}>{recall.length ? "Já li — testar sem consultar" : "Continuar"}</Button>
        </div>
      )}

      {current === "recall" && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Feche o material e responda com o que lembrar. Tentar lembrar é o que fixa o conteúdo — mesmo errando.</p>
          {recall.map((q, i) => <QuestionCard key={q.id} q={q} index={i} sessionId={sessionId} onAnswered={() => markAnswered(q.id)} />)}
          <Button disabled={!recall.every((q) => answeredIds.has(q.id))} onClick={() => setStep(step + 1)}>Continuar</Button>
        </div>
      )}

      {current === "questoes" && (
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted"><span>Questões respondidas</span><span>{objective.filter((q) => answeredIds.has(q.id)).length}/{objective.length}</span></div>
            <Progress value={objective.filter((q) => answeredIds.has(q.id)).length / objective.length} />
          </div>
          {objective.map((q, i) => <QuestionCard key={q.id} q={q} index={i} sessionId={sessionId} onAnswered={() => markAnswered(q.id)} />)}
          <Button disabled={!objective.every((q) => answeredIds.has(q.id))} onClick={() => setStep(step + 1)}>Continuar</Button>
        </div>
      )}

      {current === "fim" && (
        <Card className="text-center">
          {summary || completed ? (
            <FinishCard
              summary={summary}
              grade={grade}
              isLesson={header.kind === "STUDY"}
              comfort={comfort}
              pending={pending}
              onRetake={() =>
                start(async () => {
                  await retakeSessionAction(sessionId);
                  router.refresh();
                })
              }
            />
          ) : (
            <>
              <p className="font-medium">Tudo pronto?</p>
              <p className="mt-1 text-sm text-muted">
                {header.kind === "STUDY" ? "Ao concluir, calculamos a sua nota. Com 75% ou mais, a próxima aula é liberada." : "Ao concluir, registramos seu progresso e agendamos as próximas revisões."}
              </p>
              <Button
                className="mt-4"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    setComfort(finishMessage(startedAt, header.minutes));
                    const r = await completeSessionAction(sessionId);
                    if (r) setSummary(r);
                  })
                }
              >
                {pending ? "Calculando..." : "Concluir e ver a nota"}
              </Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

function FinishCard({
  summary,
  grade,
  isLesson,
  comfort,
  pending,
  onRetake,
}: {
  summary: { correct: number; total: number; score: number; passed: boolean; best: number; nextPlannedId: string | null } | null;
  grade: Grade;
  isLesson: boolean;
  comfort: string | null;
  pending: boolean;
  onRetake: () => void;
}) {
  const score = summary?.score ?? grade?.last ?? null;
  const passed = summary ? summary.passed : !isLesson || !!grade?.passed;
  const best = summary?.best ?? grade?.best ?? null;
  const next = summary?.nextPlannedId;
  return (
    <div className="space-y-3">
      {passed ? <PartyPopper className="mx-auto text-primary" size={32} /> : <XCircle className="mx-auto text-danger" size={32} />}
      {isLesson && score !== null && (
        <div>
          <div className={cn("text-5xl font-extrabold", passed ? "text-success" : "text-danger")}>{pct(score)}</div>
          <p className="text-xs text-muted">nota desta tentativa{best !== null && best > score ? ` · sua melhor nota: ${pct(best)}` : ""} · mínimo para passar: 75%</p>
        </div>
      )}
      <p className="text-lg font-semibold">
        {!isLesson ? "Sessão concluída!" : passed ? "Aula aprovada! Próxima aula liberada." : "Quase lá! Você ainda não passou nesta aula."}
      </p>
      {isLesson && !passed && (
        <p className="mx-auto max-w-md text-sm text-muted">
          Você precisa de pelo menos 75% para liberar a próxima aula. Releia o texto com calma (ele continua aqui) e refaça as perguntas. Errar faz parte de aprender!
        </p>
      )}
      {summary && summary.total > 0 && <p className="text-sm text-muted">Você acertou {summary.correct} de {summary.total}. Os erros foram para o banco de erros.</p>}
      {comfort && passed && <p className="mx-auto max-w-md text-sm">{comfort}</p>}
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        {isLesson && !passed && (
          <Button disabled={pending} onClick={onRetake}><RotateCcw size={16} /> Reestudar e refazer a aula</Button>
        )}
        {passed && next && <Link href={`/estudar/${next}`} className={buttonClass("primary")}>Próxima aula</Link>}
        {passed && !next && <Link href="/inicio" className={buttonClass("primary")}>Voltar ao início</Link>}
        {isLesson && passed && (
          <Button variant="outline" disabled={pending} onClick={onRetake}><RotateCcw size={16} /> Refazer para melhorar a nota</Button>
        )}
      </div>
    </div>
  );
}
