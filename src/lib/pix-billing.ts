// Assinatura paga por Pix (SyncPay): cria a cobrança do plano e, quando o Pix é confirmado, libera 30 dias.
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { addPeriod, daysLeft, getPlan, RENEW_NOTICE_DAYS } from "@/lib/billing";
import { priceFor } from "@/lib/plans";
import { today } from "@/lib/core/dates";
import { createPix, pixStatus, webhookToken } from "@/lib/syncpay";
import { planOption, quotePlan } from "@/lib/plan-change";
export type { PlanQuote } from "@/lib/plan-change";

type Payer = { id: string; name: string; cpf: string | null; phone: string | null; handle: string | null; timezone?: string };

/** Plano que o aluno não pode comprar agora (a mensagem vai direto para a tela). */
export class PlanNotAvailable extends Error {}

/** Orçamento do plano para este aluno, olhando o plano que ele tem agora. */
/** Plano ativo do aluno agora (com o preço mensal), ou nada. */
async function currentPlanOf(userId: string) {
  const sub = await db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
  });
  const plan = sub ? await getPlan(sub.planSlug) : null;
  return sub && plan ? { planSlug: sub.planSlug, planName: plan.name, priceCents: priceFor(plan, "MONTH"), currentPeriodEnd: sub.currentPeriodEnd } : null;
}

/** Para cada plano: o que o aluno pode fazer (assinar, subir, renovar, já é o dele, indisponível) e quanto paga. */
export async function planOffers(user: { id: string; timezone?: string }, plans: { slug: string; name: string; priceMonthCents: number }[]) {
  const current = await currentPlanOf(user.id);
  const renewOpen = !!current && daysLeft(current.currentPeriodEnd, user.timezone) <= RENEW_NOTICE_DAYS;
  return new Map(
    plans.map((p) => {
      const plan = { slug: p.slug, name: p.name, priceCents: p.priceMonthCents };
      return [p.slug, { option: planOption(plan, current, renewOpen), quote: quotePlan(plan, current) }] as const;
    }),
  );
}
/** Cria (ou reaproveita, se ainda estiver aberta) a cobrança Pix do plano mensal. */
export async function createPlanPix(user: Payer, planSlug: string) {
  const plan = await getPlan(planSlug);
  if (!plan || plan.slug === "gratis" || !plan.active) throw new Error("Plano inválido.");
  if (priceFor(plan, "MONTH") <= 0) throw new Error("Plano sem preço.");
  const offer = (await planOffers(user, [{ slug: plan.slug, name: plan.name, priceMonthCents: priceFor(plan, "MONTH") }])).get(plan.slug)!;
  // com plano ativo: só subir de plano ou renovar o mesmo perto de vencer
  if (offer.option.kind === "current") throw new PlanNotAvailable("Este já é o seu plano. A renovação abre 2 dias antes de vencer.");
  if (offer.option.kind === "lower") throw new PlanNotAvailable("Plano mais barato só fica disponível quando o seu plano atual acabar.");
  const quote = offer.quote;
  const valueCents = quote.payCents;

  // Pix do mesmo plano e mesmo valor criado há menos de 20 minutos e ainda não pago: mostra o mesmo
  const open = await db.payment.findFirst({
    where: {
      status: "PENDING",
      billingType: "PIX",
      valueCents,
      subscription: { userId: user.id, planSlug, provider: "syncpay", status: "PENDING" },
      createdAt: { gt: new Date(Date.now() - 20 * 60_000) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (open?.pixCode) return { paymentId: open.id, pixCode: open.pixCode, valueCents, planName: plan.name, days: open.periodDays, creditCents: open.creditCents };

  const cpf = (user.cpf ?? "").replace(/\D/g, "");
  const charge = await createPix({
    valueCents,
    description: `Eduvia - plano ${plan.name} (${quote.days} dias)`,
    webhookUrl: `${appUrl()}/api/webhooks/syncpay?token=${webhookToken()}`,
    client: { name: user.name, cpf, phone: (user.phone ?? "").replace(/\D/g, ""), email: `aluno${cpf || user.id}@eduvia.com.br` },
  });
  const sub = await db.subscription.create({
    data: { userId: user.id, planSlug: plan.slug, provider: "syncpay", status: "PENDING", interval: "MONTH", billingType: "PIX", currentPeriodEnd: new Date() },
  });
  const payment = await db.payment.create({
    data: { subscriptionId: sub.id, providerPaymentId: `syncpay_${charge.id}`, status: "PENDING", billingType: "PIX", valueCents, dueDate: today(), pixCode: charge.pixCode, creditCents: quote.creditCents, periodDays: quote.days },
  });
  return { paymentId: payment.id, pixCode: charge.pixCode, valueCents, planName: plan.name, days: quote.days, creditCents: quote.creditCents };
}

/** Confere na SyncPay se o Pix caiu e, se caiu, libera o plano (pode ser chamado várias vezes, sem repetir). */
export async function confirmPix(paymentId: string): Promise<"paid" | "pending" | "failed"> {
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { subscription: true } });
  if (!payment) return "failed";
  if (payment.status === "PAID") return "paid";
  if (payment.status !== "PENDING") return "failed";
  const status = await pixStatus(payment.providerPaymentId.replace(/^syncpay_/, ""));
  if (status === "failed") {
    await db.payment.update({ where: { id: payment.id }, data: { status: "CANCELED" } });
    await db.subscription.updateMany({ where: { id: payment.subscriptionId, status: "PENDING" }, data: { status: "CANCELED", canceledAt: new Date() } });
    return "failed";
  }
  if (status !== "paid") return "pending";
  await activate(payment.id);
  return "paid";
}

/** Libera o plano. Mesmo plano ainda ativo: soma 30 dias ao final. Troca de plano: vale a partir de agora (com o desconto já dado). */
async function activate(paymentId: string) {
  await db.$transaction(async (tx) => {
    // trava a cobrança: dois avisos ao mesmo tempo não liberam duas vezes
    const claimed = await tx.payment.updateMany({ where: { id: paymentId, status: "PENDING" }, data: { status: "PAID", paidAt: new Date() } });
    if (!claimed.count) return;
    const payment = await tx.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { subscription: true } });
    const pending = payment.subscription;
    const current = await tx.subscription.findFirst({
      where: { userId: pending.userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
      orderBy: { currentPeriodEnd: "desc" },
    });
    if (current && current.planSlug === pending.planSlug) {
      await tx.subscription.update({ where: { id: current.id }, data: { currentPeriodEnd: addPeriod(current.currentPeriodEnd, "MONTH"), status: "ACTIVE" } });
      await tx.payment.update({ where: { id: paymentId }, data: { subscriptionId: current.id } });
      await tx.subscription.delete({ where: { id: pending.id } });
      return;
    }
    // troca de plano (o desconto pelos dias não usados já veio no valor) ou plano novo: vale a partir de agora
    if (current) await tx.subscription.update({ where: { id: current.id }, data: { status: "CANCELED", canceledAt: new Date() } });
    await tx.subscription.update({ where: { id: pending.id }, data: { status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + payment.periodDays * 86_400_000) } });
  });
}
