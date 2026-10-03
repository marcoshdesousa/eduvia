"use client";
import { useActionState, useTransition } from "react";
import { CheckCircle2, ExternalLink, ShieldAlert, Zap } from "lucide-react";
import { connectExtraAiAction, removeExtraAiAction } from "@/app/actions/ai";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import type { AiProvider } from "@/lib/ai/providers";

type Guide = { label: string; url: string; site: string; prefix: string; steps: React.ReactNode[]; why: string };

const GUIDES: Record<AiProvider, Guide> = {
  gemini: {
    label: "Gemini (Google)",
    url: "https://aistudio.google.com/apikey",
    site: "aistudio.google.com",
    prefix: "AIza",
    why: "Lê seus PDFs, fotos e arquivos e monta as aulas.",
    steps: [
      <>Entre com sua <strong>conta Google</strong> (a mesma do Gmail/YouTube).</>,
      <>Toque em <strong>&quot;Create API key&quot;</strong> (Criar chave de API). Se pedir, aceite os termos e escolha ou crie um projeto.</>,
      <>Copie a chave (começa com <code className="rounded bg-surface px-1">AIza</code>) e cole aqui.</>,
    ],
  },
  cerebras: {
    label: "Cerebras",
    url: "https://cloud.cerebras.ai",
    site: "cloud.cerebras.ai",
    prefix: "csk-",
    why: "Monta aulas e perguntas com muita rapidez quando o Gemini está ocupado.",
    steps: [
      <>Entre com sua <strong>conta Google</strong>.</>,
      <>No menu, abra <strong>&quot;API Keys&quot;</strong> e toque em <strong>&quot;Generate API Key&quot;</strong> (se já aparecer uma chave, pode usar ela).</>,
      <>Copie a chave (começa com <code className="rounded bg-surface px-1">csk-</code>) e cole aqui.</>,
    ],
  },
  groq: {
    label: "Groq",
    url: "https://console.groq.com/keys",
    site: "console.groq.com",
    prefix: "gsk_",
    why: "A mais rápida: cria suas perguntas, corrige redações e responde o Professor IA em segundos.",
    steps: [
      <>Toque em <strong>&quot;Continue with Google&quot;</strong> (entra com a mesma conta do Gmail).</>,
      <>Toque em <strong>&quot;Create API Key&quot;</strong>, escreva um nome (ex.: Eduvia) e confirme.</>,
      <>Copie a chave que aparece (começa com <code className="rounded bg-surface px-1">gsk_</code>) e cole aqui. Ela só aparece uma vez!</>,
    ],
  },
  openrouter: {
    label: "OpenRouter",
    url: "https://openrouter.ai/settings/keys",
    site: "openrouter.ai",
    prefix: "sk-or-",
    why: "Reserva com vários modelos de IA: garante que seus estudos nunca param.",
    steps: [
      <>Toque em <strong>&quot;Sign in&quot;</strong> e entre com sua <strong>conta Google</strong>.</>,
      <>Na página <strong>&quot;API Keys&quot;</strong>, toque em <strong>&quot;Create API Key&quot;</strong>, escreva um nome (ex.: Eduvia) e confirme. Deixe o limite de crédito em branco.</>,
      <>Copie a chave (começa com <code className="rounded bg-surface px-1">sk-or-</code>) e cole aqui. Ela só aparece uma vez!</>,
    ],
  },
};

/** Aviso que aparece em cima de cada IA: ela é grátis, não precisa cartão, Pix nem dados bancários. */
export function NoPaymentNotice() {
  return (
    <p className="flex gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-xs text-foreground">
      <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warning" />
      <span>
        <strong>Importante:</strong> esta IA é grátis e não precisa de plano para conectar. <strong>Não coloque cartão, dados bancários nem faça Pix</strong> dentro dela.
      </span>
    </p>
  );
}

/** Card para conectar uma das 4 IAs, com passo a passo. Salva na hora: se sair da tela, nada se perde. */
export function AiConnectCard({ provider, hint, removable = true, step }: { provider: AiProvider; hint: string | null; removable?: boolean; step?: number }) {
  const g = GUIDES[provider];
  const [state, action, pending] = useActionState(connectExtraAiAction.bind(null, provider), undefined);
  const [removing, startRemove] = useTransition();
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4" id={`ia-${provider}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-semibold">
          <Zap size={16} className="text-primary" /> {step ? `${step}. ` : ""}{g.label}
        </p>
        {hint ? (
          <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={14} /> Conectada (…{hint})</span>
        ) : (
          <span className="text-xs text-muted">uns 2 minutos</span>
        )}
      </div>
      <p className="text-sm text-muted">{g.why}</p>
      {!hint && (
        <>
          <NoPaymentNotice />
          <p className="text-sm font-semibold">Como pegar a chave (uns 2 minutos):</p>
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
        </>
      )}
      <ActionForm action={action} className="space-y-3">
        <FormError message={state?.error} />
        {state?.ok && <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>}
        <Field label={`Chave da ${g.label}`} htmlFor={`key-${provider}`} hint={hint ? "Cole uma nova para trocar." : "Guardamos criptografada. Ninguém vê, nem a equipe do Eduvia."}>
          <Input id={`key-${provider}`} name="key" autoComplete="off" spellCheck={false} placeholder={`${g.prefix}...`} className="font-mono" required />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending}>{pending ? "Testando a chave..." : hint ? "Trocar chave" : `Conectar ${g.label}`}</Button>
          {hint && removable && provider !== "gemini" && (
            <Button type="button" variant="ghost" disabled={removing} onClick={() => startRemove(() => removeExtraAiAction(provider))}>
              Desconectar
            </Button>
          )}
        </div>
      </ActionForm>
    </div>
  );
}
