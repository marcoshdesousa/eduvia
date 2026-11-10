import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { WEEKDAYS, minutesToHHMM } from "@/lib/domain";
import { requirePro } from "@/lib/session";
import { saveAvailability } from "../actions";
import { PauseToggle } from "../panel-buttons";

export const metadata: Metadata = { title: "Agenda" };

export default async function AgendaPage() {
  const user = await requirePro();
  const rules = await db.availabilityRule.findMany({ where: { proId: user.pro.id } });
  const byDay = new Map(rules.map((r) => [r.weekday, r]));
  return (
    <div className="space-y-5">
      <PageTitle title="Agenda e disponibilidade" subtitle="Os clientes só conseguem pedir dentro destes horários." />
      <Card className="space-y-2">
        <p className="font-semibold">Pausa</p>
        <p className="text-sm text-muted">Pausando, você sai da vitrine e não recebe novos pedidos. Os serviços já aceitos continuam.</p>
        <PauseToggle paused={user.pro.paused} />
      </Card>
      <Card>
        <ActionForm action={saveAvailability} className="space-y-3">
          <p className="text-sm text-muted">Marque os dias em que você trabalha e o horário. Sem nenhum dia marcado, você decide em cada pedido.</p>
          <ul className="divide-y divide-border">
            {WEEKDAYS.map((name, w) => {
              const r = byDay.get(w);
              return (
                <li key={w} className="grid grid-cols-[7.5rem_1fr_1fr] items-center gap-2 py-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" name={`on${w}`} defaultChecked={!!r} className="h-4 w-4 accent-[var(--primary)]" /> {name}
                  </label>
                  <Input type="time" name={`start${w}`} defaultValue={r ? minutesToHHMM(r.startMin) : "08:00"} aria-label={`${name}: início`} step={1800} />
                  <Input type="time" name={`end${w}`} defaultValue={r ? minutesToHHMM(r.endMin) : "17:00"} aria-label={`${name}: fim`} step={1800} />
                </li>
              );
            })}
          </ul>
          <SubmitButton pendingText="Salvando…">Salvar agenda</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
