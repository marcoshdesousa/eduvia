"use client";
import { useActionState, useTransition } from "react";
import { CheckCircle2, ExternalLink, Zap } from "lucide-react";
import { connectExtraAiAction, removeExtraAiAction } from "@/app/actions/ai";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import type { ExtraProvider } from "@/lib/ai/extra";

const GUIDES: Record<ExtraProvider, { label: string; url: string; site: string; prefix: string; steps: React.ReactNode[]; why: string }> = {
  groq: {
    label: "Groq",
    url: "https://console.groq.com/keys",
    site: "console.groq.com",
    prefix: "gsk_",
    why: "Super rápida: cria suas perguntas, corrige redações e responde o Professor IA em segundos.",
    steps: [
      <>Toque em <strong>&quot;Continue with Google&quot;</strong> (entra com a mesma conta do Gmail).</>,
      <>Toque em <strong>&quot;Create API Key&quot;</strong>, escreva um nome (ex.: Eduvia) e confirme.</>,
      <>Copie a chave que aparece (começa com <code className="rounded bg-surface px-1">gsk_</code>) e cole aqui. Ela só aparece uma vez!</>,
    ],
  },
  cerebras: {
    label: "Cerebras",
    url: "https://cloud.cerebras.ai",
    site: "cloud.cerebras.ai",
    prefix: "csk-",
    why: "Cota diária grande: monta aulas quando o Gemini está ocupado ou no limite.",
    steps: [
      <>Entre com sua <strong>conta Google</strong>.</>,
      <>No menu, abra <strong>&quot;API Keys&quot;</strong> e toque em <strong>&quot;Generate API Key&quot;</strong> (se já aparecer uma chave, pode usar ela).</>,
      <>Copie a chave (começa com <code className="rounded bg-surface px-1">csk-</code>) e cole aqui.</>,
    ],
  },
};

/** Card para conectar uma IA extra grátis (Groq ou Cerebras), com passo a passo. Salva na hora: nada se perde. */
export function ExtraAiCard({ provider, hint }: { provider: ExtraProvider; hint: string | null }) {
  const g = GUIDES[provider];
  const [state, action, pending] = useActionState(connectExtraAiAction.bind(null, provider), undefined);
  const [removing, startRemove] = useTransition();
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-semibold">
          <Zap size={16} className="text-primary" /> {g.label}
        </p>
        {hint ? (
          <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={14} /> Conectada (…{hint})</span>
        ) : (
          <span className="text-xs text-muted">Grátis · uns 2 minutos</span>
        )}
      </div>
      <p className="text-sm text-muted">{g.why}</p>
      {!hint && (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm">
          <li>
            Abra o{" "}
            <a href={g.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline">
              {g.site} <ExternalLink size={12} />
            </a>
            . {g.steps[0]}
          </li>
          <li>{g.steps[1]}</li>
          <li>{g.steps[2]}</li>
        </ol>
      )}
      <ActionForm action={action} className="space-y-3">
        <FormError message={state?.error} />
        {state?.ok && <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>}
        <Field label={`Chave da ${g.label}`} htmlFor={`key-${provider}`} hint={hint ? "Cole uma nova para trocar." : "Guardamos criptografada. Ninguém vê, nem a equipe do Eduvia."}>
          <Input id={`key-${provider}`} name="key" autoComplete="off" spellCheck={false} placeholder={`${g.prefix}...`} className="font-mono" required />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending}>{pending ? "Testando a chave..." : hint ? "Trocar chave" : `Conectar ${g.label}`}</Button>
          {hint && (
            <Button type="button" variant="ghost" disabled={removing} onClick={() => startRemove(() => removeExtraAiAction(provider))}>
              Desconectar
            </Button>
          )}
        </div>
      </ActionForm>
    </div>
  );
}
