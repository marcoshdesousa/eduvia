"use client";
import { sourceHref } from "@/lib/sources";
import { useRef, useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { answerAction } from "@/app/actions/study";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type Answered = { answer: string; isCorrect: boolean; score: number; feedback: string | null; correctAnswer: string; explanation: string };
export type { SourceRef } from "@/lib/sources";
import type { SourceRef } from "@/lib/sources";
export type QuestionData = {
  id: string;
  type: "MULTIPLE_CHOICE" | "CERTO_ERRADO" | "OPEN_RECALL";
  statement: string;
  options: string[] | null;
  sourceRefs: SourceRef[];
  answered: Answered | null;
};

const LETTERS = "ABCDEFGH";

export function SourceLinks({ refs }: { refs: SourceRef[] }) {
  if (!refs?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {refs.map((r, i) => (
        <a key={i} href={sourceHref(r)} data-title={`${r.title}, p. ${r.pageStart}`} className="inline-flex items-center gap-1 text-primary hover:underline">
          <ExternalLink size={12} /> {r.title}, p. {r.pageStart}{r.pageEnd !== r.pageStart ? `–${r.pageEnd}` : ""}
        </a>
      ))}
    </div>
  );
}

export function QuestionCard({
  q,
  index,
  sessionId,
  onAnswered,
}: {
  q: QuestionData;
  index?: number;
  sessionId: string | null;
  onAnswered?: (a: Answered) => void;
}) {
  const [answered, setAnswered] = useState<Answered | null>(q.answered);
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const startedAt = useRef(Date.now());

  function submit(answer: string) {
    setError(null);
    start(async () => {
      const res = await answerAction({ sessionId, questionId: q.id, answer, timeMs: Date.now() - startedAt.current });
      if ("error" in res && res.error) return setError(res.error);
      if ("result" in res && res.result) {
        const a = { ...res.result, answer };
        setAnswered(a);
        onAnswered?.(a);
      }
    });
  }

  const isOpen = q.type === "OPEN_RECALL";
  const verdict = answered ? (answered.isCorrect ? "correct" : isOpen && answered.score >= 0.4 ? "partial" : "wrong") : null;

  return (
    <Card className="space-y-4" data-question={q.id}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-medium text-muted">
          {index !== undefined && `Questão ${index + 1} · `}
          {isOpen ? "Recuperação ativa — responda sem consultar" : q.type === "CERTO_ERRADO" ? "Certo ou errado" : "Múltipla escolha"}
        </div>
        {verdict === "correct" && <Badge tone="success">Acertou</Badge>}
        {verdict === "partial" && <Badge tone="warning">Parcial</Badge>}
        {verdict === "wrong" && <Badge tone="danger">Errou · foi para o banco de erros</Badge>}
      </div>
      <p className="whitespace-pre-line leading-relaxed">{q.statement}</p>

      {isOpen ? (
        answered ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-surface-2 p-3"><div className="text-xs text-muted">Sua resposta</div>{answered.answer || "—"}</div>
            {answered.feedback && <p>{answered.feedback}</p>}
            <div className="rounded-lg border border-success/40 bg-success/10 p-3"><div className="text-xs text-muted">Resposta-modelo</div>{answered.correctAnswer}</div>
          </div>
        ) : (
          <div className="space-y-2">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva com suas palavras o que você lembra..." rows={4} />
            <div className="flex gap-2">
              <Button disabled={pending || !text.trim()} onClick={() => submit(text)}>{pending ? "Corrigindo..." : "Enviar resposta"}</Button>
              <Button variant="ghost" disabled={pending} onClick={() => submit("")}>Não lembro</Button>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-2">
          {(q.options ?? []).map((opt, i) => {
            const value = String(i);
            const isCorrect = answered && answered.correctAnswer === value;
            const isChosen = answered ? answered.answer === value : selected === value;
            return (
              <button
                key={i}
                type="button"
                disabled={!!answered || pending}
                onClick={() => setSelected(value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                  !answered && (isChosen ? "border-primary bg-primary/10" : "border-border hover:bg-surface-2"),
                  answered && isCorrect && "border-success bg-success/10",
                  answered && isChosen && !isCorrect && "border-danger bg-danger/10",
                  answered && !isCorrect && !isChosen && "border-border opacity-70",
                )}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-semibold">
                  {q.type === "CERTO_ERRADO" ? (i === 0 ? "C" : "E") : LETTERS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && isCorrect && <CheckCircle2 size={18} className="shrink-0 text-success" />}
                {answered && isChosen && !isCorrect && <XCircle size={18} className="shrink-0 text-danger" />}
              </button>
            );
          })}
          {!answered && <Button disabled={pending || selected === null} onClick={() => selected !== null && submit(selected)}>{pending ? "Verificando..." : "Responder"}</Button>}
          {answered && <div className="rounded-lg bg-surface-2 p-3 text-sm"><span className="font-medium">Explicação: </span>{answered.explanation}</div>}
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      {answered && <SourceLinks refs={q.sourceRefs} />}
    </Card>
  );
}
