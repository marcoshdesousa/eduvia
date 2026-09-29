"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BookOpen, Brain, CheckCircle2, Lightbulb, PartyPopper } from "lucide-react";
import { completeSessionAction } from "@/app/actions/study";
import { QuestionCard, SourceLinks, type QuestionData, type SourceRef } from "@/components/question-card";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/badge";
import { cn, formatMinutes } from "@/lib/utils";

export type SessionQuestion = QuestionData;

type Header = { topic: string; subject: string; preparation: string; preparationId: string; kind: string; label: string; minutes: number };
type Text = { content: string | null; highlights: string[]; keyPoints: { term: string; explanation: string }[]; refs: SourceRef[] } | null;

/** Troca [T1] no texto por links para o trecho original do material. */
function linkSources(md: string, refs: SourceRef[]) {
  const byLabel = new Map(refs.map((r) => [r.label, r]));
  return md.replace(/\[(T\d+)\]/g, (m, label: string) => {
    const r = byLabel.get(label);
    return r ? `[↗ p.${r.pageStart}](/api/materials/${r.materialId}/file?page=${r.pageStart})` : "";
  });
}

export function SessionView({ header, sessionId, completed, text, questions }: { header: Header; sessionId: string; completed: boolean; text: Text; questions: SessionQuestion[] }) {
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
  const [summary, setSummary] = useState<{ correct: number; total: number } | null>(null);
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
          {completed || summary ? (
            <>
              <PartyPopper className="mx-auto text-primary" size={32} />
              <p className="mt-3 text-lg font-semibold">Sessão concluída!</p>
              {summary && summary.total > 0 && <p className="mt-1 text-sm text-muted">Você acertou {summary.correct} de {summary.total}. Os erros foram para o banco de erros.</p>}
              <Link href="/inicio" className={buttonClass("primary", "md", "mt-4")}>Voltar ao início</Link>
            </>
          ) : (
            <>
              <p className="font-medium">Tudo pronto?</p>
              <p className="mt-1 text-sm text-muted">Ao concluir, registramos seu progresso e agendamos as próximas revisões.</p>
              <Button className="mt-4" disabled={pending} onClick={() => start(async () => setSummary(await completeSessionAction(sessionId)))}>
                {pending ? "Salvando..." : "Concluir sessão"}
              </Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
