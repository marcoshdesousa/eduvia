"use client";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signUpAction } from "@/app/actions/account";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { ProfileFields } from "@/components/profile-fields";
import { PasswordPair } from "@/components/masked-inputs";
import { cn } from "@/lib/utils";

/**
 * Cadastro: 1) dados da conta (a conta já fica salva); 2) conectar a Gemini, em /conectar-ia.
 * Se o aluno sair no meio do passo 2, entra de novo e continua de onde parou.
 */
export function SignupForm({ coupon = "" }: { coupon?: string }) {
  const [state, action, pending] = useActionState(signUpAction, undefined);
  return (
    <div className="space-y-4">
      <Steps step={1} />
      <ActionForm action={action} className="space-y-4">
        <FormError message={state?.error} />
        <Field label="Nome" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <ProfileFields />
        <PasswordPair />
        <Field label="Código de indicação (opcional)" htmlFor="coupon" hint="Recebeu o código de alguém? Digite os 6 números. Ele ajuda quem te convidou.">
          <Input id="coupon" name="coupon" inputMode="numeric" maxLength={6} pattern="\d{6}" defaultValue={coupon} placeholder="000000" autoComplete="off" />
        </Field>
        <Button className="w-full" disabled={pending}>
          {pending ? "Criando sua conta..." : <>Continuar <ArrowRight size={16} /></>}
        </Button>
      </ActionForm>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/entrar" className="font-medium text-primary">Entrar</Link>
      </p>
    </div>
  );
}

export function Steps({ step }: { step: 1 | 2 }) {
  const items = ["Seus dados", "Conectar a IA"];
  return (
    <ol className="flex items-center gap-2 text-xs font-medium">
      {items.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span className={cn("grid size-6 place-items-center rounded-full", step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted")}>{i + 1}</span>
          <span className={step === i + 1 ? "text-foreground" : "text-muted"}>{label}</span>
          {i === 0 && <span className="h-px flex-1 bg-border" />}
        </li>
      ))}
    </ol>
  );
}
