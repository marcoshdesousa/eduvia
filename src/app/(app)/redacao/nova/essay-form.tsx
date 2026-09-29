"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Dices, Loader2, ShieldAlert } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { submitEssayAction } from "@/app/actions/essays";
import { RUBRICS, wordCount } from "@/lib/core/essay";
import { drawEssayTheme, drawPortuguesePrompt, type EssayPrompt } from "@/lib/core/essay-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError, Textarea } from "@/components/ui/form";

/** Redação com tema sorteado (correção estilo ENEM) ou teste de português (qualidade da escrita). */
export function EssayForm({ mode, initial }: { mode: "redacao" | "portugues"; initial: EssayPrompt }) {
  const [state, action, pending] = useActionState(submitEssayAction, undefined);
  const [prompt, setPrompt] = useState(initial);
  const [text, setText] = useState("");
  const rubric = mode === "portugues" ? "GERAL" : "ENEM";
  const words = wordCount(text);
  const min = 50;

  return (
    <ActionForm action={action} className="space-y-4">
      <input type="hidden" name="rubric" value={rubric} />
      <input type="hidden" name="theme" value={prompt.theme} />
      <input type="hidden" name="instructions" value={prompt.instructions} />
      <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
        <ShieldAlert className="mt-0.5 shrink-0 text-warning" size={20} />
        <p>
          <strong>Recomendamos que você não use inteligência artificial</strong> para escrever {mode === "portugues" ? "este texto" : "a redação"} nem para pesquisar.
          A ideia é você treinar e tirar uma nota boa por conta própria: escreva tudo do zero, com as suas palavras.
        </p>
      </div>
      <Card className="space-y-3">
        <FormError message={state?.error} />
        {state?.upgrade && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{mode === "portugues" ? "Proposta sorteada" : "Tema sorteado"}</p>
            <h2 className="mt-1 text-lg font-semibold">{prompt.theme}</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={text.trim().length > 0}
            title={text.trim() ? "Apague o texto para sortear outro tema" : undefined}
            onClick={() => setPrompt(mode === "portugues" ? drawPortuguesePrompt(prompt.theme) : drawEssayTheme(prompt.theme))}
          >
            <Dices size={16} /> Sortear outro
          </Button>
        </div>
        <p className="text-sm text-muted">{prompt.instructions}</p>
      </Card>
      <Card className="space-y-2">
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
        />
        <p className="text-xs text-muted">Critérios: {RUBRICS[rubric].criteria.map((c) => c.name.replace(/^Competência \d — /, "")).join(" · ")} (nota máxima {RUBRICS[rubric].total}).</p>
      </Card>
      <Button size="lg" className="w-full" disabled={pending || words < min}>
        {pending ? <><Loader2 size={18} className="animate-spin" /> Corrigindo...</> : "Enviar para correção"}
      </Button>
    </ActionForm>
  );
}
