import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { INTERVALS, intervalInfo, priceFor } from "@/lib/plans";
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
import { SiteForm } from "./site-form";
import { SupportChat } from "@/components/support-chat";
import { Avatar } from "@/components/avatar";
import { replySupportAction } from "@/app/actions/support";
import { markUserMessagesRead, staffTickets, supportUnreadForStaff, ticketFor } from "@/lib/support";
import { CloseTicketButton } from "./close-ticket-button";
import { ALL_PROVIDERS, disabledProviders, hasKey, providerLabel } from "@/lib/ai/providers";
import { toggleProviderAction } from "@/app/actions/ai";
import { VoiceTest } from "./voice-test";

export const metadata = { title: "Admin" };

const TABS = [
  { key: "alunos", label: "Alunos" },
  { key: "suporte", label: "Suporte" },
  { key: "planos", label: "Planos" },
  { key: "ia", label: "Uso de IA" },
  { key: "site", label: "Site" },
] as const;

const TASK_LABEL: Record<string, string> = {
  outline: "Organizar PDFs",
  edital: "Ler edital/ementa",
  session: "Sessões de estudo",
  grade: "Correção de respostas",
  ocr: "OCR (escaneados)",
  questions: "Questões (testes rápidos/simulados)",
  essay: "Redação",
  tutor: "Professor IA",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; aba?: string; chamado?: string }> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t.key === sp.aba)?.key ?? "alunos";
  const now = new Date();
  const monthStart = localMonthStart(admin.timezone);
  const plans = await listPlans();

  const dayStart = localDayStart(admin.timezone);
  const [total, withAi, subscribers, revenue, aiToday, supportUnread] = await Promise.all([
    db.user.count({ where: { cpf: { not: null } } }),
    db.user.count({ where: { cpf: { not: null }, geminiKey: { not: null } } }),
    db.subscription.count({ where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } } }),
    db.payment.aggregate({ _sum: { valueCents: true }, where: { status: "PAID", paidAt: { gte: monthStart } } }),
    db.aiUsage.count({ where: { createdAt: { gte: dayStart } } }),
    supportUnreadForStaff(),
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
      <nav className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <Link key={t.key} href={`/admin?aba=${t.key}`} className={cn("inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}>
            {t.label}
            {t.key === "suporte" && supportUnread > 0 && <span className="rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">{supportUnread}</span>}
          </Link>
        ))}
      </nav>
    </>
  );

  if (tab === "suporte") {
    const ticket = sp.chamado ? await ticketFor(sp.chamado) : null;
    if (ticket) {
      await markUserMessagesRead(ticket.id);
      const at = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: admin.timezone });
      return (
        <div className="space-y-6">
          {header}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Link href="/admin?aba=suporte" className="text-sm text-primary">← Todos os chamados</Link>
              <h2 className="text-lg font-semibold">{ticket.kind} · {ticket.user.name} <span className="text-sm font-normal text-muted">@{ticket.user.handle}</span></h2>
            </div>
            <div className="flex items-center gap-3">
              {ticket.user.phone && <a href={`https://wa.me/55${ticket.user.phone}`} target="_blank" rel="noreferrer" className="text-sm text-primary">WhatsApp {formatPhone(ticket.user.phone)}</a>}
              {ticket.status === "OPEN" ? <CloseTicketButton ticketId={ticket.id} /> : <Badge>Finalizado</Badge>}
            </div>
          </div>
          <SupportChat
            messages={ticket.messages.map((m) => ({ id: m.id, body: m.body, mine: m.fromStaff, author: m.fromStaff ? "Equipe" : ticket.user.name.split(" ")[0], at: at(m.createdAt) }))}
            action={replySupportAction.bind(null, ticket.id)}
            placeholder="Escreva a resposta..."
            empty="Sem mensagens."
            closed={ticket.status === "CLOSED" ? "Chamado finalizado. O aluno não pode mais enviar mensagens nele." : null}
          />
        </div>
      );
    }
    const tickets = await staffTickets();
    return (
      <div className="space-y-6">
        {header}
        {!tickets.length && <Card className="text-sm text-muted">Nenhum chamado ainda.</Card>}
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link href={`/admin?aba=suporte&chamado=${t.id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
                <Avatar id={t.user.avatar} name={t.user.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t.kind} · {t.user.name} <span className="text-sm font-normal text-muted">@{t.user.handle}</span></p>
                  <p className="truncate text-sm text-muted">{t.messages[0]?.fromStaff ? "Você: " : ""}{t.messages[0]?.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatDay(t.updatedAt, { day: "2-digit", month: "short" })}</span>
                {t._count.messages > 0 && <span className="rounded-full bg-danger px-2 text-xs font-bold text-white">{t._count.messages}</span>}
                <Badge tone={t.status === "OPEN" ? "success" : "neutral"}>{t.status === "OPEN" ? "Aberto" : "Finalizado"}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (tab === "site") {
    const rows = await db.siteSetting.findMany({ where: { key: { startsWith: "social." } } });
    const values = Object.fromEntries(rows.map((r) => [r.key.slice("social.".length), r.value]));
    return (
      <div className="space-y-6">
        {header}
        <Card className="space-y-4">
          <div>
            <CardTitle>Redes sociais</CardTitle>
            <p className="text-sm text-muted">Os links cadastrados aparecem como botões no rodapé da página inicial e das páginas públicas.</p>
          </div>
          <SiteForm values={values} />
        </Card>
      </div>
    );
  }

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
    const off = await disabledProviders();
    const byModel = await db.aiUsage.groupBy({ by: ["model"], where: { createdAt: { gte: dayStart } }, _count: true });
    const usedBy = (p: string) =>
      byModel.filter((m) => (p === "gemini" ? !m.model.includes(":") || m.model.startsWith("gemini") : m.model.startsWith(`${p}:`))).reduce((n, m) => n + m._count, 0);
    const providersCard = (
      <Card className="space-y-3">
        <CardTitle>IAs do sistema</CardTitle>
        <p className="text-sm text-muted">
          O Eduvia só usa IAs grátis. Se alguma passar a pedir pagamento, ela deixa de ser usada na hora (nunca gera cobrança) e você
          recebe um aviso. Desligada, a IA sai do cadastro e de todo o sistema; dá para ligar de novo quando quiser.
        </p>
        <ul className="divide-y divide-border">
          {ALL_PROVIDERS.map((p) => {
            const enabled = !off.includes(p);
            return (
              <li key={p} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-medium">{providerLabel(p)}</span>
                <span className="text-xs text-muted">{usedBy(p)} pedido(s) hoje</span>
                <Badge tone={enabled ? "success" : "neutral"}>{enabled ? "Ligada" : "Desligada"}</Badge>
                <form action={toggleProviderAction.bind(null, p, !enabled)}>
                  <Button size="sm" variant={enabled ? "ghost" : "outline"}>{enabled ? "Desligar" : "Ligar"}</Button>
                </form>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-border pt-3">
          <p className="mb-2 text-sm font-medium">Voz do robô (Piper, no servidor)</p>
          <VoiceTest />
        </div>
      </Card>
    );
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
        {providersCard}
        <p className="text-xs text-muted">Hoje. Cada aluno usa as próprias chaves das IAs, então a IA não custa nada para a plataforma. Serve para ver quem está perto dos limites.</p>
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
                  <span className="text-xs text-muted">{plan ? `${plan.plan.name} ${intervalInfo(plan.interval).label}` : "Grátis"}</span>
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
  const aiOff = await disabledProviders();
  const list = await db.user.findMany({
    where: { ...where, cpf: { not: null } },
    include: {
      subscriptions: {
        where: { status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: now } },
        include: { plan: true, payments: { where: { status: "PAID" }, orderBy: { paidAt: "desc" }, take: 1, select: { billingType: true } } },
        orderBy: { currentPeriodEnd: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const paidPlans = plans
    .filter((p) => p.slug !== "gratis")
    .map((p) => ({ slug: p.slug, name: p.name, prices: INTERVALS.flatMap((i) => (priceFor(p, i.key) > 0 ? [{ key: i.key, label: `${i.label} (${formatBRL(priceFor(p, i.key))})` }] : [])) }));

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
                    <>
                      <Badge tone="success">{sub.plan.name} {intervalInfo(sub.interval).adjective} até {formatDay(sub.currentPeriodEnd, { day: "2-digit", month: "short" })}</Badge>
                      {/* como foi o último pagamento: Pix pela SyncPay (sozinho) ou liberado aqui pelo admin */}
                      {sub.payments[0]?.billingType === "PIX" ? <Badge tone="primary">Pix automático</Badge> : <Badge>Pix próprio</Badge>}
                    </>
                  ) : (
                    <Badge tone="warning">Grátis</Badge>
                  )}
                  {ALL_PROVIDERS.every((p) => aiOff.includes(p) || hasKey(u, p)) ? <Badge tone="primary">IAs conectadas</Badge> : <Badge tone="danger">IAs incompletas</Badge>}
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
