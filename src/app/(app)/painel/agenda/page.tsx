import Link from "next/link";
import type { Metadata } from "next";
import { CalendarPlus, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { BookingBadge, PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, WEEKDAYS, category, minutesToHHMM, qtyLabel, shortName } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { addAgendaEntryAction, deleteAgendaEntryAction, saveAgendaAction } from "../actions";

export const metadata: Metadata = { title: "Minha agenda" };

const TZ = "America/Sao_Paulo";
const dayKey = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: TZ });
const dayTitle = (d: Date) => d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: TZ });
const hm = (d: Date) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

type Item = { key: string; at: Date; end?: Date; kind: "booking" | "entry"; title: string; sub: string; href?: string; status?: Parameters<typeof BookingBadge>[0]["status"]; id: string };

export default async function AgendaPage() {
  const user = await requireProvider();
  const now = new Date();
  const from = new Date(now.getTime() - 12 * 3_600_000);
  const to = new Date(now.getTime() + 60 * 86_400_000);
  const [bookings, entries, rules] = await Promise.all([
    db.booking.findMany({ where: { proId: user.provider.id, status: { in: [...ACTIVE_STATUSES, "PROPOSED", "WAITING_PRO"] }, scheduledAt: { gte: from, lte: to } }, include: { client: { select: { name: true } } }, orderBy: { scheduledAt: "asc" } }),
    db.agendaEntry.findMany({ where: { proId: user.provider.id, endsAt: { gte: now }, startsAt: { lte: to } }, orderBy: { startsAt: "asc" } }),
    db.availabilityRule.findMany({ where: { proId: user.provider.id } }),
  ]);
  const items: Item[] = [
    ...bookings.map((b) => ({ key: `b${b.id}`, id: b.id, at: b.scheduledAt, kind: "booking" as const, title: `${category(b.category)?.emoji ?? ""} ${category(b.category)?.label ?? b.category} · ${shortName(b.client.name)}`, sub: `${qtyLabel(b.unit, b.quantity)}${b.addrDistrict ? ` · ${b.addrDistrict}` : ""} · ${b.addrCity}`, href: `/pedidos/${b.id}`, status: b.status })),
    ...entries.map((e) => ({ key: `e${e.id}`, id: e.id, at: e.startsAt, end: e.endsAt, kind: "entry" as const, title: `📌 ${e.title}`, sub: e.notes ?? "Compromisso seu" })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime());
  const days = new Map<string, Item[]>();
  for (const it of items) days.set(dayKey(it.at), [...(days.get(dayKey(it.at)) ?? []), it]);
  const today = now.toLocaleDateString("sv-SE", { timeZone: TZ });

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageTitle title="Minha agenda" subtitle="Seus serviços e compromissos. O app te lembra antes de cada um." />

      <details className="rounded-2xl border border-primary/40 bg-surface">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold text-primary"><CalendarPlus size={18} /> Colocar compromisso na agenda</summary>
        <ActionForm action={addAgendaEntryAction} resetOnOk className="space-y-3 px-4 pb-4">
          <div>
            <Label htmlFor="title">O quê</Label>
            <Input id="title" name="title" required maxLength={80} placeholder="Ex.: Orçamento na casa da Dona Maria, médico, folga…" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 sm:col-span-1">
              <Label htmlFor="date">Dia</Label>
              <Input id="date" name="date" type="date" min={today} defaultValue={today} required />
            </div>
            <div>
              <Label htmlFor="start">Das</Label>
              <Input id="start" name="start" type="time" defaultValue="08:00" required />
            </div>
            <div>
              <Label htmlFor="end">Até</Label>
              <Input id="end" name="end" type="time" defaultValue="12:00" required />
            </div>
          </div>
          <Input name="notes" maxLength={500} placeholder="Anotação (opcional)" aria-label="Anotação" />
          <p className="text-xs text-muted">Nesse horário você não recebe pedidos nem chamados do Contrate rápido.</p>
          <SubmitButton className="w-full" pendingText="Salvando…">Salvar na agenda</SubmitButton>
        </ActionForm>
      </details>

      {days.size ? (
        [...days.entries()].map(([k, list]) => (
          <section key={k} className="space-y-2">
            <h2 className="text-sm font-bold capitalize">{k === today ? "Hoje · " : ""}{dayTitle(list[0].at)}</h2>
            {list.map((it) => (
              <Card key={it.key} className="flex items-center gap-3 p-3">
                <div className="w-14 shrink-0 text-center">
                  <p className="text-sm font-extrabold text-primary">{hm(it.at)}</p>
                  {it.end && <p className="text-[11px] text-muted">até {hm(it.end)}</p>}
                </div>
                <div className="min-w-0 flex-1">
                  {it.href ? <Link href={it.href} className="block truncate text-sm font-semibold hover:underline">{it.title}</Link> : <p className="truncate text-sm font-semibold">{it.title}</p>}
                  <p className="truncate text-xs text-muted">{it.sub}</p>
                  {it.status && <div className="mt-1"><BookingBadge status={it.status} /></div>}
                </div>
                {it.kind === "entry" && <ActionButton action={deleteAgendaEntryAction.bind(null, it.id)} variant="ghost" size="sm" confirm="Apagar este compromisso?" aria-label="Apagar" quiet><Trash2 size={14} /></ActionButton>}
              </Card>
            ))}
          </section>
        ))
      ) : (
        <Card className="text-center text-sm text-muted">Agenda livre nos próximos 60 dias.</Card>
      )}

      <details className="rounded-2xl border border-border bg-surface">
        <summary className="cursor-pointer px-4 py-3 font-semibold">⏰ Dias e horários de atendimento</summary>
        <div className="px-4 pb-4">
          <CardTitle className="sr-only">Horários</CardTitle>
          <p className="mb-2 text-xs text-muted">Fora destes horários você não recebe pedidos nem chamados.</p>
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
        </div>
      </details>
    </div>
  );
}
