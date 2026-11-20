import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { CpfInput } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { getCurrentUser, homeOf } from "@/lib/session";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(homeOf(user));
  const { voltar = "" } = await searchParams;
  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-muted">Use o CPF e a senha da sua conta.</p>
      </div>
      <ActionForm action={loginAction} className="space-y-4">
        <input type="hidden" name="voltar" value={voltar} />
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <CpfInput />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <SubmitButton className="w-full" size="lg" pendingText="Entrando…">Entrar</SubmitButton>
      </ActionForm>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <Link href="/recuperar-senha" className="text-primary hover:underline">Esqueci a senha</Link>
        <Link href={`/cadastro${voltar ? `?voltar=${encodeURIComponent(voltar)}` : ""}`} className="text-primary hover:underline">Criar conta grátis</Link>
      </div>
    </Card>
  );
}
