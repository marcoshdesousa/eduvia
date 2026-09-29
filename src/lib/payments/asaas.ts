// Cliente da API v3 do Asaas (https://docs.asaas.com). Toda chamada acontece no servidor.
import type { BillingTypeKey, PaymentProvider, PaymentStatusKey, PixCode, ProviderPayment } from "./types";

const BASE = {
  sandbox: "https://api-sandbox.asaas.com/v3",
  production: "https://api.asaas.com/v3",
};

export class AsaasError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

type AsaasPayment = {
  id: string;
  subscription?: string | null;
  status: string;
  billingType: string;
  value: number;
  dueDate: string;
  invoiceUrl?: string | null;
  paymentDate?: string | null;
  clientPaymentDate?: string | null;
  confirmedDate?: string | null;
  deleted?: boolean;
};

const PAID = new Set(["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]);
const REFUNDED = new Set(["REFUNDED", "REFUND_REQUESTED", "REFUND_IN_PROGRESS", "CHARGEBACK_REQUESTED", "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL"]);
const OVERDUE = new Set(["OVERDUE", "DUNNING_REQUESTED", "DUNNING_RECEIVED"]);

export function mapAsaasStatus(status: string, deleted?: boolean): PaymentStatusKey {
  if (deleted) return "CANCELED";
  if (PAID.has(status)) return "PAID";
  if (REFUNDED.has(status)) return "REFUNDED";
  if (OVERDUE.has(status)) return "OVERDUE";
  return "PENDING";
}

export function mapAsaasPayment(p: AsaasPayment): ProviderPayment {
  const status = mapAsaasStatus(p.status, p.deleted);
  const paidDate = p.confirmedDate ?? p.paymentDate ?? p.clientPaymentDate;
  return {
    id: p.id,
    subscriptionId: p.subscription ?? null,
    status,
    billingType: (p.billingType === "CREDIT_CARD" ? "CREDIT_CARD" : "PIX") as BillingTypeKey,
    valueCents: Math.round(p.value * 100),
    dueDate: p.dueDate,
    paidAt: status === "PAID" ? (paidDate ? new Date(`${paidDate}T12:00:00-03:00`) : new Date()) : null,
    invoiceUrl: p.invoiceUrl ?? null,
  };
}

export class AsaasProvider implements PaymentProvider {
  readonly name = "asaas" as const;
  private base: string;

  constructor(
    private apiKey: string,
    env: "sandbox" | "production",
  ) {
    this.base = BASE[env];
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: { access_token: this.apiKey, "content-type": "application/json", "user-agent": "Eduvia" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const msg = json?.errors?.[0]?.description ?? `Asaas respondeu ${res.status}`;
      throw new AsaasError(msg, res.status, json);
    }
    return json as T;
  }

  async upsertCustomer(input: { existingId: string | null; name: string; cpfCnpj: string; email: string; externalReference: string }) {
    const body = { name: input.name, cpfCnpj: input.cpfCnpj, email: input.email, externalReference: input.externalReference };
    if (input.existingId) {
      try {
        const c = await this.req<{ id: string }>("POST", `/customers/${input.existingId}`, body);
        return c.id;
      } catch (e) {
        if (!(e instanceof AsaasError && e.status === 404)) throw e;
      }
    }
    const c = await this.req<{ id: string }>("POST", "/customers", body);
    return c.id;
  }

  async createSubscription(input: Parameters<PaymentProvider["createSubscription"]>[0]) {
    const sub = await this.req<{ id: string }>("POST", "/subscriptions", {
      customer: input.customerId,
      billingType: input.billingType,
      value: input.valueCents / 100,
      nextDueDate: input.nextDueDate,
      cycle: input.cycle,
      description: input.description,
      externalReference: input.externalReference,
    });
    // a primeira cobrança é criada junto com a assinatura
    const list = await this.req<{ data: AsaasPayment[] }>("GET", `/subscriptions/${sub.id}/payments`);
    const first = list.data.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
    if (!first) throw new AsaasError("Assinatura criada sem cobrança", 500);
    return { id: sub.id, firstPayment: mapAsaasPayment(first) };
  }

  async getPayment(id: string) {
    try {
      return mapAsaasPayment(await this.req<AsaasPayment>("GET", `/payments/${id}`));
    } catch (e) {
      if (e instanceof AsaasError && e.status === 404) return null;
      throw e;
    }
  }

  async getPixCode(paymentId: string): Promise<PixCode | null> {
    try {
      const r = await this.req<{ encodedImage: string; payload: string; expirationDate?: string }>("GET", `/payments/${paymentId}/pixQrCode`);
      return { image: `data:image/png;base64,${r.encodedImage}`, payload: r.payload, expiresAt: r.expirationDate ?? null };
    } catch (e) {
      if (e instanceof AsaasError && (e.status === 400 || e.status === 404)) return null;
      throw e;
    }
  }

  async cancelSubscription(id: string) {
    try {
      await this.req("DELETE", `/subscriptions/${id}`);
    } catch (e) {
      if (!(e instanceof AsaasError && e.status === 404)) throw e;
    }
  }
}
