"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";

function ResetForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState<string | null>(token ? null : "Link inválido.");
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const newPassword = String(new FormData(e.currentTarget).get("password"));
        const { error } = await authClient.resetPassword({ newPassword, token: token! });
        if (error) return setError("Link inválido ou expirado. Peça um novo.");
        router.push("/entrar");
      }}
    >
      <FormError message={error} />
      <Field label="Nova senha" htmlFor="password" hint="Mínimo de 8 caracteres.">
        <Input id="password" name="password" type="password" minLength={8} required />
      </Field>
      <Button className="w-full" disabled={!token}>Salvar nova senha</Button>
    </form>
  );
}

export default function Page() {
  return (
    <AuthShell title="Nova senha">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
