import { describe, expect, it } from "vitest";
import { isValidCnpj, isValidCpf } from "@/lib/core/cpf";
import { mapAsaasPayment, mapAsaasStatus } from "./asaas";
import { addPeriod } from "./subscriptions";

describe("CPF/CNPJ", () => {
  it("valida dígitos verificadores", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11.222.333/0001-80")).toBe(false);
  });
});

describe("período de cobrança", () => {
  it("soma semana e mês (respeitando fim de mês)", () => {
    expect(addPeriod(new Date("2026-10-01T10:00:00Z"), "WEEK").toISOString()).toBe("2026-10-08T10:00:00.000Z");
    expect(addPeriod(new Date("2026-01-31T10:00:00Z"), "MONTH").toISOString()).toBe("2026-02-28T10:00:00.000Z");
    expect(addPeriod(new Date("2026-12-15T10:00:00Z"), "MONTH").toISOString()).toBe("2027-01-15T10:00:00.000Z");
  });
});

describe("Asaas", () => {
  it("mapeia status e valores", () => {
    expect(mapAsaasStatus("RECEIVED")).toBe("PAID");
    expect(mapAsaasStatus("CONFIRMED")).toBe("PAID");
    expect(mapAsaasStatus("OVERDUE")).toBe("OVERDUE");
    expect(mapAsaasStatus("REFUNDED")).toBe("REFUNDED");
    expect(mapAsaasStatus("PENDING", true)).toBe("CANCELED");
    const p = mapAsaasPayment({ id: "pay_1", subscription: "sub_1", status: "RECEIVED", billingType: "PIX", value: 15, dueDate: "2026-10-01", paymentDate: "2026-10-01" });
    expect(p).toMatchObject({ valueCents: 1500, status: "PAID", subscriptionId: "sub_1", billingType: "PIX" });
    expect(p.paidAt).toBeInstanceOf(Date);
  });
});
