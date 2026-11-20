import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionForm, type ActionResult } from "@/components/action-form";
import { PasswordPair } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { findReset, consumeReset } from "@/lib/password-reset";

export const metadata: Metadata = { title: "Nova senha" };

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reset = await findReset(token);
  if (!reset) {
    return (
      <Card className="space-y-3">
        <h1 className="text-xl font-bold">Link inválido ou vencido</h1>
        <p className="text-sm text-muted">Peça um novo link ao suporte.</p>
        <Link href="/recuperar-senha" className={buttonClass("primary")}>Pedir de novo</Link>
      </Card>
    );
  }
  async function save(_: ActionResult, d: FormData): Promise<ActionResult> {
    "use server";
    const password = String(d.get("password") ?? "");
    if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
    if (password !== String(d.get("passwordConfirm") ?? "")) return { error: "As senhas não são iguais." };
    if (!(await consumeReset(token, password))) return { error: "Link inválido ou vencido. Peça um novo ao suporte." };
    redirect("/entrar");
  }
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">Criar nova senha</h1>
      <p className="text-sm text-muted">Conta de {reset.user.name.split(" ")[0]}. Depois, entre com o CPF e a nova senha.</p>
      <ActionForm action={save} className="space-y-4">
        <PasswordPair label="Nova senha" />
        <SubmitButton className="w-full" pendingText="Salvando…">Salvar nova senha</SubmitButton>
      </ActionForm>
    </Card>
  );
}
