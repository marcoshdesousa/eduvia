import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { CpfInput } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { requestReset } from "./actions";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecoverPage() {
  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Esqueci a senha</h1>
        <p className="text-sm text-muted">
          Como a conta não usa e-mail, a troca de senha passa pelo suporte: confirmamos seus dados e enviamos um link seguro (vale 24 horas, uma vez só).
        </p>
      </div>
      <ActionForm action={requestReset} className="space-y-4" resetOnOk>
        <div>
          <Label htmlFor="cpf">CPF da conta</Label>
          <CpfInput />
        </div>
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" required minLength={5} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="contact">Telefone ou WhatsApp para contato</Label>
          <Input id="contact" name="contact" type="tel" required minLength={8} maxLength={120} />
        </div>
        <SubmitButton className="w-full" pendingText="Enviando…">Pedir nova senha</SubmitButton>
      </ActionForm>
    </Card>
  );
}
