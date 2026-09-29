import { Check } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { activeSubscription, billingEnforced, formatBRL, hasAccess, PLANS } from "@/lib/billing";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Assinatura" };

const INCLUDED = ["Preparações ilimitadas", "PDFs ilimitados (inclusive escaneados)", "Plano de estudo inteligente", "Sessões com texto e questões", "Revisão espaçada e banco de erros"];

export default async function Page() {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const sub = await activeSubscription(user.id);
  const access = await hasAccess(user);
  const trialActive = !!user.trialEndsAt && user.trialEndsAt > new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assinatura</h1>
        <p className="text-sm text-muted">
          {sub
            ? `Plano ${sub.plan.name} ativo até ${formatDay(sub.currentPeriodEnd, { day: "2-digit", month: "long" })}.`
            : trialActive
              ? `Teste grátis até ${formatDay(user.trialEndsAt!, { day: "2-digit", month: "long" })}.`
              : !access
                ? "Seu teste grátis terminou. Assine para continuar estudando — seu progresso está salvo."
                : "Acesso liberado."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => (
          <Card key={p.slug} className={p.slug === "mensal" ? "border-primary" : ""}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              {p.slug === "mensal" && <Badge tone="primary">Mais econômico</Badge>}
            </div>
            <div className="mt-2 text-3xl font-bold">
              {formatBRL(p.priceCents)}
              <span className="text-base font-normal text-muted">/{p.interval === "WEEK" ? "semana" : "mês"}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-center gap-2"><Check size={16} className="text-success" />{i}</li>
              ))}
            </ul>
            <Button className="mt-5 w-full" disabled title="Pagamento com Pix e cartão chega na Fase 3">
              {sub?.planSlug === p.slug ? "Plano atual" : "Assinar (em breve)"}
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted">
        Pix e cartão, renovação automática e cancelamento a qualquer momento.{" "}
        {!billingEnforced() && "Ambiente de desenvolvimento: a cobrança não bloqueia o acesso."}
      </p>
    </div>
  );
}
