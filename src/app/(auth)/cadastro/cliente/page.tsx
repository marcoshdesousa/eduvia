import Link from "next/link";
import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { CpfInput, PasswordPair } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { signupClientAction } from "../../actions";

export const metadata: Metadata = { title: "Cadastro de cliente" };

export default async function ClientSignup({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar = "" } = await searchParams;
  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cadastro de cliente</h1>
        <p className="text-sm text-muted">É grátis. O endereço você informa só quando for pedir uma limpeza.</p>
      </div>
      <ActionForm action={signupClientAction} className="space-y-4">
        <input type="hidden" name="voltar" value={voltar} />
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={5} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <CpfInput />
          <p className="mt-1 text-xs text-muted">Usado para entrar e para evitar contas repetidas. Nunca aparece para ninguém.</p>
        </div>
        <PasswordPair />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
          <span>
            Li e aceito os <Link href="/termos" target="_blank" className="text-primary underline">Termos de uso</Link> e a{" "}
            <Link href="/privacidade" target="_blank" className="text-primary underline">Política de privacidade</Link>.
          </span>
        </label>
        <SubmitButton className="w-full" size="lg" pendingText="Criando conta…">Criar conta grátis</SubmitButton>
      </ActionForm>
      <p className="text-center text-sm text-muted">Já tem conta? <Link href="/entrar" className="text-primary hover:underline">Entrar</Link></p>
    </Card>
  );
}
