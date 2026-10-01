"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, Dices, Loader2, ShieldAlert, Timer } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { submitEssayAction } from "@/app/actions/essays";
import { ESSAY_TIMES, RUBRICS, wordCount } from "@/lib/core/essay";
import { drawEssayTheme, drawPortuguesePrompt, type EssayPrompt } from "@/lib/core/essay-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const timeLabel = (m: number) => (m >= 60 ? `${m / 60} h` : `${m} min`);

/**
 * Redação com tema sorteado (correção estilo ENEM, com textos motivadores) ou teste de português.
 * O aluno escolhe o tempo; quando acaba, o texto é enviado sozinho para correção.
 */
export function EssayForm({ mode, initial }: { mode: "redacao" | "portugues"; initial: EssayPrompt }) {
  const [state, action, pending] = useActionState(submitEssayAction, undefined);
  const [prompt, setPrompt] = useState(initial);
  const [text, setText] = useState("");
  const [minutes, setMinutes] = useState<number>(mode === "portugues" ? 30 : 60);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const rubric = mode === "portugues" ? "GERAL" : "ENEM";
  const words = wordCount(text);
  const min = 50;

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => {
      const s = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        clearInterval(t);
        setTimeUp(true);
      }
    };
    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, [endsAt]);

  // tempo esgotado: envia sozinho (se o texto já tiver o mínimo de palavras)
  useEffect(() => {
    if (timeUp && wordCount(text) >= min) formRef.current?.requestSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  const header = (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{mode === "portugues" ? "Proposta sorteada" : "Tema sorteado"}</p>
          <h2 className="mt-1 text-lg font-semibold">{prompt.theme}</h2>
        </div>
        {!endsAt && (
          <Button type="button" variant="outline" size="sm" onClick={() => setPrompt(mode === "portugues" ? drawPortuguesePrompt(prompt.theme) : drawEssayTheme(prompt.theme))}>
            <Dices size={16} /> Sortear outro
          </Button>
        )}
      </div>
      {!!prompt.texts?.length && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Textos motivadores</p>
          {prompt.texts.map((t, i) => (
            <blockquote key={i} className="rounded-lg border-l-4 border-primary/50 bg-surface-2 px-3 py-2 text-sm leading-relaxed">
              <span className="mr-1 font-semibold">Texto {["I", "II", "III", "IV"][i]}.</span>
              {t}
            </blockquote>
          ))}
          <p className="text-xs text-warning">Use os textos só como inspiração: copiar trechos deles tira pontos.</p>
        </div>
      )}
      <p className="text-sm text-muted">{prompt.instructions}</p>
    </Card>
  );

  if (!endsAt) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <ShieldAlert className="mt-0.5 shrink-0 text-warning" size={20} />
          <p>
            <strong>Recomendamos que você não use inteligência artificial</strong> para escrever {mode === "portugues" ? "este texto" : "a redação"} nem para pesquisar.
            A ideia é você treinar e tirar uma nota boa por conta própria: escreva tudo do zero, com as suas palavras.
          </p>
        </div>
        {header}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 font-semibold"><Clock size={18} className="text-primary" /> Quanto tempo você quer para escrever?</div>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Tempo para escrever">
            {ESSAY_TIMES.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={minutes === m}
                onClick={() => setMinutes(m)}
                className={cn("rounded-lg border px-2 py-3 font-semibold", minutes === m ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
              >
                {timeLabel(m)}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">No ENEM são 5 h e 30 min para a prova toda. Quando o tempo acabar, o seu texto vai sozinho para a correção.</p>
          <Button className="w-full" onClick={() => setEndsAt(Date.now() + minutes * 60_000)}>Começar a escrever ({timeLabel(minutes)})</Button>
        </Card>
      </div>
    );
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <ActionForm action={action} ref={formRef} className="space-y-4">
      <input type="hidden" name="rubric" value={rubric} />
      <input type="hidden" name="theme" value={prompt.theme} />
      <input type="hidden" name="instructions" value={prompt.instructions} />
      <input type="hidden" name="timeLimit" value={minutes} />
      {!timeUp && (
        <div className="sticky top-2 z-20 flex items-center gap-3 rounded-xl border border-primary/40 bg-surface/95 px-3 py-2 shadow-sm backdrop-blur" role="timer">
          <Timer size={18} className={cn("shrink-0", left < 60 ? "text-danger" : "text-primary")} />
          <span className={cn("font-mono text-lg font-bold tabular-nums", left < 60 && "text-danger")}>{mm}:{ss}</span>
          <span className="text-xs text-muted">Quando o tempo acabar, o texto vai sozinho para a correção.</span>
        </div>
      )}
      {header}
      <Card className="space-y-2">
        <FormError message={state?.error} />
        {state?.upgrade && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        {timeUp && words < min && (
          <p className="rounded-lg bg-warning/10 p-3 text-sm">O tempo acabou! Seu texto ainda tem menos de {min} palavras. Termine com calma e envie quando puder.</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="text" className="font-medium">Seu texto</label>
          <span className={words < min ? "text-muted" : "text-success"}>{words} palavras</span>
        </div>
        <Textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={(e) => {
            // incentivo a escrever do zero: colar textos grandes é bloqueado
            if (e.clipboardData.getData("text").length > 200) {
              e.preventDefault();
              alert("Para treinar de verdade, escreva o texto com as suas palavras (colar textos grandes está desativado).");
            }
          }}
          rows={18}
          className="font-[inherit] text-[15px] leading-7"
          placeholder="Escreva aqui..."
          autoFocus
        />
        <p className="text-xs text-muted">Critérios: {RUBRICS[rubric].criteria.map((c) => c.name.replace(/^Competência \d — /, "")).join(" · ")} (nota máxima {RUBRICS[rubric].total}).</p>
      </Card>
      <Button size="lg" className="w-full" disabled={pending || words < min}>
        {pending ? <><Loader2 size={18} className="animate-spin" /> Corrigindo...</> : "Enviar para correção"}
      </Button>
    </ActionForm>
  );
}
