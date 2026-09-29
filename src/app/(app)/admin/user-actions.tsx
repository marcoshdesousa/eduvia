"use client";
import { useTransition } from "react";
import { endPlanAction, grantPlanAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";

export function AdminUserActions({ userId, name, hasPlan }: { userId: string; name: string; hasPlan: boolean }) {
  const [pending, start] = useTransition();
  const grant = (slug: string, label: string) =>
    confirm(`Confirmar pagamento e liberar o plano ${label} para ${name}?`) && start(async () => void (await grantPlanAction(userId, slug)));
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => grant("semanal", "Semanal")}>+ Semanal</Button>
      <Button size="sm" disabled={pending} onClick={() => grant("mensal", "Mensal")}>+ Mensal</Button>
      {hasPlan && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => confirm(`Encerrar o plano de ${name} agora?`) && start(async () => void (await endPlanAction(userId)))}>
          Encerrar
        </Button>
      )}
    </div>
  );
}
