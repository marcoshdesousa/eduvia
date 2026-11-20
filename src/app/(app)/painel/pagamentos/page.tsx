import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { PAY_METHODS } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { savePaymentAction } from "../actions";

export const metadata: Metadata = { title: "Pagamento e agendamento" };

export default async function PaymentPrefsPage() {
  const user = await requireProvider();
  const pro = await db.providerProfile.findUniqueOrThrow({ where: { id: user.provider.id } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Pagamento e agendamento" subtitle="Vale para todos os seus perfis." />
      <Card>
        <ActionForm action={savePaymentAction} className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="mb-1 font-semibold">Como você recebe do cliente</legend>
            {(Object.keys(PAY_METHODS) as (keyof typeof PAY_METHODS)[]).map((k) => (
              <label key={k} className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="checkbox" name="pay" value={k} defaultChecked={pro.payMethods.includes(k)} className="h-4 w-4 accent-[var(--primary)]" />
                {PAY_METHODS[k]}{(k === "DEBITO" || k === "CREDITO") && <span className="text-xs text-muted">(tenho maquininha)</span>}
              </label>
            ))}
            <p className="text-xs text-muted">Aparece no seu perfil e você manda para o cliente com um toque na conversa.</p>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="mb-1 font-semibold">Agendamento</legend>
            <label className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" name="directBooking" defaultChecked={pro.directBooking} className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
              <span><strong>O cliente pode pedir direto pelo app</strong> (escolhe dia e hora, você aceita ou recusa). Desmarcado: o cliente precisa mandar mensagem e <strong>você agenda pela conversa</strong>.</span>
            </label>
          </fieldset>
          <SubmitButton className="w-full" pendingText="Salvando…">Salvar</SubmitButton>
        </ActionForm>
      </Card>
      <Card className="text-sm text-muted">
        <CardTitle className="mb-1 text-base text-foreground">Dica</CardTitle>
        Na conversa, toque nos <strong>4 quadradinhos</strong> para mandar fotos, mensagens rápidas, suas formas de pagamento ou agendar um horário.
      </Card>
    </div>
  );
}
