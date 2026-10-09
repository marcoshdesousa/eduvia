"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions/account";
import { Button, buttonClass } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { CpfInput, PasswordPair, PhoneInput } from "@/components/masked-inputs";

export function ResetForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);
  if (state?.ok) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-success/15 p-3 text-sm text-success">{state.message}</p>
        <Link href="/entrar" className={buttonClass("primary", "md", "w-full")}>Entrar</Link>
      </div>
    );
  }
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      <Field label="CPF" htmlFor="cpf"><CpfInput /></Field>
      <Field label="Telefone (WhatsApp) cadastrado" htmlFor="phone" hint="Para confirmar que a conta é sua."><PhoneInput /></Field>
      <PasswordPair label="Nova senha" />
      <Button className="w-full" disabled={pending}>{pending ? "Salvando..." : "Criar nova senha"}</Button>
    </ActionForm>
  );
}
