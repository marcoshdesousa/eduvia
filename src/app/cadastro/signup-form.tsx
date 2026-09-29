"use client";
import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { GoogleButton } from "@/components/google-button";
import { ProfileFields } from "@/components/profile-fields";

export function SignupForm({ google }: { google: boolean }) {
  const [state, action, pending] = useActionState(signUpAction, undefined);
  return (
    <div className="space-y-4">
      {google && (
        <>
          <GoogleButton label="Cadastrar com Google" />
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
      <form action={action} className="space-y-4">
        <FormError message={state?.error} />
        <Field label="Nome" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="E-mail" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Senha" htmlFor="password" hint="Mínimo de 8 caracteres.">
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <ProfileFields />
        <Button className="w-full" disabled={pending}>{pending ? "Criando conta..." : "Criar conta e começar 3 dias grátis"}</Button>
      </form>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/entrar" className="font-medium text-primary">Entrar</Link>
      </p>
    </div>
  );
}
