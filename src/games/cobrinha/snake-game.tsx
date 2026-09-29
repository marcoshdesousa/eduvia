"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { answerPoints } from "@/games/catalog";
import type { GameAnswerResult, GameProps } from "@/games/types";
import { cn } from "@/lib/utils";

// Distância entre a cobra e o ratinho: 100 = longe, 0 = pegou.
const START = 70;
const CORRECT_PUSH = 24;
const SPEED: Record<string, number> = { lenta: 3.5, normal: 5.5, rapida: 8.5 };
const ACCEL_PER_HIT = 1.03;
const LETTERS = "ABCDEFGH";

export function SnakeGame({ questions, config, onAnswer, onFinish }: GameProps) {
  const maxErrors = Number(config.maxErrors) || 3;
  const [countdown, setCountdown] = useState(3);
  const [index, setIndex] = useState(0);
  const [distance, setDistance] = useState(START);
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<(GameAnswerResult & { chosen: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const dist = useRef(START);
  const speed = useRef(SPEED[config.speed] ?? SPEED.normal);
  const paused = useRef(true);
  const askedAt = useRef(0);
  const finished = useRef(false);

  const finish = useCallback(
    (reason: "caught" | "errors" | "finished") => {
      if (finished.current) return;
      finished.current = true;
      paused.current = true;
      setOver(true);
      setTimeout(() => onFinish(reason), reason === "caught" ? 900 : 300);
    },
    [onFinish],
  );

  // contagem regressiva
  useEffect(() => {
    if (countdown <= 0) {
      paused.current = false;
      askedAt.current = performance.now();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [countdown]);

  // a cobra avança continuamente enquanto o aluno pensa
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused.current) {
        dist.current = Math.max(0, dist.current - speed.current * dt);
        setDistance(dist.current);
        if (dist.current <= 0) finish("caught");
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const q = questions[index];

  async function answer(value: string) {
    if (busy || feedback || over || countdown > 0 || !q) return;
    setBusy(true);
    const timeMs = Math.round(performance.now() - askedAt.current);
    const res = await onAnswer(q.id, value, timeMs);
    setBusy(false);
    if (!res || finished.current) return;
    paused.current = true; // pausa enquanto mostra o resultado
    setFeedback({ ...res, chosen: value });
    if (res.isCorrect) {
      dist.current = Math.min(100, dist.current + CORRECT_PUSH);
      speed.current *= ACCEL_PER_HIT;
      setDistance(dist.current);
      setCorrect((c) => c + 1);
      setScore((s) => s + answerPoints(timeMs));
    } else {
      setWrong((w) => w + 1);
    }
    const errorsNow = wrong + (res.isCorrect ? 0 : 1);
    setTimeout(
      () => {
        setFeedback(null);
        if (errorsNow >= maxErrors) return finish("errors");
        if (index + 1 >= questions.length) return finish("finished");
        setIndex((i) => i + 1);
        askedAt.current = performance.now();
        paused.current = false;
      },
      res.isCorrect ? 650 : 1800,
    );
  }

  // atalhos de teclado: 1-5 ou A-E
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q) return;
      const n = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : LETTERS.toLowerCase().indexOf(e.key.toLowerCase());
      if (n >= 0 && n < q.options.length) answer(String(n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const danger = distance < 25;
  const gap = distance / 100; // 0..1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1" aria-label={`${maxErrors - wrong} vidas`}>
          {Array.from({ length: maxErrors }, (_, i) => (
            <span key={i} className={cn("text-lg", i < maxErrors - wrong ? "" : "opacity-20 grayscale")}>❤️</span>
          ))}
        </div>
        <div className="flex gap-4">
          <span>✅ {correct}</span>
          <span className="font-semibold">⭐ {score}</span>
        </div>
      </div>

      {/* pista */}
      <div
        className={cn(
          "relative h-24 overflow-hidden rounded-2xl border transition-colors",
          danger ? "animate-pulse border-danger bg-danger/15" : "border-success/40 bg-success/10",
        )}
        role="img"
        aria-label={`A cobra está a ${Math.round(distance)}% de distância`}
      >
        <div className="absolute inset-x-0 bottom-5 h-px border-t border-dashed border-foreground/20" />
        <div className="absolute bottom-3 text-5xl transition-[left] duration-100 ease-linear" style={{ left: `calc(${(1 - gap) * 78}% )` }}>
          <span className="inline-block -scale-x-100">🐍</span>
        </div>
        <div className={cn("absolute bottom-3 right-3 text-5xl", !over && "animate-bounce")}>{over && distance <= 0 ? "💥" : "🐭"}</div>
        {countdown > 0 && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 text-5xl font-extrabold">{countdown}</div>
        )}
      </div>

      {q && countdown <= 0 && !over && (
        <div className="space-y-3">
          <p className="min-h-12 text-lg font-medium leading-snug">{q.statement}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, i) => {
              const value = String(i);
              const isRight = feedback && feedback.correctAnswer === value;
              const isWrongChoice = feedback && feedback.chosen === value && !feedback.isCorrect;
              return (
                <button
                  key={i}
                  type="button"
                  data-option={i}
                  disabled={busy || !!feedback}
                  onClick={() => answer(value)}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-colors",
                    !feedback && "border-border bg-surface hover:border-primary hover:bg-primary/10",
                    isRight && "border-success bg-success/15",
                    isWrongChoice && "border-danger bg-danger/15",
                    feedback && !isRight && !isWrongChoice && "border-border opacity-50",
                  )}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs">
                    {q.type === "CERTO_ERRADO" ? (i === 0 ? "C" : "E") : LETTERS[i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {feedback && !feedback.isCorrect && <p className="rounded-lg bg-surface-2 p-3 text-sm">{feedback.explanation}</p>}
        </div>
      )}
      {over && <p className="text-center text-lg font-semibold">{distance <= 0 ? "A cobra te pegou! 🐍" : "Fim de jogo!"}</p>}
    </div>
  );
}
