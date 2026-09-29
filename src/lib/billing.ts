import { db } from "@/lib/db";
import { addDays } from "@/lib/core/dates";

export const TRIAL_DAYS = 3;

export const PLANS = [
  { slug: "semanal", name: "Semanal", priceCents: 700, interval: "WEEK" as const },
  { slug: "mensal", name: "Mensal", priceCents: 1500, interval: "MONTH" as const },
];

export function trialEnd(from = new Date()) {
  return addDays(from, TRIAL_DAYS);
}

/** A cobrança só bloqueia o app quando BILLING_ENFORCED=true (em desenvolvimento fica tudo liberado). */
export function billingEnforced() {
  return process.env.BILLING_ENFORCED === "true";
}

/** Assinatura com período pago em vigor (inclusive cancelada, até o fim do período). */
export async function activeSubscription(userId: string) {
  return db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE", "CANCELED"] }, currentPeriodEnd: { gt: new Date() } },
    include: { plan: true },
    orderBy: { currentPeriodEnd: "desc" },
  });
}

export async function hasAccess(user: { id: string; trialEndsAt: Date | null }) {
  if (!billingEnforced()) return true;
  if (user.trialEndsAt && user.trialEndsAt > new Date()) return true;
  return !!(await activeSubscription(user.id));
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
