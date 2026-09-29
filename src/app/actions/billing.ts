"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { addPeriod, PLANS } from "@/lib/billing";
import { today } from "@/lib/core/dates";

/**
 * Admin confirma que recebeu o pagamento (pelo WhatsApp) e libera o plano.
 * Se o aluno já tem um período ativo, o novo período é somado ao final dele.
 */
export async function grantPlanAction(userId: string, planSlug: string) {
  await requireAdmin();
  const plan = PLANS.find((p) => p.slug === planSlug);
  if (!plan) return { error: "Plano inválido." };
  const current = await db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
  });
  const base = current?.currentPeriodEnd ?? new Date();
  const until = addPeriod(base, plan.interval);

  await db.$transaction(async (tx) => {
    const sub = current
      ? await tx.subscription.update({ where: { id: current.id }, data: { currentPeriodEnd: until, planSlug: plan.slug, status: "ACTIVE" } })
      : await tx.subscription.create({
          data: { userId, planSlug: plan.slug, provider: "manual", status: "ACTIVE", billingType: "MANUAL", currentPeriodEnd: until },
        });
    await tx.payment.create({
      data: {
        subscriptionId: sub.id,
        providerPaymentId: `manual_${randomUUID()}`,
        status: "PAID",
        billingType: "MANUAL",
        valueCents: plan.priceCents,
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
