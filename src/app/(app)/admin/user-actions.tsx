"use client";
import { useState, useTransition } from "react";
import { endPlanAction, grantPlanAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";

type Interval = "WEEK" | "FORTNIGHT" | "MONTH";
const DAYS: Record<Interval, number> = { WEEK: 7, FORTNIGHT: 15, MONTH: 30 };

export function AdminUserActions({
  userId,
  name,
  hasPlan,
  plans,
}: {
  userId: string;
  name: string;
  hasPlan: boolean;
  plans: { slug: string; name: string; prices: { key: Interval; label: string }[] }[];
}) {
  const [pending, start] = useTransition();
  const [plan, setPlan] = useState(plans[0]?.slug ?? "");
  const [interval, setInterval] = useState<Interval>("MONTH");
  const chosen = plans.find((p) => p.slug === plan);
  const period = chosen?.prices.some((p) => p.key === interval) ? interval : (chosen?.prices.at(-1)?.key ?? "MONTH");
  return (
    <div className="flex flex-wrap items-center gap-2">
      {plans.length > 1 && (
        <Select value={plan} onChange={(e) => setPlan(e.target.value)} className="h-8 w-auto text-xs" aria-label="Plano">
          {plans.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </Select>
      )}
      <Select value={period} onChange={(e) => setInterval(e.target.value as Interval)} className="h-8 w-auto text-xs" aria-label="Período">
        {chosen?.prices.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
      </Select>
      <Button
        size="sm"
        disabled={pending || !plan}
        onClick={() =>
          confirm(`Confirmar pagamento e liberar o plano ${chosen?.name} por ${DAYS[period]} dias para ${name}?`) &&
          start(async () => void (await grantPlanAction(userId, plan, period)))
        }
      >
        Liberar
      </Button>
      {hasPlan && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => confirm(`Encerrar o plano de ${name} agora?`) && start(async () => void (await endPlanAction(userId)))}>
          Encerrar
        </Button>
      )}
    </div>
  );
}
