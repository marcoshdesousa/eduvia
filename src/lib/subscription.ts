// Planos do prestador e pagamentos por Pix (SyncPay).
// Um pagamento só vale depois que o servidor confere o status direto na API da SyncPay
// (o aviso/webhook e comprovante enviado pela pessoa nunca bastam sozinhos).
import type { Plan, PaymentKind } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { MAX_PACKS, PERIOD_DAYS, PLANS, TRIAL_DAYS, UNLOCK_FEE_CENTS, formatBRL, monthlyCents, placesLimit, upgradeCents } from "@/lib/domain";
import { createPix, pixStatus, syncpayConfigured, webhookToken } from "@/lib/syncpay";
import { openCpf } from "@/lib/cpf";
import { openSecret } from "@/lib/secret-box";
import { notify } from "@/lib/notifications";

const DAY = 86_400_000;
const PIX_REUSE_MS = 30 * 60_000;
/** Pode pagar o próximo mês quando faltarem até tantos dias para vencer (ou no teste grátis). */
export const RENEW_WINDOW_DAYS = 7;

export class PaymentError extends Error {}

export function subscriptionActive(sub: { currentPeriodEnd: Date | null } | null | undefined, now = new Date()) {
  return !!sub?.currentPeriodEnd && sub.currentPeriodEnd > now;
}

/** Novo período de 30 dias: emenda no vencimento (se ainda vale) ou começa agora. */
export function nextPeriod(currentEnd: Date | null, now = new Date()) {
  const start = currentEnd && currentEnd > now ? currentEnd : now;
  return { start, end: new Date(start.getTime() + PERIOD_DAYS * DAY) };
}

/** O que a próxima mensalidade cobra (plano e pacotes que valem a partir dela). */
export function nextCharge(sub: { plan: Plan; packs: number; nextPlan: Plan | null; nextPacks: number | null }, choosePlan?: Plan) {
  const plan = choosePlan ?? sub.nextPlan ?? sub.plan;
  const packs = plan === "FULL" ? Math.min(MAX_PACKS, sub.nextPacks ?? sub.packs) : 0;
  return { plan, packs, cents: monthlyCents(plan, packs) };
}

/**
 * Teste grátis: 3 dias do plano Completo, uma vez por CPF para sempre (fica guardado mesmo se a conta for
 * apagada e criada de novo). Devolve true se o teste começou agora.
 */
export async function startTrialIfEligible(proId: string, cpfHash: string, now = new Date()) {
  const claimed = await db.$transaction(async (tx) => {
    await tx.cpfLedger.upsert({ where: { cpfHash }, create: { cpfHash }, update: {} });
    const r = await tx.cpfLedger.updateMany({ where: { cpfHash, trialStartedAt: null }, data: { trialStartedAt: now } });
    const end = r.count ? new Date(now.getTime() + TRIAL_DAYS * DAY) : null;
    await tx.subscription.upsert({
      where: { proId },
      create: { proId, plan: "FULL", trial: !!end, currentPeriodEnd: end },
      update: r.count ? { plan: "FULL", trial: true, currentPeriodEnd: end } : {},
    });
    return r.count > 0;
  });
  return claimed;
}

/** Deixa ativos só os endereços que o plano permite (os mais antigos primeiro); os outros ficam guardados. */
export async function enforcePlaces(proId: string) {
  const sub = await db.subscription.findUnique({ where: { proId } });
  const limit = sub ? placesLimit(sub.plan, sub.packs) : 1;
  const places = await db.providerPlace.findMany({ where: { proId }, orderBy: { createdAt: "asc" }, select: { id: true } });
  const keep = places.slice(0, limit).map((p) => p.id);
  await db.$transaction([
    db.providerPlace.updateMany({ where: { proId, id: { in: keep } }, data: { active: true } }),
    db.providerPlace.updateMany({ where: { proId, id: { notIn: keep } }, data: { active: false } }),
  ]);
}

