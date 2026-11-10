import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/bits";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { SUBSCRIPTION_CENTS, SUBSCRIPTION_DAYS, SUBSCRIPTION_EXTRA_CENTS, SUBSCRIPTION_FEE_CENTS, formatBRL } from "@/lib/domain";
import { requirePro } from "@/lib/session";
import { RENEW_WINDOW_DAYS, subscriptionActive } from "@/lib/subscription";
import { syncpayConfigured } from "@/lib/syncpay";
import { PixBox } from "./pix-box";

export const metadata: Metadata = { title: "Assinatura" };

const STATUS = { PENDING: ["Aguardando", "warning"], PAID: ["Pago", "success"], FAILED: ["Não concluído", "danger"] } as const;

export default async function SubscriptionPage() {
  const user = await requirePro();
  const [sub, payments] = await Promise.all([
    db.subscription.findUnique({ where: { proId: user.pro.id } }),
    db.subscriptionPayment.findMany({ where: { proId: user.pro.id }, orderBy: { createdAt: "desc" }, take: 24 }),
  ]);
  const active = subscriptionActive(sub);
  const end = sub?.currentPeriodEnd ?? null;
  const canPay = !end || end.getTime() - Date.now() <= RENEW_WINDOW_DAYS * 86_400_000;
  const open = payments.find((p) => p.status === "PENDING" && p.pixCode && Date.now() - p.createdAt.getTime() < 30 * 60_000);
  return (
    <div className="space-y-5">
      <PageTitle title="Assinatura" subtitle="Com a assinatura em dia, você aparece na vitrine e recebe pedidos." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <CardTitle>Plano do profissional</CardTitle>
          <p className="text-3xl font-extrabold text-brand-ink">{formatBRL(SUBSCRIPTION_CENTS)}<span className="text-base font-medium text-muted"> por mês</span></p>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Mensalidade</dt><dd>{formatBRL(SUBSCRIPTION_FEE_CENTS)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Valor adicional previsto no preço</dt><dd>{formatBRL(SUBSCRIPTION_EXTRA_CENTS)}</dd></div>
            <div className="flex justify-between border-t border-border pt-1 font-semibold"><dt>Total</dt><dd>{formatBRL(SUBSCRIPTION_CENTS)}</dd></div>
          </dl>
          <ul className="space-y-1 text-sm text-muted">
            <li>• Período de {SUBSCRIPTION_DAYS} dias, pago por Pix.</li>
            <li>• Sem comissão, sem taxa por hora e sem taxa por serviço.</li>
            <li>• O valor das limpezas é seu: o cliente paga direto a você.</li>
            <li>• Vencida, o perfil sai da vitrine, mas o histórico e o suporte continuam.</li>
          </ul>
        </Card>
        <Card className="space-y-3">
          <CardTitle>Situação</CardTitle>
          <div className="flex items-center gap-2">
            {active ? <Badge tone="success">Ativa</Badge> : end ? <Badge tone="danger">Vencida</Badge> : <Badge>Não assinada</Badge>}
            {end && <span className="text-sm text-muted">{active ? "vence" : "venceu"} em {end.toLocaleDateString("pt-BR")}</span>}
          </div>
          {canPay ? (
            syncpayConfigured() ? (
              <PixBox open={open ? { id: open.id, pixCode: open.pixCode!, createdAt: open.createdAt.toISOString() } : null} label={active ? "Renovar por mais 30 dias" : "Assinar por Pix"} />
            ) : (
              <p className="rounded-lg bg-surface-2 p-3 text-sm text-muted">O Pix automático ainda está sendo configurado. Fale com o suporte para ativar a sua assinatura.</p>
            )
          ) : (
            <p className="text-sm text-muted">A renovação abre {RENEW_WINDOW_DAYS} dias antes do vencimento.</p>
          )}
        </Card>
      </div>
      <Card className="space-y-3">
        <CardTitle>Histórico de pagamentos</CardTitle>
        {payments.length ? (
          <ul className="divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  {p.createdAt.toLocaleDateString("pt-BR")} · {p.provider === "MANUAL" ? "Liberado pelo suporte" : `Pix ${formatBRL(p.amountCents)}`}
                  {p.periodEnd && <span className="block text-xs text-muted">Período até {p.periodEnd.toLocaleDateString("pt-BR")}</span>}
                </span>
                <Badge tone={STATUS[p.status][1]}>{STATUS[p.status][0]}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nenhum pagamento ainda.</p>
        )}
      </Card>
    </div>
  );
}
