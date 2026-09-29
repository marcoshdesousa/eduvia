"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { signUpAction } from "@/app/actions/account";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { ProfileFields } from "@/components/profile-fields";
import { GeminiKeyFields } from "@/components/gemini-key-fields";
import { cn } from "@/lib/utils";

/** Cadastro em 2 passos: 1) dados da conta; 2) chave do Gemini (com "Voltar", sem perder o que foi digitado). */
export function SignupForm() {
  const [state, action, pending] = useActionState(signUpAction, undefined);
  const [step, setStep] = useState<1 | 2>(1);
  return (
    <div className="space-y-4">
      <Steps step={step} />
      <ActionForm
        action={action}
        className="space-y-4"
        beforeSubmit={() => {
          if (step === 2) return true;
          setStep(2);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return false;
        }}
      >
        <FormError message={state?.error} />
        <div className={cn("space-y-4", step !== 1 && "hidden")}>
          <Field label="Nome" htmlFor="name">
            <Input id="name" name="name" autoComplete="name" required />
          </Field>
          <ProfileFields />
          <Field label="Senha" htmlFor="password" hint="Mínimo de 8 caracteres.">
            <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          </Field>
          <Button className="w-full">
            Continuar <ArrowRight size={16} />
          </Button>
        </div>
        <div className={cn("space-y-4", step !== 2 && "hidden")}>
          <GeminiKeyFields required={step === 2} />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={pending}>
              <ArrowLeft size={16} /> Voltar
            </Button>
            <Button className="flex-1" disabled={pending}>{pending ? "Testando a chave..." : "Criar conta grátis"}</Button>
          </div>
        </div>
      </ActionForm>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/entrar" className="font-medium text-primary">Entrar</Link>
      </p>
    </div>
  );
}

function Steps({ step }: { step: 1 | 2 }) {
  const items = ["Seus dados", "Sua IA"];
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
