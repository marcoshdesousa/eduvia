// Troca de plano: só dá para subir de plano (paga o preço cheio do novo, sem desconto pelos dias que sobraram).
import { planRank } from "@/lib/plans";

const DAY_MS = 86_400_000;

export type PlanQuote = {
  priceCents: number;
  /** valor do Pix (sempre o preço cheio do mês: não há desconto na troca) */
  payCents: number;
  /** dias que o pagamento libera */
  days: number;
  /** subindo de plano: de qual plano (o anterior acaba na hora) */
  change: { fromName: string } | null;
};

/** Quanto custa assinar o plano agora: o preço do mês, 30 dias (na renovação, somam ao final do plano atual). */
export function quotePlan(
  plan: { slug: string; name: string; priceCents: number },
  current: { planSlug: string; planName: string; currentPeriodEnd: Date } | null,
  now = new Date(),
): PlanQuote {
  const upgrade = !!current && current.currentPeriodEnd > now && planRank(plan.slug) > planRank(current.planSlug);
  return { priceCents: plan.priceCents, payCents: plan.priceCents, days: 30, change: upgrade ? { fromName: current!.planName } : null };
}

export type PlanOption =
  | { kind: "buy" } // sem plano ativo: compra normal
  | { kind: "upgrade" } // plano maior que o atual: paga o novo e ele vale a partir de agora
  | { kind: "renew" } // o próprio plano (ou o do mesmo nível), nos dias antes de vencer
  | { kind: "current"; until: Date } // o próprio plano, longe de vencer: nada a pagar
  | { kind: "lower"; availableAt: Date }; // plano menor (ou do mesmo nível): só mais perto do fim do atual

/**
 * O que o aluno pode fazer com cada plano: com um plano ativo, só dá para subir de plano ou renovar perto de vencer
 * (o próprio plano ou outro do mesmo nível, como Completo ↔ Indicação). Plano menor fica indisponível até o atual acabar.
 */
export function planOption(
  plan: { slug: string },
  current: { planSlug: string; currentPeriodEnd: Date } | null,
  renewOpen: boolean,
  now = new Date(),
  renewDays = 2,
): PlanOption {
  if (!current || current.currentPeriodEnd <= now) return { kind: "buy" };
  const rank = planRank(plan.slug);
  const cur = planRank(current.planSlug);
  if (current.planSlug === plan.slug) return renewOpen ? { kind: "renew" } : { kind: "current", until: current.currentPeriodEnd };
  if (rank > cur) return { kind: "upgrade" };
  if (rank === cur) return renewOpen ? { kind: "renew" } : { kind: "lower", availableAt: new Date(current.currentPeriodEnd.getTime() - renewDays * DAY_MS) };
  return { kind: "lower", availableAt: current.currentPeriodEnd };
}
