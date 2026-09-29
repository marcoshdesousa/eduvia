// Regras de assinatura: checkout, confirmação de pagamento (idempotente), cancelamento.
import { db } from "@/lib/db";
import { activeSubscription, PLANS } from "@/lib/billing";
import { isValidCpfCnpj, onlyDigits } from "@/lib/core/cpf";
import { keyFromDay, today } from "@/lib/core/dates";
import { paymentProvider } from "./index";
import type { BillingTypeKey, ProviderPayment } from "./types";

export class CheckoutError extends Error {}

/** Soma um período de cobrança (semana ou mês calendário) a uma data. */
export function addPeriod(from: Date, interval: "WEEK" | "MONTH"): Date {
  const d = new Date(from);
  if (interval === "WEEK") {
    d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}

export async function startCheckout(input: {
  userId: string;
  planSlug: string;
  billingType: BillingTypeKey;
  payerName: string;
  cpfCnpj: string;
}): Promise<{ paymentId: string }> {
  const plan = PLANS.find((p) => p.slug === input.planSlug);
  if (!plan) throw new CheckoutError("Plano inválido.");
  const doc = onlyDigits(input.cpfCnpj);
  if (!isValidCpfCnpj(doc)) throw new CheckoutError("CPF ou CNPJ inválido.");
  if (input.payerName.trim().length < 3) throw new CheckoutError("Informe o nome de quem vai pagar.");

  const user = await db.user.findUniqueOrThrow({ where: { id: input.userId } });
  const current = await activeSubscription(user.id);
  if (current && current.status !== "CANCELED") throw new CheckoutError("Você já tem uma assinatura ativa. Cancele-a para trocar de plano.");

  const provider = paymentProvider();
  // checkouts anteriores não pagos são descartados
  const pending = await db.subscription.findMany({ where: { userId: user.id, status: "PENDING" } });
  for (const p of pending) {
    if (p.providerSubscriptionId) await provider.cancelSubscription(p.providerSubscriptionId);
    await db.subscription.update({ where: { id: p.id }, data: { status: "CANCELED", canceledAt: new Date() } });
    await db.payment.updateMany({ where: { subscriptionId: p.id, status: "PENDING" }, data: { status: "CANCELED" } });
  }

  const customerId = await provider.upsertCustomer({
    existingId: user.billingCustomerId,
    name: input.payerName.trim(),
    cpfCnpj: doc,
    email: user.email,
    externalReference: user.id,
  });
  if (customerId !== user.billingCustomerId) await db.user.update({ where: { id: user.id }, data: { billingCustomerId: customerId } });

  // Se ainda há período pago (assinatura cancelada), a nova só cobra quando ele terminar: sem cobrança em dobro.
  const startDay = current && current.currentPeriodEnd > today() ? current.currentPeriodEnd : today();
  const localSub = await db.subscription.create({
    data: {
      userId: user.id,
      planSlug: plan.slug,
      provider: provider.name,
      providerCustomerId: customerId,
      status: "PENDING",
      billingType: input.billingType,
      currentPeriodEnd: current?.currentPeriodEnd ?? new Date(),
    },
  });
  const remote = await provider.createSubscription({
    customerId,
    billingType: input.billingType,
    valueCents: plan.priceCents,
    nextDueDate: keyFromDay(startDay),
    cycle: plan.interval === "WEEK" ? "WEEKLY" : "MONTHLY",
    description: `Eduvia — plano ${plan.name}`,
    externalReference: localSub.id,
  });
  await db.subscription.update({ where: { id: localSub.id }, data: { providerSubscriptionId: remote.id } });
  const payment = await savePayment(localSub.id, remote.firstPayment);
  return { paymentId: payment.id };
}

async function savePayment(subscriptionId: string, p: ProviderPayment) {
  return db.payment.upsert({
    where: { providerPaymentId: p.id },
    create: {
      subscriptionId,
      providerPaymentId: p.id,
      status: p.status === "PAID" ? "PENDING" : p.status, // a transição para PAID acontece só em applyPayment
      billingType: p.billingType,
      valueCents: p.valueCents,
      dueDate: new Date(`${p.dueDate}T00:00:00Z`),
      invoiceUrl: p.invoiceUrl,
    },
    update: { invoiceUrl: p.invoiceUrl ?? undefined, dueDate: new Date(`${p.dueDate}T00:00:00Z`), valueCents: p.valueCents },
  });
}

/**
 * Aplica o estado de uma cobrança vinda do provedor (webhook ou consulta). Idempotente:
 * o período só é estendido na primeira vez que a cobrança passa para PAGA.
 */
export async function applyPayment(p: ProviderPayment): Promise<"ok" | "ignored"> {
  const local = await db.payment.findUnique({ where: { providerPaymentId: p.id }, include: { subscription: { include: { plan: true } } } });
  const sub =
    local?.subscription ??
    (p.subscriptionId ? await db.subscription.findUnique({ where: { providerSubscriptionId: p.subscriptionId }, include: { plan: true } }) : null);
  if (!sub) return "ignored";
  await savePayment(sub.id, p);

  if (p.status === "PAID") {
    const paidAt = p.paidAt ?? new Date();
    const transitioned = await db.payment.updateMany({ where: { providerPaymentId: p.id, status: { not: "PAID" } }, data: { status: "PAID", paidAt } });
    if (transitioned.count === 1) {
      const fresh = await db.subscription.findUniqueOrThrow({ where: { id: sub.id } });
      const base = fresh.currentPeriodEnd > paidAt ? fresh.currentPeriodEnd : paidAt;
      await db.subscription.update({
        where: { id: sub.id },
        data: { currentPeriodEnd: addPeriod(base, sub.plan.interval), status: fresh.status === "CANCELED" ? "CANCELED" : "ACTIVE" },
      });
    }
    return "ok";
  }
  if (p.status === "OVERDUE") {
    await db.payment.updateMany({ where: { providerPaymentId: p.id, status: "PENDING" }, data: { status: "OVERDUE" } });
    await db.subscription.updateMany({ where: { id: sub.id, status: "ACTIVE" }, data: { status: "PAST_DUE" } });
    return "ok";
  }
  if (p.status === "REFUNDED") {
    const was = await db.payment.updateMany({ where: { providerPaymentId: p.id, status: { not: "REFUNDED" } }, data: { status: "REFUNDED" } });
    // estorno/chargeback encerra o acesso pago por essa cobrança
    if (was.count) await db.subscription.update({ where: { id: sub.id }, data: { status: "CANCELED", canceledAt: new Date(), currentPeriodEnd: new Date() } });
    return "ok";
  }
  if (p.status === "CANCELED") {
    await db.payment.updateMany({ where: { providerPaymentId: p.id, status: { in: ["PENDING", "OVERDUE"] } }, data: { status: "CANCELED" } });
  }
  return "ok";
}

/** Consulta o provedor (útil enquanto o aluno está na tela de pagamento, caso o webhook atrase). */
export async function refreshPayment(paymentId: string, userId: string) {
  const local = await db.payment.findFirst({ where: { id: paymentId, subscription: { userId } } });
  if (!local) return null;
  if (local.status === "PENDING" || local.status === "OVERDUE") {
    const remote = await paymentProvider().getPayment(local.providerPaymentId);
    if (remote) await applyPayment(remote);
  }
  return db.payment.findUniqueOrThrow({ where: { id: paymentId } });
}

/** Cancela a renovação. O acesso continua até o fim do período já pago. */
export async function cancelSubscription(userId: string) {
  const subs = await db.subscription.findMany({ where: { userId, status: { in: ["ACTIVE", "PAST_DUE", "PENDING"] } } });
  const provider = paymentProvider();
  for (const s of subs) {
    if (s.providerSubscriptionId) await provider.cancelSubscription(s.providerSubscriptionId);
    await db.subscription.update({ where: { id: s.id }, data: { status: "CANCELED", cancelAtPeriodEnd: true, canceledAt: new Date() } });
    await db.payment.updateMany({ where: { subscriptionId: s.id, status: { in: ["PENDING", "OVERDUE"] } }, data: { status: "CANCELED" } });
  }
  return subs.length;
}

/** Evento do provedor avisando que a assinatura foi removida/inativada lá. */
export async function markRemoteSubscriptionEnded(providerSubscriptionId: string) {
  await db.subscription.updateMany({
    where: { providerSubscriptionId, status: { in: ["ACTIVE", "PAST_DUE", "PENDING"] } },
    data: { status: "CANCELED", canceledAt: new Date(), cancelAtPeriodEnd: true },
  });
}
