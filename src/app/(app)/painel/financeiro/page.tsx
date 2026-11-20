import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { Card, CardTitle } from "@/components/ui/card";
import { categoryLabel, formatBRL } from "@/lib/domain";
import { providerFinance } from "@/lib/finance";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";

export const metadata: Metadata = { title: "Financeiro" };

export default async function FinancePage() {
  const user = await requireProvider();
  const f = await providerFinance(user.provider.id);
  const max = Math.max(1, ...f.months.map((m) => m.cents));
  const tiles = [
    { t: "Esta semana", v: f.week },
    { t: "Este mês", v: f.month },
    { t: "Últimos 30 dias", v: f.last30 },
  ];
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Financeiro" subtitle="Soma dos serviços concluídos (o valor final que você marcou ao concluir). O cliente paga direto para você." />
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((x) => (
          <Card key={x.t} className="p-3">
            <p className="text-xs text-muted">{x.t}</p>
            <p className="text-lg font-extrabold">{formatBRL(x.v.cents)}</p>
            <p className="text-xs text-muted">{x.v.count} serviço(s)</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardTitle>Últimos 6 meses</CardTitle>
        <div className="mt-4 flex h-44 items-end gap-2" role="img" aria-label="Valor recebido por mês">
          {f.months.map((m) => (
            <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-medium text-muted">{m.cents ? formatBRL(m.cents).replace(",00", "") : ""}</span>
              <div className="w-full rounded-t-md bg-primary" style={{ height: `${Math.max(m.cents ? 4 : 1, (m.cents / max) * 100)}%`, opacity: m.cents ? 1 : 0.25 }} />
              <span className="text-xs capitalize">{m.label}</span>
              <span className="text-[10px] text-muted">{m.count}</span>
            </div>
          ))}
        </div>
      </Card>
      {f.byCategory.length > 0 && (
        <Card>
          <CardTitle>Este mês por serviço</CardTitle>
          <ul className="mt-2 divide-y divide-border text-sm">
            {f.byCategory.map(([cat, v]) => (
              <li key={cat} className="flex justify-between py-2"><span>{categoryLabel(cat)} <span className="text-muted">({v.count})</span></span><strong>{formatBRL(v.cents)}</strong></li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
