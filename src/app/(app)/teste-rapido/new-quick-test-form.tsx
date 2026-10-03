"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createQuickTestAction } from "@/app/actions/quick-test";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, FormError, Input, Select } from "@/components/ui/form";
import { QUICK_COUNTS, QUICK_SECONDS } from "@/lib/quick-test";
import { cn } from "@/lib/utils";

type Prep = { id: string; title: string; subjects: { id: string; name: string }[] };

function Choice({ name, values, value, onChange, suffix }: { name: string; values: readonly number[]; value: number; onChange: (v: number) => void; suffix: string }) {
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
          {v}{suffix}
        </button>
      ))}
    </div>
  );
}

export function NewQuickTestForm({ defaultName, preparations }: { defaultName: string; preparations: Prep[] }) {
  const [state, action, pending] = useActionState(createQuickTestAction, undefined);
  const [prepId, setPrepId] = useState(preparations[0].id);
  const [count, setCount] = useState<number>(10);
  const [seconds, setSeconds] = useState<number>(20);
  const prep = preparations.find((p) => p.id === prepId)!;
  return (
    <Card id="novo">
      <ActionForm action={action} className="space-y-4">
        <CardTitle>Criar teste rápido</CardTitle>
        <FormError message={state?.error} />
        {state?.upgrade && /Assine|não fazem parte/.test(state.error ?? "") && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        <Field label="Nome do teste" htmlFor="name">
          <Input id="name" name="name" defaultValue={defaultName} maxLength={60} required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preparação" htmlFor="preparationId">
            <Select id="preparationId" name="preparationId" value={prepId} onChange={(e) => setPrepId(e.target.value)}>
              {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
          </Field>
          <Field label="Assunto" htmlFor="subjectId">
            <Select id="subjectId" name="subjectId" key={prepId} defaultValue="">
              <option value="">Tudo o que já estudei</option>
              {prep.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Quantidade de perguntas">
          <Choice name="count" values={QUICK_COUNTS} value={count} onChange={setCount} suffix="" />
        </Field>
        <Field label="Tempo para cada pergunta">
          <Choice name="seconds" values={QUICK_SECONDS} value={seconds} onChange={setSeconds} suffix=" s" />
        </Field>
        <p className="text-xs text-muted">Depois de começar não dá para refazer o mesmo teste: para praticar de novo, crie outro. As perguntas focam no que você errou e em coisas novas.</p>
        <Button size="lg" className="w-full" disabled={pending}>
          {pending ? <><Loader2 size={18} className="animate-spin" /> Preparando as perguntas...</> : "Começar teste rápido"}
        </Button>
      </ActionForm>
    </Card>
  );
}
