"use client";
import { useActionState } from "react";
import { resendGuardianAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";

export function ResendForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(resendGuardianAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <FormError message={state?.error} />
      {state?.message && <p className="text-sm text-success">{state.message}</p>}
      <Field label="Nome do responsável" htmlFor="guardianName">
        <Input id="guardianName" name="guardianName" defaultValue={name} required />
      </Field>
      <Field label="E-mail do responsável" htmlFor="guardianEmail">
        <Input id="guardianEmail" name="guardianEmail" type="email" defaultValue={email} required />
      </Field>
      <Button variant="secondary" className="w-full" disabled={pending}>Reenviar pedido</Button>
    </form>
  );
}
