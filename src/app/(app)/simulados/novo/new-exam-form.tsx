"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { createExamAction } from "@/app/actions/exams";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FormError, Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Prep = { id: string; title: string; subjects: { id: string; name: string }[] };
const SIZES = [30, 50, 100];
const DURATIONS = [
  { min: 30, label: "30 minutos" },
  { min: 60, label: "1 hora" },
  { min: 180, label: "3 horas" },
];

export function NewExamForm({ preparations }: { preparations: Prep[] }) {
  const [state, action, pending] = useActionState(createExamAction, undefined);
  const [prepId, setPrepId] = useState(preparations[0].id);
  const [count, setCount] = useState(30);
  const [duration, setDuration] = useState(60);
  const prep = preparations.find((p) => p.id === prepId)!;
  return (
    <ActionForm action={action}>
      <Card className="space-y-5">
        <FormError message={state?.error} />
        {state?.upgrade && <Link href="/assinatura" className="text-sm font-semibold text-primary">Assinar plano</Link>}
        <Field label="Preparação" htmlFor="preparationId">
          <Select id="preparationId" name="preparationId" value={prepId} onChange={(e) => setPrepId(e.target.value)}>
            {preparations.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
        </Field>
        <Field label="Disciplinas" hint="As questões são divididas conforme o peso de cada disciplina.">
          <div key={prepId} className="flex flex-wrap gap-2">
            {prep.subjects.map((s) => (
              <label key={s.id} className="cursor-pointer select-none rounded-lg border border-border px-3 py-1.5 text-sm has-checked:border-primary has-checked:bg-primary/15 has-checked:text-primary">
                <input type="checkbox" name="subjectIds" value={s.id} defaultChecked className="sr-only" />
                {s.name}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Número de questões">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setCount(n)}
                className={cn("rounded-lg border px-4 py-1.5 text-sm", count === n ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
              >
                {n}
              </button>
            ))}
          </div>
          <input type="hidden" name="questionCount" value={count} />
        </Field>
        <Field label="Tempo de prova">
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d.min}
                onClick={() => setDuration(d.min)}
                className={cn("rounded-lg border px-4 py-1.5 text-sm", duration === d.min ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2")}
              >
                {d.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="durationMin" value={duration} />
        </Field>
        <Field label="Nome (opcional)" htmlFor="title"><Input id="title" name="title" placeholder="Ex.: Simulado de revisão" /></Field>
        <Button size="lg" className="w-full" disabled={pending}>
          {pending ? <><Loader2 size={18} className="animate-spin" /> Montando a prova (pode levar 1 minuto)...</> : "Montar simulado"}
        </Button>
      </Card>
    </ActionForm>
  );
}
