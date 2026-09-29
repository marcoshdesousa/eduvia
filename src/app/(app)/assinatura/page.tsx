import Link from "next/link";
import { Check } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { activeSubscription, billingEnforced, formatBRL, hasAccess, PLANS } from "@/lib/billing";
import { isSimulatedPayments } from "@/lib/payments";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CheckoutForm } from "./checkout-form";
import { CancelButton } from "./cancel-button";

export const metadata = { title: "Assinatura" };

const INCLUDED = ["Preparações ilimitadas", "PDFs ilimitados (inclusive escaneados)", "Plano de estudo inteligente", "Sessões com texto e questões", "Revisão espaçada e banco de erros"];
const STATUS_LABEL = { PENDING: "Pendente", PAID: "Pago", OVERDUE: "Vencido", REFUNDED: "Estornado", CANCELED: "Cancelado" } as const;
const STATUS_TONE = { PENDING: "warning", PAID: "success", OVERDUE: "danger", REFUNDED: "neutral", CANCELED: "neutral" } as const;
const longDate = (d: Date) => formatDay(d, { day: "2-digit", month: "long", year: "numeric" });

export default async function Page() {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const [sub, access, payments] = await Promise.all([
    activeSubscription(user.id),
    hasAccess(user),
    db.payment.findMany({ where: { subscription: { userId: user.id } }, include: { subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const renewing = sub && sub.status !== "CANCELED";
  const openPayment = payments.find((p) => (p.status === "PENDING" || p.status === "OVERDUE") && p.subscription.status !== "CANCELED");
  const trialActive = !!user.trialEndsAt && user.trialEndsAt > new Date();
  const isMinor = user.guardianConsentStatus === "GRANTED";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Seu acesso</CardTitle>
          {renewing ? <Badge tone="success">Assinatura ativa</Badge> : sub ? <Badge tone="warning">Cancelada</Badge> : trialActive ? <Badge tone="primary">Teste grátis</Badge> : !access ? <Badge tone="danger">Sem acesso</Badge> : <Badge>Liberado</Badge>}
        </div>
        <p className="text-sm text-muted">
          {renewing
            ? `Plano ${sub.plan.name} (${formatBRL(sub.plan.priceCents)}/${sub.plan.interval === "WEEK" ? "semana" : "mês"}) via ${sub.billingType === "PIX" ? "Pix" : "cartão"}. Período pago até ${longDate(sub.currentPeriodEnd)}; a próxima cobrança é gerada automaticamente.`
            : sub
              ? `Renovação cancelada. Você tem acesso até ${longDate(sub.currentPeriodEnd)}.`
              : trialActive
                ? `Seu teste grátis vai até ${longDate(user.trialEndsAt!)}. Assine para continuar depois disso — seu progresso fica salvo.`
                : !access
                  ? "Seu teste grátis terminou. Assine para voltar a estudar — seu progresso está salvo."
                  : "Acesso liberado."}
        </p>
        {sub?.status === "PAST_DUE" && <p className="text-sm text-danger">Há uma cobrança vencida. Pague para não perder o acesso.</p>}
        {openPayment && (
          <Link href={`/assinatura/pagamento/${openPayment.id}`} className={buttonClass("primary")}>
            Pagar {formatBRL(openPayment.valueCents)} ({openPayment.billingType === "PIX" ? "Pix" : "cartão"})
          </Link>
        )}
        {renewing && <CancelButton until={longDate(sub.currentPeriodEnd)} />}
      </Card>

      {!renewing && (
        <Card className="space-y-4">
          <CardTitle>{sub ? "Reativar ou trocar de plano" : "Escolha seu plano"}</CardTitle>
          <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
            {INCLUDED.map((i) => <li key={i} className="flex items-center gap-2"><Check size={16} className="text-success" />{i}</li>)}
          </ul>
          <CheckoutForm
            plans={PLANS.map((p) => ({ slug: p.slug, name: p.name, price: formatBRL(p.priceCents), period: p.interval === "WEEK" ? "semana" : "mês", note: p.interval === "MONTH" ? "Mais econômico" : undefined }))}
            defaultName={user.name}
            isMinor={isMinor}
            startsLater={sub ? longDate(sub.currentPeriodEnd) : null}
          />
        </Card>
      )}

      {payments.length > 0 && (
        <Card>
          <CardTitle>Histórico de pagamentos</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="w-28 text-muted">{formatDay(p.dueDate, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span className="flex-1">{p.subscription.plan.name} · {p.billingType === "PIX" ? "Pix" : "Cartão"}</span>
                <span className="font-medium">{formatBRL(p.valueCents)}</span>
                <Badge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-xs text-muted">
        {isSimulatedPayments() && "Pagamentos em modo simulado (sem ASAAS_API_KEY). "}
        {!billingEnforced() && "Ambiente de desenvolvimento: a cobrança não bloqueia o acesso (BILLING_ENFORCED=false)."}
      </p>
    </div>
  );
}
