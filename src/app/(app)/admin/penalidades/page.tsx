import type { Metadata } from "next";
import { ActionButton } from "@/components/action-button";
import { PageTitle } from "@/components/bits";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { liftClientBlock, liftQuickBan } from "../actions";

export const metadata: Metadata = { title: "Penalidades" };

export default async function AdminPenalties() {
  await requireAdmin();
  const now = new Date();
  const [clients, pros] = await Promise.all([
    db.cpfLedger.findMany({ where: { clientBlockedUntil: { gt: now } }, orderBy: { clientBlockedUntil: "asc" }, take: 100 }),
    db.providerProfile.findMany({ where: { quickBannedUntil: { gt: now } }, include: { user: { select: { name: true } } }, orderBy: { quickBannedUntil: "asc" }, take: 100 }),
  ]);
  const users = await db.user.findMany({ where: { cpfHash: { in: clients.map((c) => c.cpfHash) } }, select: { cpfHash: true, name: true } });
  const nameOf = new Map(users.map((u) => [u.cpfHash, u.name]));
  return (
    <div className="space-y-4">
      <PageTitle title="Penalidades do Contrate rápido" subtitle="Cliente que não estava: 30 dias sem contratar (ou paga R$ 2,85). Prestador que não chegou em 2 horas: 7 dias fora do rápido." />
      <Card className="space-y-2">
        <CardTitle>Clientes bloqueados ({clients.length})</CardTitle>
        <ul className="divide-y divide-border text-sm">
          {clients.map((c) => (
            <li key={c.cpfHash} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{nameOf.get(c.cpfHash) ?? "(conta apagada)"}<span className="block text-xs text-muted">até {c.clientBlockedUntil!.toLocaleDateString("pt-BR")} · {c.clientBlockReason}</span></span>
              <ActionButton action={liftClientBlock.bind(null, c.cpfHash)} size="sm" variant="outline" confirm="Liberar este cliente?">Liberar</ActionButton>
            </li>
          ))}
          {!clients.length && <li className="py-2 text-muted">Ninguém bloqueado.</li>}
        </ul>
      </Card>
      <Card className="space-y-2">
        <CardTitle>Prestadores fora do rápido ({pros.length})</CardTitle>
        <ul className="divide-y divide-border text-sm">
          {pros.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{p.user.name}<span className="block text-xs text-muted">até {p.quickBannedUntil!.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span></span>
              <ActionButton action={liftQuickBan.bind(null, p.id)} size="sm" variant="outline" confirm="Tirar a penalidade?">Tirar penalidade</ActionButton>
            </li>
          ))}
          {!pros.length && <li className="py-2 text-muted">Ninguém penalizado.</li>}
        </ul>
      </Card>
    </div>
  );
}
