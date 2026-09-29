"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, undefined);
  return (
    <div className="space-y-4">
      <ActionForm action={action} className="space-y-4">
        <FormError message={state?.error} />
        <Field label="CPF ou @" htmlFor="identifier">
          <Input id="identifier" name="identifier" autoComplete="username" autoCapitalize="none" placeholder="000.000.000-00 ou @seu.usuario" required />
        </Field>
        <Field label="Senha" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        <Button className="w-full" disabled={pending}>{pending ? "Entrando..." : "Entrar"}</Button>
      </ActionForm>
      <div className="flex justify-between text-sm">
        <Link href="/recuperar-senha" className="text-muted hover:text-foreground">Esqueci a senha</Link>
        <Link href="/cadastro" className="font-medium text-primary">Criar conta</Link>
      </div>
    </div>
  );
}
