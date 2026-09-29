export type BillingTypeKey = "PIX" | "CREDIT_CARD";
export type PaymentStatusKey = "PENDING" | "PAID" | "OVERDUE" | "REFUNDED" | "CANCELED";

/** Cobrança no formato interno, independente do provedor. */
export type ProviderPayment = {
  id: string;
  subscriptionId: string | null;
  status: PaymentStatusKey;
  billingType: BillingTypeKey;
  valueCents: number;
  dueDate: string; // AAAA-MM-DD
  paidAt: Date | null;
  invoiceUrl: string | null;
};

export type PixCode = { image: string | null; payload: string; expiresAt: string | null };

export interface PaymentProvider {
  readonly name: "asaas" | "simulado";
  upsertCustomer(input: { existingId: string | null; name: string; cpfCnpj: string; email: string; externalReference: string }): Promise<string>;
  createSubscription(input: {
    customerId: string;
    billingType: BillingTypeKey;
    valueCents: number;
    nextDueDate: string;
    cycle: "WEEKLY" | "MONTHLY";
    description: string;
    externalReference: string;
  }): Promise<{ id: string; firstPayment: ProviderPayment }>;
  getPayment(id: string): Promise<ProviderPayment | null>;
  getPixCode(paymentId: string): Promise<PixCode | null>;
  cancelSubscription(id: string): Promise<void>;
}
