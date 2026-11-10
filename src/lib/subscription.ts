// Assinatura mensal do profissional (R$ 15,85) por Pix na SyncPay.
// O Pix só libera a assinatura depois que o servidor confere o status direto na API da SyncPay
// (o aviso/webhook e qualquer comprovante enviado pela pessoa nunca bastam sozinhos).
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { SUBSCRIPTION_CENTS, SUBSCRIPTION_DAYS, formatBRL } from "@/lib/domain";
import { createPix, pixStatus, syncpayConfigured, webhookToken } from "@/lib/syncpay";
import { openCpf } from "@/lib/cpf";
import { openSecret } from "@/lib/secret-box";
import { notify } from "@/lib/notifications";

const DAY = 86_400_000;
/** Pix aberto há menos tempo que isso é reaproveitado (não cria outro). */
const PIX_REUSE_MS = 30 * 60_000;
/** Pode pagar o próximo mês quando faltarem até tantos dias para vencer. */
export const RENEW_WINDOW_DAYS = 7;

export function subscriptionActive(sub: { currentPeriodEnd: Date | null } | null | undefined, now = new Date()) {
  return !!sub?.currentPeriodEnd && sub.currentPeriodEnd > now;
}

/** Novo vencimento: soma 30 dias a partir do vencimento atual (se ainda vale) ou de agora. */
export function nextPeriod(currentEnd: Date | null, now = new Date()) {
  const start = currentEnd && currentEnd > now ? currentEnd : now;
  return { start, end: new Date(start.getTime() + SUBSCRIPTION_DAYS * DAY) };
}

export class SubscriptionError extends Error {}

/** Cria (ou reaproveita) a cobrança Pix da mensalidade. */
export async function createSubscriptionPix(proId: string) {
  if (!syncpayConfigured()) throw new SubscriptionError("O pagamento por Pix ainda não foi configurado. Fale com o suporte.");
  const pro = await db.professionalProfile.findUnique({ where: { id: proId }, include: { user: true, subscription: true } });
  if (!pro) throw new SubscriptionError("Perfil não encontrado.");
  const end = pro.subscription?.currentPeriodEnd;
  if (end && end.getTime() - Date.now() > RENEW_WINDOW_DAYS * DAY) {
    throw new SubscriptionError(`Sua assinatura está em dia até ${end.toLocaleDateString("pt-BR")}. A renovação abre ${RENEW_WINDOW_DAYS} dias antes de vencer.`);
  }
  const open = await db.subscriptionPayment.findFirst({
    where: { proId, status: "PENDING", provider: "SYNCPAY", createdAt: { gt: new Date(Date.now() - PIX_REUSE_MS) } },
    orderBy: { createdAt: "desc" },
  });
  if (open?.pixCode) return open;
  const cpf = openCpf(pro.user.cpfSealed);
  const phone = openSecret(pro.whatsappSealed) ?? "";
  if (!cpf) throw new SubscriptionError("Não foi possível ler o seu CPF. Fale com o suporte.");
  const charge = await createPix({
    valueCents: SUBSCRIPTION_CENTS,
    description: `HoraLimp — assinatura mensal do profissional (${formatBRL(SUBSCRIPTION_CENTS)})`,
    webhookUrl: `${appUrl()}/api/webhooks/syncpay?t=${webhookToken()}`,
    client: { name: pro.user.name, cpf, phone, email: `profissional${pro.id}@horalimp.com.br` },
  });
  return db.subscriptionPayment.create({ data: { proId, amountCents: SUBSCRIPTION_CENTS, provider: "SYNCPAY", providerId: charge.id, pixCode: charge.pixCode } });
}

/**
 * Confere um Pix na SyncPay e, se pago, libera mais 30 dias. Idempotente: chamar várias vezes
 * (webhook repetido, tela consultando, verificação periódica) nunca soma o mês duas vezes.
 */
export async function confirmPayment(paymentId: string) {
  const pay = await db.subscriptionPayment.findUnique({ where: { id: paymentId } });
  if (!pay || pay.status !== "PENDING" || !pay.providerId) return pay?.status ?? null;
  const status = await pixStatus(pay.providerId);
  if (status === "pending") return "PENDING";
  if (status === "failed") {
    await db.subscriptionPayment.updateMany({ where: { id: pay.id, status: "PENDING" }, data: { status: "FAILED" } });
    return "FAILED";
  }
  return grantPeriod(pay.id);
}

/** Marca o pagamento como pago e estende a assinatura (dentro de uma transação; só uma vez). */
export async function grantPeriod(paymentId: string, now = new Date()) {
  const done = await db.$transaction(async (tx) => {
    const claimed = await tx.subscriptionPayment.updateMany({ where: { id: paymentId, status: "PENDING" }, data: { status: "PAID", paidAt: now } });
    if (!claimed.count) return null;
    const pay = await tx.subscriptionPayment.findUniqueOrThrow({ where: { id: paymentId } });
    const sub = await tx.subscription.findUnique({ where: { proId: pay.proId } });
    const period = nextPeriod(sub?.currentPeriodEnd ?? null, now);
    await tx.subscription.upsert({
      where: { proId: pay.proId },
      create: { proId: pay.proId, currentPeriodEnd: period.end },
      update: { currentPeriodEnd: period.end, canceledAt: null },
    });
    await tx.subscriptionPayment.update({ where: { id: pay.id }, data: { periodStart: period.start, periodEnd: period.end } });
    const pro = await tx.professionalProfile.findUniqueOrThrow({ where: { id: pay.proId }, select: { userId: true } });
    return { userId: pro.userId, end: period.end };
  });
  if (done) {
    await notify(done.userId, {
      title: "Assinatura confirmada ✅",
      body: `Pagamento recebido. Sua assinatura vale até ${done.end.toLocaleDateString("pt-BR")}.`,
      href: "/painel/assinatura",
      dedupeKey: `pago:${paymentId}`,
    });
  }
  return "PAID" as const;
}

/** Liberação manual pelo admin (ex.: pagamento conferido por fora). Fica registrado como pagamento MANUAL. */
export async function grantManual(proId: string, now = new Date()) {
  const pay = await db.subscriptionPayment.create({ data: { proId, amountCents: 0, provider: "MANUAL" } });
  await grantPeriod(pay.id, now);
  return pay.id;
}

/** Verificação periódica: confere os Pix pendentes recentes e avisa quem está perto de vencer. */
export async function subscriptionSweep(now = new Date()) {
  if (syncpayConfigured()) {
    const pending = await db.subscriptionPayment.findMany({
      where: { status: "PENDING", provider: "SYNCPAY", createdAt: { gt: new Date(now.getTime() - 2 * DAY) } },
      select: { id: true },
      take: 50,
    });
    for (const p of pending) await confirmPayment(p.id).catch((e) => console.error("[assinatura] conferir Pix", e));
  }
  const soon = await db.subscription.findMany({
    where: { currentPeriodEnd: { gt: now, lt: new Date(now.getTime() + 3 * DAY) } },
    include: { pro: { select: { userId: true } } },
  });
  for (const s of soon) {
    await notify(s.pro.userId, {
      title: "Sua assinatura vence em breve",
      body: `Vence em ${s.currentPeriodEnd!.toLocaleDateString("pt-BR")}. Renove para continuar aparecendo na vitrine.`,
      href: "/painel/assinatura",
      dedupeKey: `vence:${s.id}:${s.currentPeriodEnd!.toISOString().slice(0, 10)}`,
    });
  }
}
