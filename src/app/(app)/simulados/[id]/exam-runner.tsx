"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { imageUrls, isRichQuestion, QuestionText } from "@/components/rich-text";
import { Clock } from "lucide-react";
import { saveAnswersAction, submitAttemptAction } from "@/app/actions/exams";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Q = { id: string; type: string; statement: string; options: string[]; subject: string };
const LETTERS = "ABCDEFGH";

export function ExamRunner({ attemptId, title, deadline, initialAnswers, questions }: { attemptId: string; title: string; deadline: string; initialAnswers: Record<string, string>; questions: Q[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [current, setCurrent] = useState(0);
  const [left, setLeft] = useState(() => new Date(deadline).getTime() - Date.now());
  const [submitting, start] = useTransition();
  const submitted = useRef(false);
  const dirty = useRef(false);

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    start(() => submitAttemptAction(attemptId, answers));
  }, [attemptId, answers]);

  // cronômetro; entrega automática ao zerar
  useEffect(() => {
    const t = setInterval(() => {
      const ms = new Date(deadline).getTime() - Date.now();
      setLeft(ms);
      if (ms <= 0) submit();
    }, 500);
    return () => clearInterval(t);
  }, [deadline, submit]);

  // salva as respostas a cada 5 s se algo mudou (não perde nada se a página fechar)
  useEffect(() => {
    const t = setInterval(() => {
      if (dirty.current && !submitted.current) {
        dirty.current = false;
        saveAnswersAction(attemptId, answers);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [attemptId, answers]);

  const q = questions[current];
  // já carrega as imagens da próxima questão (e da anterior): ao trocar, aparecem na hora
  useEffect(() => {
    for (const n of [current + 1, current - 1]) {
      const nq = questions[n];
      if (!nq) continue;
      for (const url of [nq.statement, ...nq.options].flatMap(imageUrls)) new Image().src = url;
    }
  }, [current, questions]);
  const answered = Object.keys(answers).length;
  const hh = Math.max(0, Math.floor(left / 3_600_000));
  const mm = Math.max(0, Math.floor((left % 3_600_000) / 60000));
  const ss = Math.max(0, Math.floor((left % 60000) / 1000));

  function choose(v: string) {
    setAnswers((a) => ({ ...a, [q.id]: v }));
    dirty.current = true;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="sticky top-14 z-10 -mx-4 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur md:top-0">
        <span className="truncate text-sm font-medium">{title}</span>
        <span className={cn("inline-flex items-center gap-1 font-mono text-lg font-semibold tabular-nums", left < 60_000 && "text-danger")} aria-live="polite">
          <Clock size={16} /> {hh > 0 ? `${hh}:` : ""}{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </span>
      </div>

      <Card className="space-y-4">
        <div className="text-sm text-muted">Questão {current + 1} de {questions.length} · {q.subject}</div>
        <div className="leading-relaxed"><QuestionText text={q.statement} rich={isRichQuestion(q.id)} /></div>
        <div className="space-y-2">
          {q.options.map((o, i) => (
            <button
              key={i}
              type="button"
              data-option={i}
              onClick={() => choose(String(i))}
              className={cn("flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm", answers[q.id] === String(i) ? "border-primary bg-primary/10" : "border-border hover:bg-surface-2")}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-semibold">{q.type === "CERTO_ERRADO" ? (i === 0 ? "C" : "E") : LETTERS[i]}</span>
              <QuestionText text={o} rich={isRichQuestion(q.id)} className="min-w-0 flex-1" />
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Anterior</Button>
          {current < questions.length - 1 ? <Button variant="secondary" onClick={() => setCurrent((c) => c + 1)}>Próxima</Button> : null}
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-sm text-muted">Respondidas: {answered}/{questions.length}</div>
        <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Ir para a questão ${i + 1}`}
              className={cn("h-9 rounded-md border text-xs font-medium", i === current ? "border-primary text-primary" : "border-border", answers[qq.id] !== undefined && "bg-primary/15")}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </Card>

      <Button
        size="lg"
        className="w-full"
        disabled={submitting}
        onClick={() => (answered === questions.length || confirm(`Você deixou ${questions.length - answered} questão(ões) em branco. Entregar mesmo assim?`)) && submit()}
      >
        {submitting ? "Corrigindo..." : "Entregar prova"}
      </Button>
    </div>
  );
}
