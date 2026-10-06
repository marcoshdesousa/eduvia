import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, usage } from "@/lib/billing";
import { quoteForUser } from "@/lib/pix-billing";
import { formatLimit, intervalInfo, isUnlimited, planFeatures } from "@/lib/plans";
import { formatDay } from "@/lib/core/dates";
import { PixCheckout } from "@/components/pix-checkout";
import { syncpayConfigured } from "@/lib/syncpay";
import { ArrowRightLeft, Check } from "lucide-react";
import { Badge, Progress } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Assinatura" };

const longDate = (d: Date) => formatDay(d, { day: "2-digit", month: "long", year: "numeric" });

export default async function Page() {
  const user = await requireReadyUser();
  const [access, plans, used, payments] = await Promise.all([
    getAccess(user),
    listPlans(),
    usage(user),
    db.payment.findMany({ where: { subscription: { userId: user.id }, status: "PAID" }, include: { subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const paidPlans = plans.filter((p) => p.slug !== "gratis" && p.active && p.priceMonthCents > 0);
  const free = plans.find((p) => p.slug === "gratis");
  const l = access.limits;
  const meters = [
    { label: "Guias de estudo este mês", used: used.preparationsThisMonth, max: l.preparationsPerMonth },
    { label: "Sessões novas hoje", used: used.newSessionsToday, max: l.newSessionsPerDay },
    { label: "Simulados este mês", used: used.examsThisMonth, max: l.examsPerMonth },
    { label: "Redações corrigidas hoje", used: used.essaysToday, max: l.essaysPerDay },
    { label: "Mensagens ao Professor IA hoje", used: used.tutorToday, max: l.tutorMessagesPerDay },
    { label: "Testes rápidos hoje", used: used.gamesToday, max: l.gamesPerDay },
  ];
  const subscribed = access.reason === "subscription";
  const pixEnabled = syncpayConfigured();
  const quotes = new Map(await Promise.all(paidPlans.map(async (p) => [p.slug, await quoteForUser(user.id, p)] as const)));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Seu plano: {access.planName}</CardTitle>
          {subscribed ? (
            <Badge tone="success">Ativo até {formatDay(access.until, { day: "2-digit", month: "short" })}</Badge>
          ) : access.reason === "dev" ? (
            <Badge>Liberado</Badge>
          ) : (
            <Badge tone="warning">{access.reason === "trial" ? `Teste até ${formatDay(access.until, { day: "2-digit", month: "short" })}` : access.ended ? "Vencido" : "Teste encerrado"}</Badge>
          )}
        </div>
        <p className="text-sm text-muted">
          {access.reason === "subscription"
            ? `Plano ${intervalInfo(access.interval).adjective} (${intervalInfo(access.interval).label}) válido até ${longDate(access.until)}. ${pixEnabled ? "Para continuar, pague o próximo mês com Pix aqui embaixo (os 30 dias novos somam ao final do plano)." : "Para continuar, renove pelo Pix aqui embaixo."}`
            : access.reason === "dev"
              ? "Tudo liberado (conta de administrador ou cobrança desativada)."
              : access.reason === "trial"
                ? `Você está no teste grátis de 3 dias (até ${longDate(access.until)}), com arquivos à vontade e 1 redação, 1 simulado e 1 teste rápido para experimentar. Escolha um plano abaixo para continuar depois.`
                : access.ended
                  ? `Seu plano ${access.ended.planName} venceu em ${longDate(access.ended.at)}. Seus estudos continuam guardados: pague o próximo mês abaixo e tudo volta na hora.`
                  : "Seu teste grátis acabou. Seus estudos continuam guardados: escolha um plano abaixo para continuar."}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {meters.map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted">{m.label}</span>
                <span className="font-medium">{m.used} / {formatLimit(m.max)}</span>
              </div>
              <Progress value={isUnlimited(m.max) ? 0 : m.max === 0 ? 1 : m.used / m.max} tone={!isUnlimited(m.max) && m.used >= m.max ? "danger" : "primary"} />
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold">Planos</h2>
          <p className="text-sm text-muted">Planos mensais. Todos com arquivos, páginas e tipos de arquivo sem limite. O que muda é a quantidade de guias de estudo, aulas, redações, simulados e testes rápidos.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paidPlans.map((p) => {
            const current = (subscribed && access.planSlug === p.slug) || (access.reason === "expired" && access.ended?.planName === p.name);
            const best = p.slug === "ilimitado";
            const q = quotes.get(p.slug)!;
            return (
              <Card key={p.slug} className={`flex flex-col gap-3 ${current ? "border-primary bg-primary/5" : best ? "border-primary" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{p.name}</CardTitle>
                  {current ? <Badge tone="success">Seu plano</Badge> : best ? <Badge tone="primary">Tudo ilimitado</Badge> : null}
                </div>
                <div>
                  <span className="text-3xl font-bold">{formatBRL(p.priceMonthCents)}</span>
                  <span className="text-sm text-muted"> / 30 dias</span>
                </div>
                <ul className="flex-1 space-y-1.5 text-sm">
                  {planFeatures(p.limits).map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
                  ))}
                </ul>
                {q.change && (
                  <div className="space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm" aria-label={`Troca para o plano ${p.name}`}>
                    <p className="flex items-center gap-1.5 font-semibold"><ArrowRightLeft size={15} className="text-primary" /> Trocar do {q.change.fromName} para o {p.name}</p>
                    <p className="flex justify-between text-muted"><span>Plano {p.name} (30 dias)</span><span>{formatBRL(q.priceCents)}</span></p>
                    <p className="flex justify-between text-success">
                      <span>Desconto: {q.change.unusedDays} {q.change.unusedDays === 1 ? "dia não usado" : "dias não usados"} do {q.change.fromName}</span>
                      <span>− {formatBRL(q.creditCents)}</span>
                    </p>
                    <p className="flex justify-between border-t border-border pt-1 font-semibold"><span>Você paga</span><span>{formatBRL(q.payCents)}</span></p>
                    <p className="text-xs text-muted">
                      O {p.name} vale {q.days} dias a partir do pagamento{q.days > 30 ? " (o crédito que sobrou virou dias a mais)" : ""}. O {q.change.fromName} acaba na hora da troca.
                    </p>
                  </div>
                )}
                {pixEnabled ? (
                  <PixCheckout planSlug={p.slug} label={`${current ? "Renovar" : q.change ? "Trocar para o" : "Assinar"} ${p.name} com Pix`} />
                ) : (
                  <p className="rounded-lg border border-border px-3 py-2 text-center text-sm text-muted">Pagamento por Pix indisponível no momento. Tente de novo em alguns minutos.</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {free && (
        <Card className="text-sm">
          <CardTitle>Teste grátis (3 dias)</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Escolha o plano e toque em &quot;Pagar com Pix&quot;. Pague pelo app do seu banco (QR Code ou Pix Copia e Cola): o plano libera sozinho assim que o Pix cair.</li>
          <li>Cada pagamento vale 30 dias. Renovou antes de vencer? Os 30 dias novos somam ao final. Não há cobrança automática.</li>
          <li>Quer trocar de plano? O plano novo vale 30 dias a partir do pagamento e você ganha desconto pelos dias que não usou do plano atual.</li>
        </ol>
      </Card>

      {payments.length > 0 && (
        <Card>
          <CardTitle>Histórico</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="w-28 text-muted">{formatDay(p.dueDate, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span className="flex-1">Plano {p.subscription.plan.name} ({intervalInfo(p.subscription.interval).label})</span>
                <span className="font-medium">{formatBRL(p.valueCents)}</span>
                <Badge tone="success">Pago</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
