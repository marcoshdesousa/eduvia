// Troca de plano: desconto pelos dias que o aluno não usou do plano atual (cálculo por dia).
const DAY_MS = 86_400_000;
/** Menor valor de um Pix (troca para um plano mais barato com muito crédito sobrando). */
const MIN_PIX_CENTS = 100;

export type PlanQuote = {
  priceCents: number;
  /** desconto pelos dias não usados do plano atual (só na troca de plano) */
  creditCents: number;
  /** valor do Pix */
  payCents: number;
  /** dias que o pagamento libera */
  days: number;
  /** troca de plano: qual era e quantos dias sobravam */
  change: { fromName: string; unusedDays: number } | null;
};

/**
 * Quanto custa assinar o plano agora.
 * - Sem plano ou mesmo plano (renovação): preço cheio, 30 dias (na renovação, somam ao final).
 * - Troca de plano: o novo plano vale 30 dias a partir de agora e o aluno ganha desconto pelos dias que
 *   não usou do plano atual (preço do plano atual ÷ 30 × dias que sobraram). Se o crédito for maior que o
 *   preço (troca para um plano mais barato), paga o mínimo e o que sobrar vira dias a mais no plano novo.
 */
export function quotePlan(
  plan: { slug: string; name: string; priceCents: number },
  current: { planSlug: string; planName: string; priceCents: number; currentPeriodEnd: Date } | null,
  now = new Date(),
): PlanQuote {
  const price = plan.priceCents;
  if (!current || current.planSlug === plan.slug || current.currentPeriodEnd <= now) {
    return { priceCents: price, creditCents: 0, payCents: price, days: 30, change: null };
  }
  const unusedDays = Math.max(0, Math.min(30, Math.floor((current.currentPeriodEnd.getTime() - now.getTime()) / DAY_MS)));
  const credit = Math.round((current.priceCents / 30) * unusedDays);
  const pay = Math.max(Math.min(price, MIN_PIX_CENTS), price - credit);
  const used = price - pay; // parte do crédito usada como desconto
  const extraDays = price > 0 ? Math.floor((credit - used) / (price / 30)) : 0;
  return { priceCents: price, creditCents: used, payCents: pay, days: 30 + Math.max(0, extraDays), change: { fromName: current.planName, unusedDays } };
}

