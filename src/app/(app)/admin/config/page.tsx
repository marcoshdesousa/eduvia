import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { SUBSCRIPTION_CENTS, formatBRL } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { syncpayConfigured } from "@/lib/syncpay";
import { saveSettings } from "../actions";

export const metadata: Metadata = { title: "Configurações" };

export default async function AdminConfig() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <div className="space-y-4">
      <PageTitle title="Configurações" />
      <Card>
        <ActionForm action={saveSettings} className="space-y-4">
          <div className="max-w-xs">
            <Label htmlFor="requestExpiryHours">Prazo para o profissional responder (horas)</Label>
            <Input id="requestExpiryHours" name="requestExpiryHours" type="number" min={1} max={168} defaultValue={s.requestExpiryHours} />
            <p className="mt-1 text-xs text-muted">Depois disso, a solicitação expira e o cliente escolhe outra pessoa.</p>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="multipleCities" defaultChecked={s.multipleCities} /> Permitir que o profissional atenda em mais de um município</label>
          <div className="max-w-xs">
            <Label htmlFor="maxCities">Máximo de municípios por profissional</Label>
            <Input id="maxCities" name="maxCities" type="number" min={1} max={30} defaultValue={s.maxCities} />
          </div>
          <div className="max-w-xs">
            <Label htmlFor="supportWhatsapp">WhatsApp do suporte (opcional)</Label>
            <Input id="supportWhatsapp" name="supportWhatsapp" defaultValue={s.supportWhatsapp} placeholder="(00) 00000-0000" />
          </div>
          <SubmitButton pendingText="Salvando…">Salvar</SubmitButton>
        </ActionForm>
      </Card>
      <Card className="space-y-1 text-sm text-muted">
        <p>Assinatura do profissional: <strong className="text-foreground">{formatBRL(SUBSCRIPTION_CENTS)}/mês</strong> (R$ 15,00 + R$ 0,85). Sem comissão e sem taxa por serviço.</p>
        <p>Pix automático (SyncPay): {syncpayConfigured() ? "ligado" : "desligado — preencha SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET no Render"}.</p>
      </Card>
    </div>
  );
}
