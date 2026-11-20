import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { CATEGORIES, CATEGORY_GROUPS, PACK_CENTS, PLANS, UNIT_LABEL, UNLOCK_FEE_CENTS, formatBRL, quickHourPrice, quickPrice, QUICK_CATEGORIES } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { syncpayConfigured } from "@/lib/syncpay";
import { saveQuickPrices, saveSettings } from "../actions";

export const metadata: Metadata = { title: "Configurações" };

const brlOrEmpty = (c: number | null) => (c == null ? "" : (c / 100).toFixed(2).replace(".", ","));

export default async function AdminConfig() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <div className="space-y-4">
      <PageTitle title="Configurações" />
      <Card>
        <ActionForm action={saveSettings} className="space-y-4">
          <div className="max-w-xs">
            <Label htmlFor="requestExpiryHours">Prazo para o prestador responder um pedido normal (horas)</Label>
            <Input id="requestExpiryHours" name="requestExpiryHours" type="number" min={1} max={168} defaultValue={s.requestExpiryHours} />
            <p className="mt-1 text-xs text-muted">Depois disso, a solicitação expira e o cliente escolhe outra pessoa.</p>
          </div>
          <fieldset className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-2">
            <legend className="px-1 text-sm font-semibold">⚡ Contrate rápido</legend>
            <div>
              <Label htmlFor="quickRingSeconds">Tempo tocando para cada prestador (segundos)</Label>
              <Input id="quickRingSeconds" name="quickRingSeconds" type="number" min={15} max={180} defaultValue={s.quickRingSeconds} />
            </div>
            <div>
              <Label htmlFor="quickWaveSize">Prestadores chamados por rodada</Label>
              <Input id="quickWaveSize" name="quickWaveSize" type="number" min={1} max={20} defaultValue={s.quickWaveSize} />
            </div>
            <div>
              <Label htmlFor="quickMaxKm">Distância máxima (km)</Label>
              <Input id="quickMaxKm" name="quickMaxKm" type="number" min={2} max={150} defaultValue={s.quickMaxKm} />
            </div>
            <div>
              <Label htmlFor="quickSearchMinutes">Procurar por até (minutos)</Label>
              <Input id="quickSearchMinutes" name="quickSearchMinutes" type="number" min={2} max={60} defaultValue={s.quickSearchMinutes} />
            </div>
          </fieldset>
          <div className="max-w-xs">
            <Label htmlFor="supportWhatsapp">WhatsApp do suporte (opcional)</Label>
            <Input id="supportWhatsapp" name="supportWhatsapp" defaultValue={s.supportWhatsapp} placeholder="(00) 00000-0000" />
          </div>
          <SubmitButton pendingText="Salvando…">Salvar</SubmitButton>
        </ActionForm>
      </Card>
      <Card className="space-y-3">
        <CardTitle>⚡ Valores fixos do Contrate rápido</CardTitle>
        <p className="text-sm text-muted">O mesmo valor para todos os prestadores de cada profissão (um pouco abaixo do mercado). O prestador recebe tudo. Chamados novos usam o valor novo. A hora padrão é a diária ÷ 8 × 1,5 (sai mais cara que a diária). Apague o valor para voltar ao padrão.</p>
        <ActionForm action={saveQuickPrices} className="space-y-4">
          {CATEGORY_GROUPS.filter((g) => QUICK_CATEGORIES.some((c) => c.group === g)).map((g) => (
            <fieldset key={g} className="space-y-2">
              <legend className="text-sm font-semibold">{g}</legend>
              <div className="grid grid-cols-[1fr_6rem_6rem] gap-2 text-[11px] font-semibold uppercase text-muted"><span /><span>Valor fixo</span><span>Por hora</span></div>
              {QUICK_CATEGORIES.filter((c) => c.group === g).map((c) => (
                <div key={c.slug} className="grid grid-cols-[1fr_6rem_6rem] items-center gap-2 text-sm">
                  <label htmlFor={`price_${c.slug}`}>{c.emoji} {c.label} <span className="text-xs text-muted">{UNIT_LABEL[c.unit].per}{s.quickPrices[c.slug] ? ` · padrão ${formatBRL(c.quick)}` : ""}</span></label>
                  <Input id={`price_${c.slug}`} name={`price_${c.slug}`} inputMode="decimal" defaultValue={(quickPrice(c.slug, s.quickPrices)! / 100).toFixed(2).replace(".", ",")} className="h-9" />
                  {c.unit === "HORA" ? (
                    <span className="text-center text-xs text-muted">—</span>
                  ) : (
                    <Input id={`hour_${c.slug}`} name={`hour_${c.slug}`} aria-label={`${c.label}: valor da hora`} inputMode="decimal" placeholder="—" defaultValue={brlOrEmpty(quickHourPrice(c.slug, s.quickPrices, s.quickHourPrices))} className="h-9" />
                  )}
                </div>
              ))}
            </fieldset>
          ))}
          <SubmitButton pendingText="Salvando…">Salvar valores</SubmitButton>
        </ActionForm>
      </Card>
      <Card className="space-y-1 text-sm text-muted">
        <p>Plano Completo: <strong className="text-foreground">{formatBRL(PLANS.FULL.priceCents)}/mês</strong> ({formatBRL(PLANS.FULL.platformCents)} + {formatBRL(PLANS.FULL.feesCents)} de taxas). Básico: <strong className="text-foreground">{formatBRL(PLANS.BASIC.priceCents)}/mês</strong> ({formatBRL(PLANS.BASIC.platformCents)} + {formatBRL(PLANS.BASIC.feesCents)}). Pacote +2 endereços: {formatBRL(PACK_CENTS)}/mês. Desbloqueio do cliente: {formatBRL(UNLOCK_FEE_CENTS)}.</p>
        <p>Para o cliente é grátis. Sem comissão sobre os serviços.</p>
        <p>Pix automático (SyncPay): {syncpayConfigured() ? "ligado" : "desligado — preencha SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET no Render"}.</p>
      </Card>
    </div>
  );
}
