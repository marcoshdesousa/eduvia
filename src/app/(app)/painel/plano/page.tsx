import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { PageTitle, RecommendedBadge } from "@/components/bits";
import { PixBox } from "@/components/pix-box";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { Plan } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { MAX_PLACES, PACK_CENTS, PACK_PLACES, PERIOD_DAYS, PLANS, formatBRL, referralPct, upgradeCents } from "@/lib/domain";
import { requireProvider } from "@/lib/session";
import { RENEW_WINDOW_DAYS, nextCharge, referralCount, subscriptionActive } from "@/lib/subscription";
import { BackLink } from "../back-link";
import { setNextPlanAction, subscriptionPixAction, upgradePixAction } from "../actions";

export const metadata: Metadata = { title: "Plano" };

const FEATURES: Record<Plan, string[]> = {
  FULL: ["⚡ Recebe chamados do Contrate rápido", "Aparece primeiro nas buscas", "Selo ★ Recomendado", "3 endereços de atendimento", `Pacotes de +${PACK_PLACES} endereços (até ${MAX_PLACES})`, "Chat, portfólio e financeiro"],
  BASIC: ["1 endereço de atendimento", "Aparece depois do Completo", "Pedidos com data marcada (sem Contrate rápido)", "Chat, portfólio e financeiro"],
};
const KIND = { SUBSCRIPTION: "Mensalidade", UPGRADE: "Troca para o Completo", UNLOCK: "Desbloqueio" } as const;
const STATUS = { PENDING: "Aguardando", PAID: "Pago", FAILED: "Não pago", REFUNDED: "Devolvido" } as Record<string, string>;

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ bloqueado?: string }> }) {
  const user = await requireProvider({ allowUnpaid: true });
  const { bloqueado } = await searchParams;
  const referrals = await referralCount(user.id, user.provider.referralsFrom);
  const pct = referralPct(referrals);
  const [sub, payments] = await Promise.all([
    db.subscription.findUnique({ where: { proId: user.provider.id } }),
    db.payment.findMany({ where: { userId: user.id, status: { not: "PENDING" } }, orderBy: { createdAt: "desc" }, take: 12 }),
  ]);
  const active = subscriptionActive(sub);
  const end = sub?.currentPeriodEnd ?? null;
  const canRenew = !sub || !active || sub.trial || (end && end.getTime() - Date.now() <= RENEW_WINDOW_DAYS * 86_400_000);
  const next = sub ? nextCharge(sub) : null;
  // no Completo em dia não dá para descer para o Básico: só quando o Completo terminar
  const fullLocked = !!sub && active && !sub.trial && sub.plan === "FULL";

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Seu plano" subtitle="Para o cliente é grátis. Você paga só a mensalidade, sem comissão: o valor do serviço é todo seu." />
      {!active && (
        <Card className="border-danger/50 bg-danger/5">
          <p className="font-semibold">🔒 {sub?.trial || bloqueado ? "Seu teste grátis acabou" : "Seu plano venceu"}</p>
          <p className="text-sm">A área de trabalho fica bloqueada (perfis, agenda, mensagens, financeiro e histórico) até você pagar. Sua conta de cliente continua liberada.</p>
        </Card>
      )}
      {pct > 0 && (
        <Card className="border-accent/50 bg-accent-soft text-sm">🎁 Você tem <strong>{pct.toString().replace(".", ",")}% de desconto</strong> na próxima mensalidade ({referrals} pessoa(s) entraram pelo seu link).</Card>
      )}

      {sub && (
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>{PLANS[sub.plan].name}{sub.trial && " — teste grátis"}</CardTitle>
            <Badge tone={active ? "success" : "danger"}>{active ? "Em dia" : "Vencido"}</Badge>
          </div>
          {end && <p className="text-sm text-muted">{active ? "Vale até" : "Venceu em"} {end.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo" })}</p>}
          {next && !sub.trial && (
            <div className="mt-2 rounded-xl bg-surface-2 p-3 text-sm">
              <p className="font-semibold">Próxima mensalidade: {formatBRL(next.cents)}</p>
              <p className="text-muted">Plano {PLANS[next.plan].name} {formatBRL(PLANS[next.plan].priceCents)}{next.packs > 0 && ` + ${next.packs} pacote(s) de endereços (${formatBRL(next.packs * PACK_CENTS)})`}</p>
            </div>
          )}
        </Card>
      )}

      {sub?.plan === "BASIC" && active && !sub.trial && (
        <Card className="space-y-2 border-primary/40">
          <CardTitle>Subir para o Completo agora</CardTitle>
          <p className="text-sm text-muted">Paga o Completo inteiro e começa um mês novo de Completo agora: <strong className="text-foreground">{formatBRL(upgradeCents())}</strong>.</p>
          <PixBox start={upgradePixAction} label="Pagar diferença com Pix" paidText="Pronto! Você está no plano Completo." />
        </Card>
      )}

      {(["FULL", "BASIC"] as Plan[]).map((plan) => {
        const p = PLANS[plan];
        return (
          <Card key={plan} className={plan === "FULL" ? "space-y-3 border-2 border-primary" : "space-y-3"}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2"><CardTitle>{p.name}</CardTitle>{p.recommended && <RecommendedBadge />}</div>
                <p className="mt-1 text-3xl font-extrabold">{formatBRL(p.priceCents)}<span className="text-sm font-normal text-muted">/mês</span></p>
                <p className="text-xs text-muted">{formatBRL(p.platformCents)} da plataforma + {formatBRL(p.feesCents)} de impostos e taxas</p>
              </div>
              {sub?.plan === plan && active && <Badge tone="success">Seu plano</Badge>}
            </div>
            <ul className="space-y-1 text-sm">
              {FEATURES[plan].map((f) => <li key={f} className="flex items-center gap-2"><Check size={16} className="text-primary" /> {f}</li>)}
            </ul>
            {plan === "BASIC" && fullLocked ? (
              <p className="text-xs text-muted">Você está no Completo. O Básico fica disponível quando o Completo terminar ({end!.toLocaleDateString("pt-BR")}).</p>
            ) : canRenew ? (
              <PixBox start={subscriptionPixAction.bind(null, plan)} label={`${active && !sub?.trial ? "Renovar" : "Assinar"} ${p.name} com Pix${pct > 0 ? ` (−${pct.toString().replace(".", ",")}%)` : ""}`} variant={plan === "FULL" ? "primary" : "secondary"} paidText={`Pagamento confirmado! Plano ${p.name} ativo por ${PERIOD_DAYS} dias.`} />
            ) : sub && next?.plan !== plan ? (
              <ActionButton action={setNextPlanAction.bind(null, plan)} variant="outline" className="w-full">Mudar para o {p.name} na próxima mensalidade</ActionButton>
            ) : (
              <p className="text-xs text-muted">A renovação abre {RENEW_WINDOW_DAYS} dias antes do vencimento.</p>
            )}
          </Card>
        );
      })}
      {sub?.trial && <p className="text-center text-xs text-muted">Pagando agora, o mês começa hoje e o resto do teste grátis termina.</p>}

      {payments.length > 0 && (
        <Card>
          <CardTitle>Pagamentos</CardTitle>
          <ul className="mt-2 divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span>{KIND[p.kind]}<span className="block text-xs text-muted">{p.createdAt.toLocaleDateString("pt-BR")}{p.provider === "MANUAL" && " · liberado pelo suporte"}</span></span>
                <span className="text-right">{formatBRL(p.amountCents)}<span className="block text-xs text-muted">{STATUS[p.status] ?? p.status}</span></span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
