import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { WEEKDAYS, minutesToHHMM } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { saveAgendaAction } from "../actions";

export const metadata: Metadata = { title: "Horários" };

export default async function AgendaPage() {
  const user = await requireProvider();
  const rules = await db.availabilityRule.findMany({ where: { proId: user.provider.id } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Dias e horários" subtitle="Você só recebe pedidos e chamados do Contrate rápido dentro destes horários." />
      <Card>
        <ActionForm action={saveAgendaAction} className="space-y-2">
          {WEEKDAYS.map((name, d) => {
            const r = rules.find((x) => x.weekday === d);
            return (
              <div key={d} className="flex items-center gap-2 border-b border-border py-2 last:border-0">
                <label className="flex w-28 items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name={`on${d}`} defaultChecked={!!r} className="h-4 w-4 accent-[var(--primary)]" /> {name}
                </label>
                <Input type="time" name={`start${d}`} defaultValue={minutesToHHMM(r?.startMin ?? 7 * 60)} className="w-28" aria-label={`Início ${name}`} />
                <span className="text-muted">até</span>
                <Input type="time" name={`end${d}`} defaultValue={minutesToHHMM(r?.endMin ?? 18 * 60)} className="w-28" aria-label={`Fim ${name}`} />
              </div>
            );
          })}
          <SubmitButton className="mt-2 w-full" pendingText="Salvando…">Salvar horários</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
