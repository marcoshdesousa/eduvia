import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";
import { syncpayConfigured } from "@/lib/syncpay";

export const metadata: Metadata = { title: "Pagamentos" };
const KIND = { SUBSCRIPTION: "Mensalidade", UPGRADE: "Troca p/ Completo", UNLOCK: "Desbloqueio" } as const;

export default async function AdminPayments() {
  await requireAdmin();
  const month = new Date(Date.now() - 30 * 86_400_000);
  const [payments, byKind] = await Promise.all([
    db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { name: true } } } }),
    db.payment.groupBy({ by: ["kind"], where: { status: "PAID", provider: "SYNCPAY", paidAt: { gt: month } }, _sum: { amountCents: true }, _count: true }),
  ]);
  return (
    <div className="space-y-4">
      <PageTitle title="Pagamentos" subtitle={syncpayConfigured() ? "Pix automático (SyncPay) ligado." : "Pix automático desligado: preencha SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET no Render."} />
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(KIND) as (keyof typeof KIND)[]).map((k) => {
          const r = byKind.find((x) => x.kind === k);
          return <Stat key={k} label={`${KIND[k]} (30 dias)`} value={formatBRL(r?._sum.amountCents ?? 0)} hint={`${r?._count ?? 0} pagamento(s)`} />;
        })}
      </div>
      <Card className="space-y-2">
        <CardTitle>Últimos pagamentos</CardTitle>
        <ul className="divide-y divide-border text-sm">
          {payments.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{p.user.name}<span className="block text-xs text-muted">{p.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {KIND[p.kind]} · {p.provider === "MANUAL" ? "liberação manual" : `Pix ${formatBRL(p.amountCents)}`}</span></span>
              <Badge tone={p.status === "PAID" ? "success" : p.status === "FAILED" ? "danger" : "warning"}>{p.status === "PAID" ? "Pago" : p.status === "FAILED" ? "Não pago" : "Pendente"}</Badge>
            </li>
          ))}
          {!payments.length && <li className="py-2 text-muted">Nenhum pagamento ainda.</li>}
        </ul>
      </Card>
    </div>
  );
}
