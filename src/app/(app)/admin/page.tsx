import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { formatBRL } from "@/lib/billing";
import { onlyDigits } from "@/lib/core/cpf";
import { formatCpf, formatPhone } from "@/lib/core/phone";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { Card, Stat } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AdminUserActions } from "./user-actions";

export const metadata = { title: "Admin" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = ((await searchParams).q ?? "").trim();
  const digits = onlyDigits(q);
  const now = new Date();

  const where = q
    ? {
        OR: [
          { handle: { contains: q.replace(/^@/, "").toLowerCase() } },
          { name: { contains: q, mode: "insensitive" as const } },
          ...(digits.length >= 4 ? [{ cpf: { contains: digits } }, { phone: { contains: digits } }] : []),
        ],
      }
    : {};

  const [users, total, inTrial, subscribers, revenue] = await Promise.all([
    db.user.findMany({
      where: { ...where, cpf: { not: null } },
      include: { subscriptions: { where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } }, include: { plan: true }, orderBy: { currentPeriodEnd: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    db.user.count({ where: { cpf: { not: null } } }),
    db.user.count({ where: { trialEndsAt: { gt: now } } }),
    db.subscription.count({ where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } } }),
    db.payment.aggregate({ _sum: { valueCents: true }, where: { status: "PAID", paidAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-muted">Confirmou o pagamento no WhatsApp? Encontre o aluno e libere o plano.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Contas" value={total} />
        <Stat label="Em teste" value={inTrial} />
        <Stat label="Assinantes" value={subscribers} />
        <Stat label="Recebido no mês" value={formatBRL(revenue._sum.valueCents ?? 0)} />
      </div>
      <form className="flex gap-2">
        <Input name="q" defaultValue={q} placeholder="Buscar por @, nome, CPF ou telefone" />
        <Button variant="secondary"><Search size={16} /> Buscar</Button>
      </form>
      <div className="space-y-3">
        {!users.length && <Card className="text-sm text-muted">Ninguém encontrado.</Card>}
        {users.map((u) => {
          const sub = u.subscriptions[0];
          const trial = u.trialEndsAt && u.trialEndsAt > now;
          return (
            <Card key={u.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-sm text-muted">@{u.handle}</span>
                  {sub ? (
                    <Badge tone="success">{sub.plan.name} até {formatDay(sub.currentPeriodEnd, { day: "2-digit", month: "short" })}</Badge>
                  ) : trial ? (
                    <Badge tone="primary">Teste até {formatDay(u.trialEndsAt!, { day: "2-digit", month: "short" })}</Badge>
                  ) : (
                    <Badge tone="danger">Limitado</Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                  <span>CPF {formatCpf(u.cpf!)}</span>
                  {u.phone && (
                    <a href={`https://wa.me/55${u.phone}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      WhatsApp {formatPhone(u.phone)}
                    </a>
                  )}
                  <span>Criada em {formatDay(u.createdAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <AdminUserActions userId={u.id} name={u.name} hasPlan={!!sub} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
