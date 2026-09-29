// Provedor simulado: usado quando ASAAS_API_KEY não está configurada (desenvolvimento e testes).
// As cobranças ficam só no banco; o pagamento é confirmado pelo botão "Simular pagamento".
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import type { PaymentProvider, ProviderPayment } from "./types";

const id = (prefix: string) => `${prefix}_${randomBytes(8).toString("hex")}`;

export class SimulatedProvider implements PaymentProvider {
  readonly name = "simulado" as const;

  async upsertCustomer(input: { existingId: string | null }) {
    return input.existingId?.startsWith("sim_") ? input.existingId : id("sim_cus");
  }

  async createSubscription(input: Parameters<PaymentProvider["createSubscription"]>[0]) {
    const subId = id("sim_sub");
    const firstPayment: ProviderPayment = {
      id: id("sim_pay"),
      subscriptionId: subId,
      status: "PENDING",
      billingType: input.billingType,
      valueCents: input.valueCents,
      dueDate: input.nextDueDate,
      paidAt: null,
      invoiceUrl: null,
    };
    return { id: subId, firstPayment };
  }

  async getPayment(providerPaymentId: string): Promise<ProviderPayment | null> {
    const p = await db.payment.findUnique({ where: { providerPaymentId }, include: { subscription: true } });
    if (!p) return null;
    return {
      id: p.providerPaymentId,
      subscriptionId: p.subscription.providerSubscriptionId,
      status: p.status,
      billingType: p.billingType,
      valueCents: p.valueCents,
      dueDate: p.dueDate.toISOString().slice(0, 10),
      paidAt: p.paidAt,
      invoiceUrl: p.invoiceUrl,
    };
  }

  async getPixCode(paymentId: string) {
    return { image: null, payload: `00020126SIMULADO-EDUVIA-${paymentId}`, expiresAt: null };
  }

  async cancelSubscription() {}
}
