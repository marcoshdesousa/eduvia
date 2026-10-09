"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createQuickTestAction } from "@/app/actions/quick-test";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, FormError, Input, Select } from "@/components/ui/form";
import { QUICK_AREAS, QUICK_COUNTS, QUICK_SECONDS } from "@/lib/quick-test";
import { cn } from "@/lib/utils";

function Choice({ name, values, value, onChange, label }: { name: string; values: readonly number[]; value: number; onChange: (v: number) => void; label: (v: number) => string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      <input type="hidden" name={name} value={value} />
      {values.map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn("rounded-lg border px-4 py-1.5 text-sm font-medium", value === v ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
        >
          {label(v)}
        </button>
      ))}
    </div>
  );
}

export function NewQuickTestForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState(createQuickTestAction, undefined);
  const [count, setCount] = useState<number>(10);
  const [seconds, setSeconds] = useState<number>(120);
  return (
    <Card id="novo">
      <ActionForm action={action} className="space-y-4">
        <CardTitle>Criar teste rápido</CardTitle>
        <FormError message={state?.error} />
        {state?.upgrade && /Assine|não fazem parte/.test(state.error ?? "") && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        <Field label="Nome do teste" htmlFor="name">
          <Input id="name" name="name" defaultValue={defaultName} maxLength={60} required />
        </Field>
        <Field label="Área" htmlFor="area">
          <Select id="area" name="area" defaultValue="todas">
            {QUICK_AREAS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </Select>
        </Field>
        <Field label="Quantidade de perguntas">
          <Choice name="count" values={QUICK_COUNTS} value={count} onChange={setCount} label={(v) => String(v)} />
        </Field>
        <Field label="Tempo para cada pergunta">
          <Choice name="seconds" values={QUICK_SECONDS} value={seconds} onChange={setSeconds} label={(v) => `${v / 60} min`} />
        </Field>
        <p className="text-xs text-muted">Depois de começar não dá para refazer o mesmo teste: para praticar de novo, crie outro. As questões são reais do ENEM e vêm primeiro as que você ainda não viu.</p>
        <Button size="lg" className="w-full" disabled={pending}>
          {pending ? <><Loader2 size={18} className="animate-spin" /> Preparando as perguntas...</> : "Começar teste rápido"}
        </Button>
      </ActionForm>
    </Card>
  );
}
