"use client";
import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { submitEssayAction, suggestThemeAction } from "@/app/actions/essays";
import { RUBRICS, wordCount, type RubricKey } from "@/lib/core/essay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FormError, Input, Select, Textarea } from "@/components/ui/form";

type Prep = { id: string; title: string; rubric: RubricKey };

export function EssayForm({ preparations }: { preparations: Prep[] }) {
  const [state, action, pending] = useActionState(submitEssayAction, undefined);
  const [prepId, setPrepId] = useState(preparations[0]?.id ?? "");
  const [rubric, setRubric] = useState<RubricKey>(preparations[0]?.rubric ?? "GERAL");
  const [theme, setTheme] = useState("");
  const [instructions, setInstructions] = useState("");
  const [text, setText] = useState("");
  const [themeError, setThemeError] = useState<string | null>(null);
  const [suggesting, startSuggest] = useTransition();
  const words = wordCount(text);

  return (
    <ActionForm action={action} className="space-y-4">
      <Card className="space-y-4">
        <FormError message={state?.error} />
        {state?.upgrade && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preparação (opcional)" htmlFor="preparationId">
            <Select
              id="preparationId"
              name="preparationId"
              value={prepId}
              onChange={(e) => {
                setPrepId(e.target.value);
                const p = preparations.find((x) => x.id === e.target.value);
                if (p) setRubric(p.rubric);
              }}
            >
              <option value="">Nenhuma</option>
              {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
          </Field>
          <Field label="Tipo de correção" htmlFor="rubric">
            <Select id="rubric" name="rubric" value={rubric} onChange={(e) => setRubric(e.target.value as RubricKey)}>
              {(Object.keys(RUBRICS) as RubricKey[]).map((k) => <option key={k} value={k}>{RUBRICS[k].label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Tema" htmlFor="theme">
          <div className="flex gap-2">
            <Input id="theme" name="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Escreva o tema ou peça uma sugestão" required />
            <Button
              type="button"
              variant="outline"
              disabled={suggesting}
              onClick={() =>
                startSuggest(async () => {
                  setThemeError(null);
                  const r = await suggestThemeAction(prepId || null, rubric);
                  if ("error" in r && r.error) setThemeError(r.error);
                  else if ("theme" in r) {
                    setTheme(r.theme);
                    setInstructions(r.instructions);
                  }
                })
              }
            >
              {suggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Sugerir
            </Button>
          </div>
          {themeError && <p className="mt-1 text-xs text-danger">{themeError}</p>}
        </Field>
        {instructions && (
          <Field label="Proposta" htmlFor="instructions">
            <Textarea id="instructions" name="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} />
          </Field>
        )}
      </Card>
      <Card className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="text" className="font-medium">Seu texto</label>
          <span className={words < 50 ? "text-muted" : "text-success"}>{words} palavras</span>
        </div>
        <Textarea id="text" name="text" value={text} onChange={(e) => setText(e.target.value)} rows={18} className="font-[inherit] text-[15px] leading-7" placeholder="Escreva aqui..." />
        <p className="text-xs text-muted">Critérios: {RUBRICS[rubric].criteria.map((c) => c.name.replace(/^Competência \d — /, "")).join(" · ")} (nota máxima {RUBRICS[rubric].total}).</p>
      </Card>
      <Button size="lg" className="w-full" disabled={pending || words < 50}>
        {pending ? <><Loader2 size={18} className="animate-spin" /> Corrigindo sua redação...</> : "Enviar para correção"}
      </Button>
    </ActionForm>
  );
}
