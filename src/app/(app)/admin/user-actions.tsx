"use client";
import { useState, useTransition } from "react";
import { endPlanAction, grantPlanAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";

export function AdminUserActions({ userId, name, hasPlan, plans }: { userId: string; name: string; hasPlan: boolean; plans: { slug: string; name: string; week: string; month: string }[] }) {
  const [pending, start] = useTransition();
  const [plan, setPlan] = useState(plans[0]?.slug ?? "");
  const [interval, setInterval] = useState<"WEEK" | "MONTH">("MONTH");
  const chosen = plans.find((p) => p.slug === plan);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={plan} onChange={(e) => setPlan(e.target.value)} className="h-8 w-auto text-xs" aria-label="Plano">
        {plans.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </Select>
      <Select value={interval} onChange={(e) => setInterval(e.target.value as "WEEK" | "MONTH")} className="h-8 w-auto text-xs" aria-label="Período">
        <option value="WEEK">Semanal ({chosen?.week})</option>
        <option value="MONTH">Mensal ({chosen?.month})</option>
      </Select>
      <Button
        size="sm"
        disabled={pending || !plan}
        onClick={() =>
          confirm(`Confirmar pagamento e liberar o plano ${chosen?.name} ${interval === "WEEK" ? "semanal" : "mensal"} para ${name}?`) &&
          start(async () => void (await grantPlanAction(userId, plan, interval)))
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
