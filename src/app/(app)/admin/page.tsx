import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { formatBRL, listPlans, localDayStart, localMonthStart } from "@/lib/billing";
import { onlyDigits } from "@/lib/core/cpf";
import { formatCpf, formatPhone } from "@/lib/core/phone";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminUserActions } from "./user-actions";
import { PlanEditor } from "./plan-editor";

export const metadata = { title: "Admin" };

const TABS = [
  { key: "alunos", label: "Alunos" },
  { key: "planos", label: "Planos" },
  { key: "ia", label: "Uso de IA" },
] as const;

const TASK_LABEL: Record<string, string> = {
  outline: "Organizar PDFs",
  edital: "Ler edital/ementa",
  session: "Sessões de estudo",
  grade: "Correção de respostas",
  ocr: "OCR (escaneados)",
  questions: "Questões (jogos/simulados)",
  essay: "Redação",
  tutor: "Professor IA",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; aba?: string }> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t.key === sp.aba)?.key ?? "alunos";
  const now = new Date();
  const monthStart = localMonthStart(admin.timezone);
  const plans = await listPlans();

  const dayStart = localDayStart(admin.timezone);
  const [total, withAi, subscribers, revenue, aiToday] = await Promise.all([
    db.user.count({ where: { cpf: { not: null } } }),
    db.user.count({ where: { cpf: { not: null }, geminiKey: { not: null } } }),
    db.subscription.count({ where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } } }),
    db.payment.aggregate({ _sum: { valueCents: true }, where: { status: "PAID", paidAt: { gte: monthStart } } }),
    db.aiUsage.count({ where: { createdAt: { gte: dayStart } } }),
  ]);

  const header = (
    <>
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-muted">Libere planos, ajuste preços e limites e acompanhe o uso da IA dos alunos.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Contas" value={total} hint={`${withAi} com IA conectada`} />
        <Stat label="Assinantes" value={subscribers} />
        <Stat label="Recebido no mês" value={formatBRL(revenue._sum.valueCents ?? 0)} />
        <Stat label="Usos de IA hoje" value={aiToday} hint="custo R$ 0 (chave do aluno)" />
      </div>
      <nav className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link key={t.key} href={`/admin?aba=${t.key}`} className={cn("border-b-2 px-3 py-2 text-sm font-medium", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}>
            {t.label}
          </Link>
        ))}
      </nav>
    </>
  );

  if (tab === "planos") {
    const counts = await db.subscription.groupBy({ by: ["planSlug"], where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } }, _count: true });
    return (
      <div className="space-y-6">
        {header}
        {plans.map((p) => <PlanEditor key={p.slug} plan={{ ...p, subscribers: counts.find((c) => c.planSlug === p.slug)?._count ?? 0 }} />)}
      </div>
    );
  }

  if (tab === "ia") {
    const [byTask, byUser] = await Promise.all([
      db.aiUsage.groupBy({ by: ["task"], where: { createdAt: { gte: dayStart } }, _sum: { inputTokens: true, outputTokens: true }, _count: true, orderBy: { _count: { task: "desc" } } }),
      db.aiUsage.groupBy({ by: ["userId"], where: { createdAt: { gte: dayStart } }, _count: true, orderBy: { _count: { userId: "desc" } }, take: 20 }),
    ]);
    const users = await db.user.findMany({
      where: { id: { in: byUser.flatMap((u) => (u.userId ? [u.userId] : [])) } },
      select: { id: true, name: true, handle: true, subscriptions: { where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } }, include: { plan: true }, take: 1 } },
    });
    const byId = new Map(users.map((u) => [u.id, u]));
    return (
      <div className="space-y-6">
        {header}
        <p className="text-xs text-muted">Hoje. Cada aluno usa a própria chave do Gemini, então a IA não custa nada para a plataforma. Serve para ver quem está perto dos limites.</p>
        <Card>
          <CardTitle>Por tarefa</CardTitle>
          {!byTask.length && <p className="mt-2 text-sm text-muted">Nenhum uso de IA hoje.</p>}
          <ul className="mt-3 divide-y divide-border text-sm">
            {byTask.map((t) => (
              <li key={t.task} className="flex items-center justify-between gap-3 py-2">
                <span>{TASK_LABEL[t.task] ?? t.task}</span>
                <span className="text-muted">{(((t._sum.inputTokens ?? 0) + (t._sum.outputTokens ?? 0)) / 1000).toFixed(0)} mil tokens</span>
                <span className="w-24 text-right font-medium">{t._count} uso(s)</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Alunos que mais usaram</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {byUser.map((u) => {
              const info = u.userId ? byId.get(u.userId) : null;
              const plan = info?.subscriptions[0];
              return (
                <li key={u.userId ?? "sistema"} className="flex flex-wrap items-center justify-between gap-3 py-2">
                  <span className="min-w-0 flex-1 truncate">{info ? `${info.name} @${info.handle}` : "Sistema"}</span>
                  <span className="text-xs text-muted">{plan ? `${plan.plan.name} ${plan.interval === "WEEK" ? "7 dias" : "30 dias"}` : "Grátis"}</span>
                  <span className="w-24 text-right font-medium">{u._count} uso(s)</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    );
  }

  // alunos
  const q = (sp.q ?? "").trim();
  const digits = onlyDigits(q);
  const where = q
    ? {
        OR: [
          { handle: { contains: q.replace(/^@/, "").toLowerCase() } },
          { name: { contains: q, mode: "insensitive" as const } },
          ...(digits.length >= 4 ? [{ cpf: { contains: digits } }, { phone: { contains: digits } }] : []),
        ],
      }
    : {};
  const list = await db.user.findMany({
    where: { ...where, cpf: { not: null } },
    include: { subscriptions: { where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } }, include: { plan: true }, orderBy: { currentPeriodEnd: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const paidPlans = plans.filter((p) => p.slug !== "gratis").map((p) => ({ slug: p.slug, name: p.name, week: formatBRL(p.priceWeekCents), month: formatBRL(p.priceMonthCents) }));

  return (
    <div className="space-y-6">
      {header}
      <form className="flex gap-2">
        <input type="hidden" name="aba" value="alunos" />
        <Input name="q" defaultValue={q} placeholder="Buscar por @, nome, CPF ou telefone" />
        <Button variant="secondary"><Search size={16} /> Buscar</Button>
      </form>
      <div className="space-y-3">
        {!list.length && <Card className="text-sm text-muted">Ninguém encontrado.</Card>}
        {list.map((u) => {
          const sub = u.subscriptions[0];
          return (
            <Card key={u.id} className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-sm text-muted">@{u.handle}</span>
                  {sub ? (
                    <Badge tone="success">{sub.plan.name} {sub.interval === "WEEK" ? "semanal" : "mensal"} até {formatDay(sub.currentPeriodEnd, { day: "2-digit", month: "short" })}</Badge>
                  ) : (
                    <Badge tone="warning">Grátis</Badge>
                  )}
                  {u.geminiKey ? <Badge tone="primary">IA conectada</Badge> : <Badge tone="danger">Sem IA</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                  <span>CPF {formatCpf(u.cpf!)}</span>
                  {u.phone && (
                    <a href={`https://wa.me/55${u.phone}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">WhatsApp {formatPhone(u.phone)}</a>
                  )}
                  <span>Criada em {formatDay(u.createdAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <AdminUserActions userId={u.id} name={u.name} hasPlan={!!sub} plans={paidPlans} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
