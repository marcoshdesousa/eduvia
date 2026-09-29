import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, subscribeMessage, usage, whatsappLink } from "@/lib/billing";
import { formatLimit, isUnlimited, planFeatures } from "@/lib/plans";
import { formatDay } from "@/lib/core/dates";
import { Badge, Progress } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { PlanCards } from "./plan-cards";

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
  const paid = plans.filter((p) => p.slug !== "gratis" && p.active);
  const free = plans.find((p) => p.slug === "gratis");
  const l = access.limits;
  const meters = [
    { label: "Preparações ativas", used: used.activePreparations, max: l.activePreparations },
    { label: "PDFs/arquivos guardados", used: used.materials, max: l.materials },
    { label: "Páginas enviadas este mês", used: used.pagesThisMonth, max: l.pagesPerMonth },
    { label: "Sessões novas hoje", used: used.newSessionsToday, max: l.newSessionsPerDay },
    { label: "Jogos hoje", used: used.gamesToday, max: l.gamesPerDay },
    { label: "Simulados este mês", used: used.examsThisMonth, max: l.examsPerMonth },
    { label: "Mensagens ao Professor IA este mês", used: used.tutorThisMonth, max: l.tutorMessagesPerMonth },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Seu plano: {access.planName}</CardTitle>
          {access.reason === "subscription" ? (
            <Badge tone="success">Ativo até {formatDay(access.until, { day: "2-digit", month: "short" })}</Badge>
          ) : access.reason === "trial" ? (
            <Badge tone="primary">Teste grátis</Badge>
          ) : access.reason === "dev" ? (
            <Badge>Liberado</Badge>
          ) : (
            <Badge tone="danger">Grátis</Badge>
          )}
        </div>
        <p className="text-sm text-muted">
          {access.reason === "subscription"
            ? `Plano ${access.interval === "WEEK" ? "semanal" : "mensal"} válido até ${longDate(access.until)}. Para continuar depois disso, é só renovar pelo WhatsApp.`
            : access.reason === "trial"
              ? `Seu teste grátis vai até ${longDate(access.until)}, com os recursos do plano ${access.planName}. Depois disso a conta passa para o plano Grátis.`
              : access.reason === "dev"
                ? "Cobrança desativada neste ambiente (BILLING_ENFORCED=false)."
                : "Seu teste grátis acabou. No plano Grátis você continua com as revisões, o banco de erros e 1 jogo por dia. Seu progresso está salvo — assine para liberar tudo."}
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

      <PlanCards
        plans={paid.map((p) => ({
          slug: p.slug,
          name: p.name,
          week: formatBRL(p.priceWeekCents),
          month: formatBRL(p.priceMonthCents),
          features: planFeatures(p.limits),
          linkWeek: whatsappLink(subscribeMessage(p, "WEEK", user)),
          linkMonth: whatsappLink(subscribeMessage(p, "MONTH", user)),
          current: access.reason === "subscription" && access.planSlug === p.slug,
          highlight: p.slug === "completo",
        }))}
      />

      {free && (
        <Card className="text-sm">
          <CardTitle>Plano Grátis (depois do teste)</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Escolha semanal ou mensal e toque em &quot;Assinar pelo WhatsApp&quot;: a mensagem com o plano e o seu @ já vai pronta.</li>
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
                <span className="flex-1">Plano {p.subscription.plan.name} ({p.subscription.interval === "WEEK" ? "semanal" : "mensal"})</span>
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
