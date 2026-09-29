import { AsaasProvider } from "./asaas";
import { SimulatedProvider } from "./simulated";
import type { PaymentProvider } from "./types";

let provider: PaymentProvider | null = null;

/** Asaas quando ASAAS_API_KEY existe; senão, provedor simulado. */
export function paymentProvider(): PaymentProvider {
  if (!provider) {
    const key = process.env.ASAAS_API_KEY;
    provider = key ? new AsaasProvider(key, process.env.ASAAS_ENV === "production" ? "production" : "sandbox") : new SimulatedProvider();
  }
  return provider;
}

export function isSimulatedPayments() {
  return !process.env.ASAAS_API_KEY;
}
