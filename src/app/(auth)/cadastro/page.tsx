import Link from "next/link";
import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { CpfInput, PasswordPair, PhoneInput } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { TRIAL_DAYS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { signupAction } from "../actions";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ voltar?: string; quero?: string }> }) {
  const { voltar = "", quero = "" } = await searchParams;
  const work = quero === "trabalhar";
  const tab = (on: boolean) => cn("rounded-lg py-2 text-center text-sm font-semibold", on ? "bg-surface shadow-sm" : "text-muted");
  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-muted">{work ? `Ganhe ${TRIAL_DAYS} dias grátis. Depois você cria um perfil para cada profissão.` : "Para contratar é grátis, sem taxa nenhuma."}</p>
      </div>
      <div className="grid grid-cols-2 rounded-xl bg-surface-2 p-1">
        <Link href={`/cadastro${voltar ? `?voltar=${encodeURIComponent(voltar)}` : ""}`} className={tab(!work)}>Quero contratar</Link>
        <Link href="/cadastro?quero=trabalhar" className={tab(work)}>Quero trabalhar</Link>
      </div>
      <ActionForm action={signupAction} className="space-y-4">
        <input type="hidden" name="voltar" value={voltar} />
        <input type="hidden" name="quero" value={quero} />
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={5} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <CpfInput />
          <p className="mt-1 text-xs text-muted">Usado para entrar e evitar contas repetidas. Nunca aparece para ninguém.</p>
        </div>
        {work && (
          <div>
            <Label htmlFor="phone">WhatsApp</Label>
            <PhoneInput />
            <p className="mt-1 text-xs text-muted">Só para a plataforma (segurança e Pix). Nunca aparece para os clientes.</p>
          </div>
        )}
        <PasswordPair />
        {work && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="adult" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>Tenho 18 anos ou mais e sei que não posso passar telefone ou WhatsApp para os clientes.</span>
          </label>
        )}
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
          <span>
            Li e aceito os <Link href="/termos" target="_blank" className="text-primary underline">Termos de uso</Link> e a{" "}
            <Link href="/privacidade" target="_blank" className="text-primary underline">Política de privacidade</Link>.
          </span>
        </label>
        <SubmitButton className="w-full" size="lg" pendingText="Criando conta…">{work ? `Criar conta e ganhar ${TRIAL_DAYS} dias grátis` : "Criar conta grátis"}</SubmitButton>
      </ActionForm>
      <p className="text-center text-sm text-muted">Já tem conta? <Link href="/entrar" className="text-primary hover:underline">Entrar</Link></p>
    </Card>
  );
}
