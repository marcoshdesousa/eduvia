"use client";
import { useActionState } from "react";
import { resetAccountsAction } from "@/app/actions/admin-reset";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";

/** Apagar todas as contas (menos administradores): pede para digitar a confirmação. */
export function ResetForm({ others }: { others: number }) {
  const [state, action, pending] = useActionState(resetAccountsAction, undefined);
  return (
    <ActionForm action={action} className="space-y-3">
      <FormError message={state?.error} />
      {state?.message && <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>}
      <Field label="Para confirmar, digite APAGAR TUDO" htmlFor="confirm">
        <Input id="confirm" name="confirm" autoComplete="off" placeholder="APAGAR TUDO" />
      </Field>
      <Button variant="danger" disabled={pending}>{pending ? "Apagando..." : `Apagar ${others} conta(s) agora`}</Button>
    </ActionForm>
  );
}
