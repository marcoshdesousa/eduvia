"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireReadyUser } from "@/lib/session";
import { db } from "@/lib/db";
import { cancelSubscription, CheckoutError, startCheckout, applyPayment } from "@/lib/payments/subscriptions";
import { AsaasError } from "@/lib/payments/asaas";
import { isSimulatedPayments, paymentProvider } from "@/lib/payments";
import type { FormState } from "./account";

export async function checkoutAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const input = z
    .object({ planSlug: z.string(), billingType: z.enum(["PIX", "CREDIT_CARD"]), payerName: z.string(), cpfCnpj: z.string() })
    .safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: "Escolha o plano e a forma de pagamento." };
  let paymentId: string;
  try {
    ({ paymentId } = await startCheckout({ userId: user.id, ...input.data }));
  } catch (e) {
    if (e instanceof CheckoutError) return { error: e.message };
    if (e instanceof AsaasError) {
      console.error("[checkout asaas]", e.status, e.details);
      return { error: `Não foi possível criar a cobrança: ${e.message}` };
    }
    throw e;
  }
  redirect(`/assinatura/pagamento/${paymentId}`);
}

export async function cancelSubscriptionAction() {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  await cancelSubscription(user.id);
  revalidatePath("/assinatura");
}

/** Só no modo simulado (sem ASAAS_API_KEY): confirma a cobrança como se tivesse sido paga. */
export async function simulatePaymentAction(paymentId: string) {
  if (!isSimulatedPayments()) return;
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const p = await db.payment.findFirst({ where: { id: paymentId, subscription: { userId: user.id } } });
  if (!p) return;
  const remote = await paymentProvider().getPayment(p.providerPaymentId);
  if (remote) await applyPayment({ ...remote, status: "PAID", paidAt: new Date() });
  revalidatePath("/assinatura");
}
