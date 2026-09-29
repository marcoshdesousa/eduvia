"use client";
import { useActionState } from "react";
import { connectAiAction } from "@/app/actions/ai";
import { ActionForm } from "@/components/action-form";
import { GeminiKeyFields } from "@/components/gemini-key-fields";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";

export function ConnectAiForm({ next = null, hint = null }: { next?: string | null; hint?: string | null }) {
  const [state, action, pending] = useActionState(connectAiAction.bind(null, next), undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      {state?.ok && <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>}
      <GeminiKeyFields hint={hint} />
      <Button className="w-full" disabled={pending}>{pending ? "Testando a chave..." : hint ? "Trocar chave" : "Conectar IA"}</Button>
    </ActionForm>
  );
}
