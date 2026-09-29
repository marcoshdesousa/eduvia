"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { GoogleButton } from "@/components/google-button";

export function LoginForm({ google }: { google: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const { error } = await authClient.signIn.email({ email: String(f.get("email")).trim().toLowerCase(), password: String(f.get("password")) });
    setLoading(false);
    if (error) return setError(error.status === 401 ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.");
    router.push("/inicio");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {google && (
        <>
          <GoogleButton />
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormError message={error} />
        <Field label="E-mail" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Senha" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        <Button className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
      <div className="flex justify-between text-sm">
        <Link href="/recuperar-senha" className="text-muted hover:text-foreground">Esqueci a senha</Link>
        <Link href="/cadastro" className="font-medium text-primary">Criar conta</Link>
      </div>
    </div>
  );
}
