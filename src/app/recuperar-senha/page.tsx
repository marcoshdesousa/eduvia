"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export default function Page() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell title="Recuperar senha" subtitle="Enviaremos um link para você criar uma nova senha.">
      {sent ? (
        <p className="text-sm">Se existir uma conta com esse e-mail, você receberá o link em instantes.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const email = String(new FormData(e.currentTarget).get("email")).trim().toLowerCase();
            await authClient.requestPasswordReset({ email, redirectTo: "/redefinir-senha" });
            setSent(true);
          }}
        >
          <Field label="E-mail" htmlFor="email">
            <Input id="email" name="email" type="email" required />
          </Field>
          <Button className="w-full" disabled={loading}>Enviar link</Button>
        </form>
      )}
      <p className="mt-6 text-sm"><Link href="/entrar" className="text-primary">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
