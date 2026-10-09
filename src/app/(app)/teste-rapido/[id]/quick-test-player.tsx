"use client";
import { QuestionText, isRichQuestion } from "@/components/rich-text";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { answerQuickAction, finishQuickAction } from "@/app/actions/quick-test";
import { PixelStage, type StageState } from "@/components/pixel-stage";
import { Card } from "@/components/ui/card";
import type { QuickAnswerResult, QuickQuestion } from "@/lib/quick-test";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDE";
const WIN_MS = 1500;
const LOSE_MS = 2200;

export function QuickTestPlayer({
  runId,
  name,
  seconds,
  questions,
  total,
  answeredBefore,
  correctBefore,
}: {
  runId: string;
  name: string;
  seconds: number;
  questions: QuickQuestion[];
  total: number;
  answeredBefore: number;
  correctBefore: number;
}) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<StageState>("idle");
  const [animKey, setAnimKey] = useState(0);
  const [level, setLevel] = useState(correctBefore + 1);
  const [left, setLeft] = useState(seconds * 1000);
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<QuickAnswerResult | null>(null);
  const [finishing, setFinishing] = useState(false);
  const startedAt = useRef(Date.now());
  const busy = useRef(false);
  const q = questions[idx];

  const finish = useCallback(async () => {
    setFinishing(true);
    await finishQuickAction(runId);
    router.refresh();
  }, [runId, router]);

  // todas já respondidas (voltou depois): só encerra
  useEffect(() => {
    if (!questions.length) void finish();
  }, [questions.length, finish]);

  const submit = useCallback(
    async (answer: string) => {
      if (busy.current || !q) return;
      busy.current = true;
      setChosen(answer);
      const res = await answerQuickAction(runId, q.id, answer, Date.now() - startedAt.current);
      const ok = !!res?.isCorrect;
      setResult(res);
      setStage(ok ? "win" : "lose");
      setAnimKey((k) => k + 1);
      if (ok) setLevel((l) => l + 1);
      setTimeout(() => {
        if (idx + 1 >= questions.length) {
          void finish();
          return;
        }
        setIdx((i) => i + 1);
        setStage("idle");
        setAnimKey((k) => k + 1);
        setChosen(null);
        setResult(null);
        setLeft(seconds * 1000);
        startedAt.current = Date.now();
        busy.current = false;
      }, ok ? WIN_MS : LOSE_MS);
    },
    [q, runId, idx, questions.length, seconds, finish],
  );

  // cronômetro da pergunta: acabou o tempo, conta como erro
  useEffect(() => {
    if (!q || chosen !== null) return;
    const t = setInterval(() => {
      const rest = seconds * 1000 - (Date.now() - startedAt.current);
      setLeft(Math.max(0, rest));
      if (rest <= 0) {
        clearInterval(t);
        void submit("");
      }
    }, 100);
    return () => clearInterval(t);
  }, [q, chosen, seconds, submit]);

  if (finishing || !q) {
    return (
      <Card className="py-10 text-center">
        <Loader2 className="mx-auto animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted">Calculando o resultado...</p>
      </Card>
    );
  }

  const number = answeredBefore + idx + 1;
  const pct = left / (seconds * 1000);
  const options = q.options.length ? q.options : ["Certo", "Errado"];
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <PixelStage state={stage} level={level} animKey={animKey} />
        <div className="text-right text-sm">
          <div className="font-semibold">{name}</div>
          <div className="text-muted">Pergunta {number} de {total}</div>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Tempo restante" aria-valuemin={0} aria-valuemax={seconds} aria-valuenow={Math.ceil(left / 1000)}>
        <div className={cn("h-full rounded-full transition-[width] duration-100", pct < 0.25 ? "bg-danger" : "bg-primary")} style={{ width: `${pct * 100}%` }} />
      </div>
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <QuestionText text={q.statement} rich={isRichQuestion(q.id)} className="min-w-0 flex-1" />
          <span className="shrink-0 rounded-md bg-surface-2 px-2 py-1 font-mono text-sm font-bold tabular-nums">{fmtLeft(Math.ceil(left / 1000))}</span>
        </div>
        <div className="grid gap-2">
          {options.map((opt, i) => {
            const value = String(i);
            const isRight = result && value === result.correctAnswer;
            const isWrongPick = result && chosen === value && !result.isCorrect;
            return (
              <button
                key={i}
                type="button"
                data-option={i}
                disabled={chosen !== null}
                onClick={() => void submit(value)}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  isRight ? "border-success bg-success/15" : isWrongPick ? "border-danger bg-danger/15" : "border-border hover:border-primary hover:bg-primary/5",
                  chosen !== null && !isRight && !isWrongPick && "opacity-60",
                )}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-2 text-xs font-bold">{LETTERS[i]}</span>
                <QuestionText text={opt} rich={isRichQuestion(q.id)} className="min-w-0 flex-1" />
              </button>
            );
          })}
        </div>
        {result && !result.isCorrect && (
          <p className="text-sm text-muted">{chosen === "" ? "⏱ Tempo esgotado. " : ""}{result.explanation}</p>
        )}
      </Card>
    </div>
  );
}

/** "45s" ou "1:45". */
function fmtLeft(s: number) {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