async function payerOf(userId: string, phoneOverride?: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId }, include: { provider: true } });
  const cpf = openCpf(user.cpfSealed);
  if (!cpf) throw new PaymentError("Não foi possível ler o seu CPF. Fale com o suporte.");
  const phone = phoneOverride || (user.provider ? (openSecret(user.provider.phoneSealed) ?? "") : "");
  return { name: user.name, cpf, phone, email: `conta${user.id.slice(0, 12)}@diariapaga.com.br` };
}

/** Cria (ou reaproveita, se ainda estiver aberta) uma cobrança Pix. */
async function createPayment(userId: string, kind: PaymentKind, cents: number, meta: Record<string, unknown>, description: string, phone?: string) {
  if (!syncpayConfigured()) throw new PaymentError("O pagamento por Pix ainda não foi configurado. Fale com o suporte.");
  const open = await db.payment.findFirst({
    where: { userId, kind, status: "PENDING", provider: "SYNCPAY", amountCents: cents, createdAt: { gt: new Date(Date.now() - PIX_REUSE_MS) } },
    orderBy: { createdAt: "desc" },
  });
  if (open?.pixCode && JSON.stringify(open.meta) === JSON.stringify(meta)) return open;
  const charge = await createPix({ valueCents: cents, description, webhookUrl: `${appUrl()}/api/webhooks/syncpay?t=${webhookToken()}`, client: await payerOf(userId, phone) });
  return db.payment.create({ data: { userId, kind, amountCents: cents, providerId: charge.id, pixCode: charge.pixCode, meta: meta as never } });
}

/** Mensalidade (plano escolhido + pacotes de endereço). */
export async function startSubscriptionPix(userId: string, plan: Plan) {
  const pro = await db.providerProfile.findUnique({ where: { userId }, include: { subscription: true } });
  if (!pro) throw new PaymentError("Crie o seu perfil de prestador primeiro.");
  const sub = pro.subscription;
  const end = sub?.currentPeriodEnd;
  if (sub && !sub.trial && end && end.getTime() - Date.now() > RENEW_WINDOW_DAYS * DAY) {
    throw new PaymentError(`Seu plano está em dia até ${end.toLocaleDateString("pt-BR")}. A renovação abre ${RENEW_WINDOW_DAYS} dias antes de vencer.`);
  }
  const charge = nextCharge(sub ?? { plan, packs: 0, nextPlan: null, nextPacks: null }, plan);
  return createPayment(userId, "SUBSCRIPTION", charge.cents, { plan: charge.plan, packs: charge.packs }, `Diária Paga — plano ${PLANS[charge.plan].name}${charge.packs ? ` + ${charge.packs} pacote(s) de endereços` : ""} (${formatBRL(charge.cents)})`);
}

/** Subir do Básico para o Completo agora: paga só a diferença dos dias que faltam. */
export async function startUpgradePix(userId: string) {
  const pro = await db.providerProfile.findUnique({ where: { userId }, include: { subscription: true } });
  const sub = pro?.subscription;
  if (!pro || !sub || sub.plan !== "BASIC" || !subscriptionActive(sub)) throw new PaymentError("A troca para o Completo é para quem está no Básico em dia.");
  const cents = upgradeCents(sub.currentPeriodEnd);
  return createPayment(userId, "UPGRADE", cents, { plan: "FULL", until: sub.currentPeriodEnd!.toISOString() }, `Diária Paga — troca para o plano Completo (${formatBRL(cents)})`);
}

/** Cliente que não estava no endereço no Contrate rápido: paga R$ 2,85 para voltar a contratar na hora. */
export async function startUnlockPix(userId: string, phone?: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const ledger = await db.cpfLedger.findUnique({ where: { cpfHash: user.cpfHash } });
  if (!ledger?.clientBlockedUntil || ledger.clientBlockedUntil <= new Date()) throw new PaymentError("Sua conta já está liberada.");
  return createPayment(userId, "UNLOCK", UNLOCK_FEE_CENTS, {}, `Diária Paga — taxa de desbloqueio (${formatBRL(UNLOCK_FEE_CENTS)})`, phone);
}

