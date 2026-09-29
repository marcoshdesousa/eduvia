"use client";
import { useActionState, useState } from "react";
import { createPreparationAction } from "@/app/actions/preparations";
import { AgendaFields } from "@/components/agenda-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FormError, Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type TypeKey = "FUNDAMENTAL" | "MEDIO" | "ENEM_VESTIBULAR" | "FACULDADE" | "CONCURSO" | "CURSINHO" | "LIVRE";
const TYPES: { key: TypeKey; label: string; description: string }[] = [
  { key: "FUNDAMENTAL", label: "Ensino fundamental", description: "1º ao 9º ano" },
  { key: "MEDIO", label: "Ensino médio", description: "1ª a 3ª série" },
  { key: "ENEM_VESTIBULAR", label: "Vestibular / ENEM", description: "Provas de ingresso" },
  { key: "FACULDADE", label: "Faculdade", description: "Matéria da graduação" },
  { key: "CONCURSO", label: "Concurso público", description: "Com base no edital" },
  { key: "CURSINHO", label: "Cursinho / curso livre", description: "Preparatórios e cursos" },
  { key: "LIVRE", label: "Outro / estudo livre", description: "Qualquer objetivo" },
];
const GRADES = {
  FUNDAMENTAL: ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano", "7º ano", "8º ano", "9º ano"],
  MEDIO: ["1ª série", "2ª série", "3ª série"],
};

export function NewPreparationForm() {
  const [state, action, pending] = useActionState(createPreparationAction, undefined);
  const [type, setType] = useState<TypeKey | null>(null);
  const [step, setStep] = useState(1);

  return (
    <form action={action} className="space-y-6">
      <FormError message={state?.error} />
      <input type="hidden" name="studentType" value={type ?? ""} />

      <section className={cn(step !== 1 && "hidden")}>
        <h2 className="mb-3 font-semibold">1. O que você vai estudar?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => {
                setType(t.key);
                setStep(2);
              }}
              className={cn("rounded-xl border p-4 text-left transition-colors", type === t.key ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2")}
            >
              <div className="font-medium">{t.label}</div>
              <div className="text-sm text-muted">{t.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={cn("space-y-4", step !== 2 && "hidden")}>
        <h2 className="font-semibold">2. Detalhes</h2>
        <Card className="space-y-4">
          <Field label="Nome da preparação" htmlFor="title" hint="Ex.: Concurso TRT 2026, Cálculo I, Matemática 8º ano">
            <Input id="title" name="title" required={step === 2} />
          </Field>
          {(type === "FUNDAMENTAL" || type === "MEDIO") && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Série / ano" htmlFor="grade">
                <Select id="grade" name="grade" defaultValue="">
                  <option value="" disabled>Selecione</option>
                  {GRADES[type].map((g) => <option key={g}>{g}</option>)}
                </Select>
              </Field>
              <Field label="Matéria" htmlFor="schoolSubject">
                <Input id="schoolSubject" name="schoolSubject" placeholder="Ex.: Matemática" />
              </Field>
            </div>
          )}
          {type === "ENEM_VESTIBULAR" && (
            <Field label="Qual prova?" htmlFor="exam" hint="Ex.: ENEM, FUVEST, UNICAMP, UERJ">
              <Input id="exam" name="exam" />
            </Field>
          )}
          {type === "FACULDADE" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Curso" htmlFor="course"><Input id="course" name="course" placeholder="Ex.: Engenharia Civil" /></Field>
              <Field label="Disciplina" htmlFor="discipline"><Input id="discipline" name="discipline" placeholder="Ex.: Cálculo I" /></Field>
            </div>
          )}
          {type === "CONCURSO" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Órgão (opcional)" htmlFor="orgao"><Input id="orgao" name="orgao" placeholder="Ex.: TRT 2ª Região" /></Field>
                <Field label="Cargo (opcional)" htmlFor="cargo"><Input id="cargo" name="cargo" placeholder="Ex.: Analista Judiciário" /></Field>
              </div>
              <p className="rounded-lg bg-primary/10 p-3 text-sm">
                No próximo passo você vai enviar o <strong>edital</strong> (obrigatório). A IA identifica disciplinas, assuntos, pesos e a banca para priorizar o plano.
              </p>
            </>
          )}
          {(type === "CURSINHO" || type === "LIVRE") && (
            <Field label="Objetivo (opcional)" htmlFor="goal"><Input id="goal" name="goal" placeholder="Ex.: aprender Python do zero" /></Field>
          )}
        </Card>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
          <Button type="button" onClick={() => setStep(3)}>Continuar</Button>
        </div>
      </section>

      <section className={cn("space-y-4", step !== 3 && "hidden")}>
        <h2 className="font-semibold">3. Sua rotina</h2>
        <Card>
          <AgendaFields examHint={type === "CONCURSO" ? "Se o edital trouxer a data, preenchemos automaticamente." : undefined} />
        </Card>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
          <Button disabled={pending || !type}>{pending ? "Criando..." : "Criar e enviar materiais"}</Button>
        </div>
      </section>
    </form>
  );
}
