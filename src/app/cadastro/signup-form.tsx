"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { ProfileFields } from "@/components/profile-fields";
import { GeminiKeyFields } from "@/components/gemini-key-fields";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUpAction, undefined);
  return (
    <div className="space-y-4">
      <ActionForm action={action} className="space-y-4">
        <FormError message={state?.error} />
        <Field label="Nome" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <ProfileFields />
        <Field label="Senha" htmlFor="password" hint="Mínimo de 8 caracteres.">
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <GeminiKeyFields />
        <Button className="w-full" disabled={pending}>{pending ? "Testando a chave e criando a conta..." : "Criar conta grátis"}</Button>
      </ActionForm>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/entrar" className="font-medium text-primary">Entrar</Link>
      </p>
    </div>
  );
}
