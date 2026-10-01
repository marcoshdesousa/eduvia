import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, subscribeMessage, usage, whatsappLink } from "@/lib/billing";
import { formatLimit, isUnlimited, planFeatures } from "@/lib/plans";
import { formatDay } from "@/lib/core/dates";
import { Check, MessageCircle } from "lucide-react";
import { Badge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
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
            <Badge tone="warning">Grátis (teste)</Badge>
          )}
        </div>
        <p className="text-sm text-muted">
          {access.reason === "subscription"
            ? `Plano ${access.interval === "WEEK" ? "semanal (7 dias)" : "mensal (30 dias)"} válido até ${longDate(access.until)}. Para continuar depois disso, é só renovar pelo WhatsApp.`
            : access.reason === "dev"
              ? "Tudo liberado (conta de administrador ou cobrança desativada)."
              : "Você está no plano Grátis, para testar com limites bem pequenos. Escolha um plano abaixo para liberar tudo."}
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
          <p className="text-sm text-muted">Todos com PDFs e páginas sem limite, testes rápidos à vontade, grupos e torneios. O que muda é quantos guias de estudo você cria por mês (apagar um guia não devolve a vaga).</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paidPlans.map((p) => {
            const current = subscribed && access.planSlug === p.slug;
            const best = p.slug === "ilimitado";
            const opts = [
              ...(p.priceWeekCents > 0 ? [{ key: "WEEK" as const, label: "semanal", price: p.priceWeekCents, days: 7 }] : []),
              { key: "MONTH" as const, label: "mensal", price: p.priceMonthCents, days: 30 },
            ];
            return (
              <Card key={p.slug} className={`flex flex-col gap-3 ${current ? "border-primary bg-primary/5" : best ? "border-primary" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{p.name}</CardTitle>
                  {current ? <Badge tone="success">Seu plano</Badge> : best ? <Badge tone="primary">Tudo ilimitado</Badge> : null}
                </div>
                <div>
                  <span className="text-3xl font-bold">{formatBRL(p.priceMonthCents)}</span>
                  <span className="text-sm text-muted"> / 30 dias</span>
                  {p.priceWeekCents > 0 && <div className="text-sm text-muted">ou {formatBRL(p.priceWeekCents)} por 7 dias</div>}
                </div>
                <ul className="flex-1 space-y-1.5 text-sm">
                  {planFeatures(p.limits).map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
                  ))}
                </ul>
                <div className="grid gap-2">
                  {opts.map((o) => (
                    <a
                      key={o.key}
                      href={whatsappLink(subscribeMessage(p, o.key, user))}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${current ? "Renovar" : "Assinar"} ${p.name} ${o.label} pelo WhatsApp`}
                      className={buttonClass(o.key === "MONTH" ? "primary" : "outline", "md", "w-full")}
                    >
                      <MessageCircle size={16} /> {current ? "Renovar" : "Assinar"} {o.label} ({formatBRL(o.price)})
                    </a>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {free && (
        <Card className="text-sm">
          <CardTitle>Plano Grátis (para testar)</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Escolha o plano e toque em &quot;Assinar&quot;: a mensagem com o plano e o seu @ já vai pronta no WhatsApp.</li>
          <li>Combine o pagamento por lá (Pix).</li>
          <li>Assim que o pagamento for confirmado, liberamos o plano na sua conta. Não há cobrança automática: quando vencer, é só renovar.</li>
        </ol>
      </Card>

      {payments.length > 0 && (
        <Card>
          <CardTitle>Histórico</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="w-28 text-muted">{formatDay(p.dueDate, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span className="flex-1">Plano {p.subscription.plan.name} ({p.subscription.interval === "WEEK" ? "7 dias" : "30 dias"})</span>
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
