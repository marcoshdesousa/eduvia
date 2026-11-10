import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";
import { syncpayConfigured } from "@/lib/syncpay";

export const metadata: Metadata = { title: "Assinaturas" };

export default async function AdminSubs() {
  await requireAdmin();
  const now = new Date();
  const [subs, payments] = await Promise.all([
    db.subscription.findMany({ orderBy: { currentPeriodEnd: "desc" }, take: 100, include: { pro: { include: { user: { select: { name: true } } } } } }),
    db.subscriptionPayment.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { pro: { include: { user: { select: { name: true } } } } } }),
  ]);
  return (
    <div className="space-y-4">
      <PageTitle title="Assinaturas" subtitle={syncpayConfigured() ? "Pix automático (SyncPay) ligado." : "Pix automático desligado: preencha SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET no Render."} />
      <Card className="space-y-2">
        <CardTitle>Profissionais</CardTitle>
        <ul className="divide-y divide-border text-sm">
          {subs.map((s) => {
            const on = !!s.currentPeriodEnd && s.currentPeriodEnd > now;
            return (
              <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                <span>{s.pro.user.name}</span>
                <span className="flex items-center gap-2 text-xs text-muted">{s.currentPeriodEnd?.toLocaleDateString("pt-BR")} <Badge tone={on ? "success" : "danger"}>{on ? "Ativa" : "Vencida"}</Badge></span>
              </li>
            );
          })}
          {!subs.length && <li className="py-2 text-muted">Nenhuma assinatura ainda.</li>}
        </ul>
      </Card>
      <Card className="space-y-2">
        <CardTitle>Pagamentos recentes</CardTitle>
        <ul className="divide-y divide-border text-sm">
          {payments.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{p.pro.user.name}<span className="block text-xs text-muted">{p.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {p.provider === "MANUAL" ? "Liberação manual" : `Pix ${formatBRL(p.amountCents)}`}</span></span>
              <Badge tone={p.status === "PAID" ? "success" : p.status === "FAILED" ? "danger" : "warning"}>{p.status === "PAID" ? "Pago" : p.status === "FAILED" ? "Falhou" : "Pendente"}</Badge>
            </li>
          ))}
          {!payments.length && <li className="py-2 text-muted">Nenhum pagamento ainda.</li>}
        </ul>
      </Card>
    </div>
  );
}
