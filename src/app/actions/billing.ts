"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, requireReadyUser } from "@/lib/session";
import QRCode from "qrcode";
import { createPlanPix, PlanNotAvailable } from "@/lib/pix-billing";
import { syncpayConfigured } from "@/lib/syncpay";
import { allowAttempt } from "@/lib/rate-limit";
import { addPeriod, getPlan } from "@/lib/billing";
import { LIMIT_FIELDS, PERIOD_DAYS, priceFor, type Interval, type PlanLimits } from "@/lib/plans";
import { today } from "@/lib/core/dates";

/**
 * Admin confirma o pagamento (recebido por fora) ou dá o plano de graça e libera o plano por 1 semana ou 1 mês.
 * Mesmo plano ainda ativo: o período é somado ao final. Troca de plano: vale a partir de agora.
 */
export async function grantPlanAction(userId: string, planSlug: string, interval: Interval) {
  await requireAdmin();
  const plan = await getPlan(planSlug);
  if (!plan || plan.slug === "gratis") return { error: "Plano inválido." };
  const current = await db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
  });
  const samePlan = current?.planSlug === plan.slug;
  const until = addPeriod(samePlan ? current!.currentPeriodEnd : new Date(), interval);
  if (!(interval in PERIOD_DAYS)) return { error: "Período inválido." };
  const price = priceFor(plan, interval);

  await db.$transaction(async (tx) => {
    if (current && !samePlan) {
      await tx.subscription.update({ where: { id: current.id }, data: { status: "CANCELED", canceledAt: new Date() } });
    }
    const sub = samePlan
      ? await tx.subscription.update({ where: { id: current!.id }, data: { currentPeriodEnd: until, interval, status: "ACTIVE" } })
      : await tx.subscription.create({
          data: { userId, planSlug: plan.slug, interval, provider: "manual", status: "ACTIVE", billingType: "MANUAL", currentPeriodEnd: until },
        });
    await tx.payment.create({
      data: {
        subscriptionId: sub.id,
        providerPaymentId: `manual_${randomUUID()}`,
        status: "PAID",
        billingType: "MANUAL",
        valueCents: price,
        dueDate: today(),
        paidAt: new Date(),
      },
    });
  });
  revalidatePath("/admin");
  return { ok: true, until: until.toISOString() };
}

/** Encerra o acesso pago imediatamente (ex.: pagamento estornado). */
export async function endPlanAction(userId: string) {
  await requireAdmin();
  await db.subscription.updateMany({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] } },
    data: { status: "CANCELED", canceledAt: new Date(), currentPeriodEnd: new Date() },
  });
  revalidatePath("/admin");
  return { ok: true };
}

/** Edita nome, preços e limites de um plano (vale na hora para todos os assinantes dele). */
export async function updatePlanAction(slug: string, _: unknown, f: FormData) {
  await requireAdmin();
  const plan = await getPlan(slug);
  if (!plan) return { error: "Plano não encontrado." };
  const cents = (v: FormDataEntryValue | null) => Math.round(Number(String(v ?? "0").replace(",", ".")) * 100);
  const name = String(f.get("name") ?? "").trim() || plan.name;
  const priceWeekCents = cents(f.get("priceWeek"));
  const priceFortnightCents = cents(f.get("priceFortnight"));
  const priceMonthCents = cents(f.get("priceMonth"));
  if (![priceWeekCents, priceFortnightCents, priceMonthCents].every((c) => Number.isFinite(c) && c >= 0 && c <= 100_000_00)) return { error: "Preço inválido." };
  const limits = {} as Record<string, number | boolean>;
  for (const field of LIMIT_FIELDS) {
    if (field.kind === "boolean") limits[field.key] = f.get(field.key) === "on";
    else {
      const raw = String(f.get(field.key) ?? "").trim().toLowerCase();
      const n = raw === "" || raw === "ilimitado" || raw === "-1" ? -1 : Number(raw);
      if (!Number.isInteger(n) || n < -1) return { error: `Valor inválido em "${field.label}". Use um número (ou -1 para ilimitado).` };
      limits[field.key] = n;
    }
  }
  await db.plan.update({ where: { slug }, data: { name: name.slice(0, 40), priceWeekCents, priceFortnightCents, priceMonthCents, limits: limits as PlanLimits, active: slug === "gratis" || f.get("active") === "on" } });
  revalidatePath("/admin");
  revalidatePath("/assinatura");
  return { ok: true, message: `Plano ${name} atualizado.` };
}

export type PixResult = { ok: true; paymentId: string; pixCode: string; qr: string; valueCents: number; planName: string; days: number; creditCents: number } | { ok: false; error: string };

/** Aluno escolhe o plano mensal: cria o Pix na SyncPay e devolve o QR Code e o "copia e cola". */
export async function createPixAction(planSlug: string): Promise<PixResult> {
  const user = await requireReadyUser();
  if (!syncpayConfigured()) return { ok: false, error: "Pagamento por Pix indisponível no momento. Tente de novo em alguns minutos." };
  if (!(await allowAttempt(`pix:${user.id}`, 10, 30))) return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." };
  try {
    const r = await createPlanPix(user, planSlug);
    const qr = await QRCode.toDataURL(r.pixCode, { margin: 1, width: 280 });
    return { ok: true, ...r, qr };
  } catch (e) {
    if (e instanceof PlanNotAvailable) return { ok: false, error: e.message };
    console.error("[syncpay] criar Pix", e);
    return { ok: false, error: "Não foi possível gerar o Pix agora. Tente de novo em instantes." };
  }
}