/** Confere um Pix na SyncPay e, se pago, libera o que ele compra. Idempotente. */
export async function confirmPayment(paymentId: string) {
  const pay = await db.payment.findUnique({ where: { id: paymentId } });
  if (!pay || pay.status !== "PENDING" || !pay.providerId) return pay?.status ?? null;
  const status = await pixStatus(pay.providerId);
  if (status === "pending") return "PENDING";
  if (status === "failed") {
    await db.payment.updateMany({ where: { id: pay.id, status: "PENDING" }, data: { status: "FAILED" } });
    return "FAILED";
  }
  return grantPayment(pay.id);
}

/** Marca como pago e libera (dentro de uma transação; só uma vez, mesmo com avisos repetidos). */
export async function grantPayment(paymentId: string, now = new Date()) {
  const result = await db.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({ where: { id: paymentId, status: "PENDING" }, data: { status: "PAID", paidAt: now } });
    if (!claimed.count) return null;
    const pay = await tx.payment.findUniqueOrThrow({ where: { id: paymentId } });
    const meta = (pay.meta ?? {}) as { plan?: Plan; packs?: number; days?: number };
    if (pay.kind === "UNLOCK") {
      const user = await tx.user.findUniqueOrThrow({ where: { id: pay.userId } });
      await tx.cpfLedger.update({ where: { cpfHash: user.cpfHash }, data: { clientBlockedUntil: null, clientBlockReason: null } });
      return { userId: pay.userId, kind: pay.kind, text: "Pagamento recebido. Você já pode contratar de novo." };
    }
    const pro = await tx.providerProfile.findUniqueOrThrow({ where: { userId: pay.userId }, include: { subscription: true } });
    const sub = pro.subscription;
    if (pay.kind === "UPGRADE") {
      await tx.subscription.update({ where: { proId: pro.id }, data: { plan: "FULL", nextPlan: null } });
      return { userId: pay.userId, proId: pro.id, kind: pay.kind, text: "Pronto! Você agora está no plano Completo." };
    }
    const plan = meta.plan ?? "FULL";
    const packs = plan === "FULL" ? Math.min(MAX_PACKS, meta.packs ?? 0) : 0;
    // teste grátis não emenda: o mês pago começa agora
    const period = nextPeriod(sub && !sub.trial ? sub.currentPeriodEnd : null, now);
    if (meta.days) period.end = new Date(period.start.getTime() + meta.days * DAY);
    await tx.subscription.upsert({
      where: { proId: pro.id },
      create: { proId: pro.id, plan, packs, currentPeriodEnd: period.end },
      update: { plan, packs, nextPlan: null, nextPacks: null, trial: false, currentPeriodEnd: period.end },
    });
    await tx.payment.update({ where: { id: pay.id }, data: { meta: { ...meta, plan, packs, start: period.start.toISOString(), end: period.end.toISOString() } } });
    return { userId: pay.userId, proId: pro.id, kind: pay.kind, text: `Plano ${PLANS[plan].name} ativo até ${period.end.toLocaleDateString("pt-BR")}.` };
  });
  if (result) {
    if ("proId" in result && result.proId) await enforcePlaces(result.proId);
    await notify(result.userId, { title: "Pagamento confirmado ✅", body: result.text, href: result.kind === "UNLOCK" ? "/inicio" : "/painel/plano", dedupeKey: `pago:${paymentId}` });
  }
  return "PAID" as const;
}

/** Liberação manual pelo admin (fica registrada como pagamento MANUAL de R$ 0). */
export async function grantManual(userId: string, plan: Plan, days = PERIOD_DAYS, now = new Date()) {
  const pay = await db.payment.create({ data: { userId, kind: "SUBSCRIPTION", amountCents: 0, provider: "MANUAL", meta: { plan, packs: 0, days } } });
  await grantPayment(pay.id, now);
  return pay.id;
}

