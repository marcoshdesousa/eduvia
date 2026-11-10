"use client";
import { useState } from "react";
import type { BookingStatus } from "@/generated/prisma/enums";
import { ActionForm, type ActionResult } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

const LABEL: Partial<Record<BookingStatus, string>> = {
  ACCEPTED: "Aceitar",
  REFUSED: "Recusar",
  CANCELED_CLIENT: "Cancelar",
  CANCELED_PRO: "Cancelar",
  ON_THE_WAY: "Estou a caminho",
  ARRIVED: "Cheguei",
  STARTED: "Iniciar serviço",
  COMPLETED: "Marcar como concluído",
  IN_REVIEW: "Pôr em análise",
};
const DANGER = new Set<BookingStatus>(["REFUSED", "CANCELED_CLIENT", "CANCELED_PRO"]);

/** Botões dos próximos passos. Os que pedem motivo abrem um campo antes de confirmar. */
export function StatusActions({
  steps,
  action,
  adminLabels,
}: {
  steps: { to: BookingStatus; reason: boolean }[];
  action: (to: BookingStatus, p: ActionResult, d: FormData) => Promise<ActionResult>;
  adminLabels?: boolean;
}) {
  const [asking, setAsking] = useState<BookingStatus | null>(null);
  if (!steps.length) return null;
  const label = (to: BookingStatus) => (adminLabels && to === "COMPLETED" ? "Concluir (admin)" : adminLabels && to.startsWith("CANCELED") ? `Cancelar (${to === "CANCELED_CLIENT" ? "pelo cliente" : "pelo profissional"})` : adminLabels && to === "ACCEPTED" ? "Voltar para confirmada" : LABEL[to] ?? to);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {steps.map((s) =>
          s.reason || s.to === "REFUSED" ? (
            <Button key={s.to} type="button" variant={DANGER.has(s.to) ? "outline" : "secondary"} className={DANGER.has(s.to) ? "text-danger" : ""} onClick={() => setAsking(asking === s.to ? null : s.to)}>
              {label(s.to)}
            </Button>
          ) : (
            <ActionForm key={s.to} action={action.bind(null, s.to)} confirm={s.to === "COMPLETED" ? "Confirmar que o serviço foi concluído?" : undefined}>
              <SubmitButton variant={s.to === "ACCEPTED" ? "primary" : "secondary"} pendingText="Salvando…">{label(s.to)}</SubmitButton>
            </ActionForm>
          ),
        )}
      </div>
      {asking && (
        <ActionForm action={action.bind(null, asking)} className="space-y-2 rounded-lg border border-border p-3">
          <label className="block text-sm font-medium" htmlFor="reason">
            {asking === "REFUSED" ? "Motivo (opcional)" : "Motivo"}
          </label>
          <Input id="reason" name="reason" maxLength={500} required={asking !== "REFUSED"} placeholder={asking === "REFUSED" ? "Ex.: não tenho esse horário livre" : "Conte o motivo"} />
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setAsking(null)}>Voltar</Button>
            <SubmitButton variant={DANGER.has(asking) ? "danger" : "primary"} pendingText="Salvando…">Confirmar: {label(asking)}</SubmitButton>
          </div>
        </ActionForm>
      )}
    </div>
  );
}
