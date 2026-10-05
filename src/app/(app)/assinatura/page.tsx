import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, subscribeMessage, usage, whatsappLink } from "@/lib/billing";
import { formatLimit, INTERVALS, intervalInfo, isUnlimited, planFeatures, priceFor } from "@/lib/plans";
import { formatDay } from "@/lib/core/dates";
import { PixCheckout } from "@/components/pix-checkout";
import { syncpayConfigured } from "@/lib/syncpay";
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
  const pixEnabled = syncpayConfigured();
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
            ? `Plano ${intervalInfo(access.interval).adjective} (${intervalInfo(access.interval).label}) válido até ${longDate(access.until)}. ${pixEnabled ? "Para continuar, pague o próximo mês com Pix aqui embaixo (os 30 dias novos somam ao final do plano)." : "Para continuar depois disso, é só renovar pelo WhatsApp."}`
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
            const opts = INTERVALS.filter((i) => priceFor(p, i.key) > 0).map((i) => ({ key: i.key, label: i.adjective, days: i.days, price: priceFor(p, i.key) }));
            return (
              <Card key={p.slug} className={`flex flex-col gap-3 ${current ? "border-primary bg-primary/5" : best ? "border-primary" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{p.name}</CardTitle>
                  {current ? <Badge tone="success">Seu plano</Badge> : best ? <Badge tone="primary">Tudo ilimitado</Badge> : null}
                </div>
                <div>
                  <span className="text-3xl font-bold">{formatBRL(p.priceMonthCents)}</span>
                  <span className="text-sm text-muted"> / 30 dias</span>
                  <div className="text-sm text-muted">
                    {opts.filter((o) => o.key !== "MONTH").map((o) => `${formatBRL(o.price)} por ${o.days} dias`).join(" · ")}
                  </div>
                </div>
                <ul className="flex-1 space-y-1.5 text-sm">
                  {planFeatures(p.limits).map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
                  ))}
                </ul>
                <div className="grid gap-2">
                  {pixEnabled && <PixCheckout planSlug={p.slug} label={`${current ? "Renovar" : "Assinar"} ${p.name} com Pix`} />}
                  {opts.map((o) => (
                    <a
                      key={o.key}
                      href={whatsappLink(subscribeMessage(p, o.key, user))}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${current ? "Renovar" : "Assinar"} ${p.name} ${o.label} pelo WhatsApp`}
                      className={buttonClass(o.key === "MONTH" && !pixEnabled ? "primary" : "outline", "md", "w-full")}
                    >
                      <MessageCircle size={16} /> {pixEnabled ? "Ou combinar pelo WhatsApp" : `${o.days} dias por ${formatBRL(o.price)}`}
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
          <CardTitle>Teste grátis (3 dias)</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>{pixEnabled ? "Escolha o plano mensal e toque em \"Pagar com Pix\": o plano libera sozinho assim que o Pix cair." : "Escolha o plano mensal: a mensagem com o plano e o seu @ já vai pronta no WhatsApp."}</li>
          {pixEnabled ? (
            <li>Pague pelo app do seu banco (QR Code ou Pix Copia e Cola). Não há cobrança automática: quando vencer, é só pagar o próximo mês.</li>
          ) : (
            <>
              <li>Combine o pagamento por lá (Pix).</li>
              <li>Assim que o pagamento for confirmado, liberamos o plano na sua conta. Não há cobrança automática: quando vencer, é só renovar.</li>
            </>
          )}
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