/** Compra mais 2 endereços (só no Completo em dia): libera na hora e entra na próxima mensalidade. */
export async function addPack(proId: string) {
  const sub = await db.subscription.findUnique({ where: { proId } });
  if (!sub || sub.plan !== "FULL" || !subscriptionActive(sub)) throw new PaymentError("Os endereços extras são do plano Completo em dia.");
  // tinha marcado um pacote para sair: só desfaz a retirada
  if ((sub.nextPacks ?? sub.packs) < sub.packs) {
    await db.subscription.update({ where: { proId }, data: { nextPacks: (sub.nextPacks ?? sub.packs) + 1 } });
    return;
  }
  if (sub.packs >= MAX_PACKS) throw new PaymentError("Você já tem o máximo de 11 endereços.");
  await db.subscription.update({ where: { proId }, data: { packs: sub.packs + 1, nextPacks: Math.min(MAX_PACKS, (sub.nextPacks ?? sub.packs) + 1) } });
  await enforcePlaces(proId);
}

/** Tira um pacote: continua valendo até o vencimento; a próxima mensalidade já vem sem ele. */
export async function removePack(proId: string) {
  const sub = await db.subscription.findUnique({ where: { proId } });
  const next = (sub?.nextPacks ?? sub?.packs ?? 0) - 1;
  if (!sub || next < 0) throw new PaymentError("Você não tem pacotes para tirar.");
  await db.subscription.update({ where: { proId }, data: { nextPacks: next } });
}

/** Escolhe o plano da próxima mensalidade (ex.: voltar para o Básico). */
export async function setNextPlan(proId: string, plan: Plan) {
  await db.subscription.update({ where: { proId }, data: { nextPlan: plan, ...(plan === "BASIC" ? { nextPacks: 0 } : {}) } });
}

/** Verificação periódica: confere Pix pendentes, aplica vencimentos e avisa quem está perto de vencer. */
export async function subscriptionSweep(now = new Date()) {
  if (syncpayConfigured()) {
    const pending = await db.payment.findMany({ where: { status: "PENDING", provider: "SYNCPAY", createdAt: { gt: new Date(now.getTime() - 2 * DAY) } }, select: { id: true }, take: 50 });
    for (const p of pending) await confirmPayment(p.id).catch((e) => console.error("[pagamento] conferir Pix", e));
  }
  // venceu sem renovar: pacotes que estavam marcados para sair, saem
  const lapsed = await db.subscription.findMany({ where: { currentPeriodEnd: { lt: now }, nextPacks: { not: null } } });
  for (const s of lapsed) {
    await db.subscription.update({ where: { id: s.id }, data: { packs: s.nextPacks!, nextPacks: null } });
    await enforcePlaces(s.proId);
  }
  const soon = await db.subscription.findMany({ where: { currentPeriodEnd: { gt: now, lt: new Date(now.getTime() + 2 * DAY) } }, include: { pro: { select: { userId: true } } } });
  for (const s of soon) {
    await notify(s.pro.userId, {
      title: s.trial ? "Seu teste grátis está acabando" : "Seu plano vence em breve",
      body: `Vence em ${s.currentPeriodEnd!.toLocaleDateString("pt-BR")}. Pague por Pix para continuar aparecendo.`,
      href: "/painel/plano",
      dedupeKey: `vence:${s.id}:${s.currentPeriodEnd!.toISOString().slice(0, 10)}`,
    });
  }
}

/** O cliente está impedido de contratar? (penalidade do Contrate rápido) */
export async function clientBlock(cpfHash: string, now = new Date()) {
  const l = await db.cpfLedger.findUnique({ where: { cpfHash } });
  return l?.clientBlockedUntil && l.clientBlockedUntil > now ? { until: l.clientBlockedUntil, reason: l.clientBlockReason } : null;
}
