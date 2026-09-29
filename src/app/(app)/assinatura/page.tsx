import { Check, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, LIMITED_SUMMARY, PLANS, subscribeMessage, whatsappLink } from "@/lib/billing";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Assinatura" };

const INCLUDED = ["Preparações ilimitadas", "PDFs ilimitados (inclusive escaneados)", "Sessões de estudo sem limite por dia", "Revisão espaçada e banco de erros", "Todas as novidades das próximas fases"];
const longDate = (d: Date) => formatDay(d, { day: "2-digit", month: "long", year: "numeric" });

export default async function Page() {
  const user = await requireReadyUser();
  const [access, payments] = await Promise.all([
    getAccess(user),
    db.payment.findMany({ where: { subscription: { userId: user.id }, status: "PAID" }, include: { subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>

      <Card className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Seu acesso</CardTitle>
          {access.reason === "subscription" ? <Badge tone="success">Plano {access.planName}</Badge> : access.reason === "trial" ? <Badge tone="primary">Modo teste</Badge> : access.reason === "dev" ? <Badge>Liberado</Badge> : <Badge tone="danger">Modo limitado</Badge>}
        </div>
        <p className="text-sm text-muted">
          {access.reason === "subscription"
            ? `Seu plano vale até ${longDate(access.until)}. Para continuar depois disso, é só renovar pelo WhatsApp.`
            : access.reason === "trial"
              ? `Seu teste grátis vai até ${longDate(access.until)}. Depois disso a conta fica no modo limitado (${LIMITED_SUMMARY}).`
              : access.reason === "dev"
                ? "Cobrança desativada neste ambiente (BILLING_ENFORCED=false)."
                : `Seu teste grátis acabou e a conta está no modo limitado: ${LIMITED_SUMMARY}. Seu progresso está salvo — assine para liberar tudo.`}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => (
          <Card key={p.slug} className={cn("flex flex-col", p.interval === "MONTH" && "border-primary")}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              {p.interval === "MONTH" && <Badge tone="primary">Mais econômico</Badge>}
            </div>
            <div className="mt-2 text-3xl font-bold">
              {formatBRL(p.priceCents)}
              <span className="text-base font-normal text-muted">/{p.interval === "WEEK" ? "semana" : "mês"}</span>
            </div>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {INCLUDED.map((i) => <li key={i} className="flex items-center gap-2"><Check size={16} className="text-success" />{i}</li>)}
            </ul>
            <a href={whatsappLink(subscribeMessage(p, user))} target="_blank" rel="noreferrer" className={buttonClass(p.interval === "MONTH" ? "primary" : "outline", "md", "mt-5 w-full")}>
              <MessageCircle size={16} /> {access.reason === "subscription" ? "Renovar" : "Assinar"} pelo WhatsApp
            </a>
          </Card>
        ))}
      </div>

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Toque em &quot;Assinar pelo WhatsApp&quot;: a mensagem com o plano e o seu @ já vai pronta.</li>
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
                <span className="flex-1">Plano {p.subscription.plan.name}</span>
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
