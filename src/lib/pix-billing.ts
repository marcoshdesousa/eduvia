// Assinatura paga por Pix (SyncPay): cria a cobrança do plano e, quando o Pix é confirmado, libera 30 dias.
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { addPeriod, daysLeft, getPlan, RENEW_NOTICE_DAYS } from "@/lib/billing";
import { monthPrice, planRank, priceFor } from "@/lib/plans";
import { today } from "@/lib/core/dates";
import { createPix, pixStatus, webhookToken } from "@/lib/syncpay";
import { planOption, quotePlan } from "@/lib/plan-change";
import { cpfKey } from "@/lib/cpf-key";
import { REFERRAL_PLAN, referralStatus, type ReferralStatus } from "@/lib/referral";
export type { PlanQuote } from "@/lib/plan-change";
export { cpfKey } from "@/lib/cpf-key";

type Payer = { id: string; name: string; cpf: string | null; phone: string | null; handle: string | null; timezone?: string; createdAt?: Date };

/** Plano que o aluno não pode comprar agora (a mensagem vai direto para a tela). */
export class PlanNotAvailable extends Error {}

/** Plano ativo do aluno agora, ou nada. */
async function currentPlanOf(userId: string) {
  const sub = await db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
    include: { payments: { where: { status: "PAID" }, orderBy: { paidAt: "desc" }, take: 1, select: { billingType: true } } },
  });
  const plan = sub ? await getPlan(sub.planSlug) : null;
  if (!sub || !plan) return null;
  return { planSlug: sub.planSlug, planName: plan.name, currentPeriodEnd: sub.currentPeriodEnd, manual: sub.payments[0]?.billingType === "MANUAL" };
}

/**
 * Quantos meses de promoção o CPF já usou em cada plano. Fica guardado pelo CPF: apagar a conta e criar outra
 * não devolve a promoção. Não precisa ser seguido: quem pagou 1 mês e voltou um ano depois ainda tem 2.
 */
async function promoUsesByPlan(cpf: string | null) {
  if (!cpf) return new Map<string, number>();
  const rows = await db.promoUse.findMany({ where: { cpfHash: cpfKey(cpf) } });
  return new Map(rows.map((r) => [r.planSlug, r.uses]));
}

export type PlanOffer = {
  option: ReturnType<typeof planOption>;
  quote: ReturnType<typeof quotePlan>;
  promo: ReturnType<typeof monthPrice>["promo"];
  normalCents: number;
  /** só no plano por indicação */
  referral: ReferralStatus | null;
};

/**
 * Para cada plano: o que o aluno pode fazer (assinar, subir, renovar, já é o dele, indisponível) e o preço do mês
 * para ele (com a promoção dos primeiros meses, se ainda tiver; no plano por indicação, o preço da indicação).
 */
export async function planOffers(user: { id: string; timezone?: string; cpf?: string | null; createdAt?: Date }, plans: { slug: string; name: string; priceMonthCents: number }[]) {
  const cpf = user.cpf !== undefined ? user.cpf : ((await db.user.findUnique({ where: { id: user.id }, select: { cpf: true } }))?.cpf ?? null);
  const [current, used] = await Promise.all([currentPlanOf(user.id), promoUsesByPlan(cpf)]);
  const renewOpen = !!current && daysLeft(current.currentPeriodEnd, user.timezone) <= RENEW_NOTICE_DAYS;
  const out = new Map<string, PlanOffer>();
  for (const p of plans) {
    const referral = p.slug === REFERRAL_PLAN ? await referralStatus({ id: user.id, cpf, createdAt: user.createdAt }, p.priceMonthCents) : null;
    // renovar um plano liberado pelo admin: paga o preço normal (sem promoção)
    const manualRenew = !!current?.manual && current.planSlug === p.slug;
    const month = referral ? { priceCents: referral.priceCents, promo: null } : manualRenew ? { priceCents: p.priceMonthCents, promo: null } : monthPrice(p, used.get(p.slug) ?? 0);
    const option = planOption({ slug: p.slug }, current && { planSlug: current.planSlug, currentPeriodEnd: current.currentPeriodEnd }, renewOpen, new Date(), RENEW_NOTICE_DAYS);
    const quote = quotePlan({ slug: p.slug, name: p.name, priceCents: month.priceCents }, current && { planSlug: current.planSlug, planName: current.planName, currentPeriodEnd: current.currentPeriodEnd });
    out.set(p.slug, { option, quote, promo: month.promo, normalCents: p.priceMonthCents, referral });
  }
  return out;
}

