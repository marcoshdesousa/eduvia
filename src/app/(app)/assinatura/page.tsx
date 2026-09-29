import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, subscribeMessage, usage, whatsappLink } from "@/lib/billing";
import { formatLimit, isUnlimited, PAID_PLAN, planFeatures } from "@/lib/plans";
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
  const paid = plans.find((p) => p.slug === PAID_PLAN)!;
  const free = plans.find((p) => p.slug === "gratis");
  const l = access.limits;
  const meters = [
    { label: "Preparações ativas", used: used.activePreparations, max: l.activePreparations },
    { label: "PDFs/arquivos guardados", used: used.materials, max: l.materials },
    { label: "Páginas enviadas hoje", used: used.pagesToday, max: l.pagesPerDay },
    { label: "Sessões novas hoje", used: used.newSessionsToday, max: l.newSessionsPerDay },
    { label: "Jogos hoje", used: used.gamesToday, max: l.gamesPerDay },
    { label: "Simulados hoje", used: used.examsToday, max: l.examsPerDay },
    { label: "Redações corrigidas hoje", used: used.essaysToday, max: l.essaysPerDay },
    { label: "Mensagens ao Professor IA hoje", used: used.tutorToday, max: l.tutorMessagesPerDay },
  ];
  const subscribed = access.reason === "subscription";
  const options = [
    { key: "WEEK" as const, label: "Semanal", days: 7, price: formatBRL(paid.priceWeekCents), link: whatsappLink(subscribeMessage(paid, "WEEK", user)) },
    { key: "MONTH" as const, label: "Mensal", days: 30, price: formatBRL(paid.priceMonthCents), link: whatsappLink(subscribeMessage(paid, "MONTH", user)), best: true },
  ];

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
              ? "Cobrança desativada neste ambiente (BILLING_ENFORCED=false)."
              : "Você está no plano Grátis, para testar com limites bem pequenos. Assine o Eduvia para usar sua IA de verdade: os limites de cada dia ficam bem maiores."}
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

      <Card className="space-y-4 border-primary">
        <div>
          <CardTitle>Plano {paid.name}: tudo liberado</CardTitle>
          <p className="mt-1 text-sm text-muted">Um plano só, com todos os recursos. Os limites por dia existem para a sua IA do Gemini não estourar.</p>
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {planFeatures(paid.limits).map((f) => (
            <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
          ))}
        </ul>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((o) => (
            <div key={o.key} className={`flex flex-col rounded-xl border p-4 ${o.best ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{o.label}</span>
                {o.best && <Badge tone="primary">Mais econômico</Badge>}
              </div>
              <div className="mt-1 text-3xl font-bold">{o.price}</div>
              <span className="text-sm text-muted">por {o.days} dias</span>
              <a href={o.link} target="_blank" rel="noreferrer" className={buttonClass(o.best ? "primary" : "outline", "md", "mt-4 w-full")}>
                <MessageCircle size={16} /> {subscribed ? "Renovar" : "Assinar"} {o.label.toLowerCase()} pelo WhatsApp
              </a>
            </div>
          ))}
        </div>
      </Card>

      {free && (
        <Card className="text-sm">
          <CardTitle>Plano Grátis (para testar)</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Escolha semanal (7 dias) ou mensal (30 dias) e toque em &quot;Assinar pelo WhatsApp&quot;: a mensagem com o plano e o seu @ já vai pronta.</li>
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