/** Cria (ou reaproveita, se ainda estiver aberta) a cobrança Pix do plano mensal. */
export async function createPlanPix(user: Payer, planSlug: string) {
  const plan = await getPlan(planSlug);
  if (!plan || plan.slug === "gratis" || !plan.active) throw new Error("Plano inválido.");
  if (priceFor(plan, "MONTH") <= 0) throw new Error("Plano sem preço.");
  const offer = (await planOffers(user, [{ slug: plan.slug, name: plan.name, priceMonthCents: priceFor(plan, "MONTH") }])).get(plan.slug)!;
  // com plano ativo: só subir de plano ou renovar perto de vencer
  if (offer.option.kind === "current") throw new PlanNotAvailable("Este já é o seu plano. A renovação abre 2 dias antes de vencer.");
  if (offer.option.kind === "lower") throw new PlanNotAvailable("Este plano só fica disponível perto do fim do seu plano atual.");
  if (offer.referral && !offer.referral.unlocked) {
    const left = offer.referral.needed - offer.referral.count;
    throw new PlanNotAvailable(`Falta${left === 1 ? "" : "m"} ${left} indicaç${left === 1 ? "ão" : "ões"} para liberar este plano. Compartilhe o seu código.`);
  }
  const quote = offer.quote;
  const valueCents = quote.payCents;
  const referral = !!offer.referral;

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
  if (open?.pixCode) return { paymentId: open.id, pixCode: open.pixCode, valueCents, planName: plan.name, days: open.periodDays };

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
    data: { subscriptionId: sub.id, providerPaymentId: `syncpay_${charge.id}`, status: "PENDING", billingType: "PIX", valueCents, dueDate: today(), pixCode: charge.pixCode, periodDays: quote.days, promo: !!offer.promo, referral },
  });
  return { paymentId: payment.id, pixCode: charge.pixCode, valueCents, planName: plan.name, days: quote.days };
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

/**
 * Libera o plano. Mesmo plano (ou do mesmo nível, como Completo ↔ Indicação) ainda ativo: soma 30 dias ao final.
 * Plano maior: vale a partir de agora (o anterior acaba na hora; não há desconto pelos dias que sobraram).
 */
async function activate(paymentId: string) {
  await db.$transaction(async (tx) => {
    // trava a cobrança: dois avisos ao mesmo tempo não liberam duas vezes
    const claimed = await tx.payment.updateMany({ where: { id: paymentId, status: "PENDING" }, data: { status: "PAID", paidAt: new Date() } });
    if (!claimed.count) return;
    const payment = await tx.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { subscription: { include: { user: { select: { cpf: true } } } } } });
    const pending = payment.subscription;
    // pago com preço de promoção ou de indicação: conta para esse CPF (não volta ao apagar a conta)
    if ((payment.promo || payment.referral) && pending.user.cpf) {
      const cpfHash = cpfKey(pending.user.cpf);
      await tx.promoUse.upsert({
        where: { cpfHash_planSlug: { cpfHash, planSlug: pending.planSlug } },
        create: { cpfHash, planSlug: pending.planSlug, uses: 1 },
        update: { uses: { increment: 1 } },
      });
    }
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
    // mesmo nível (renovou com o outro plano do mesmo nível): os 30 dias somam ao final do atual
    const sameLevel = !!current && planRank(current.planSlug) === planRank(pending.planSlug);
    const start = sameLevel ? current!.currentPeriodEnd : new Date();
    if (current) await tx.subscription.update({ where: { id: current.id }, data: { status: "CANCELED", canceledAt: new Date(), ...(sameLevel ? {} : { currentPeriodEnd: new Date() }) } });
    await tx.subscription.update({ where: { id: pending.id }, data: { status: "ACTIVE", currentPeriodEnd: new Date(start.getTime() + payment.periodDays * 86_400_000) } });
  });
}
