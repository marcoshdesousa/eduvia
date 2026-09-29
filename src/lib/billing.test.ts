import { describe, expect, it } from "vitest";
import { addPeriod, localDayStart, localMonthStart, subscribeMessage, whatsappLink } from "./billing";
import { DEFAULT_PLANS, normalizeLimits, planFeatures } from "./plans";
import { isValidCnpj, isValidCpf } from "./core/cpf";
import { normalizePhone } from "./core/phone";

describe("CPF", () => {
  it("valida dígitos verificadores", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
  });
});

describe("telefone", () => {
  it("normaliza celular e fixo com DDD", () => {
    expect(normalizePhone("(11) 98765-4321")).toBe("11987654321");
    expect(normalizePhone("+55 21 3333-4444")).toBe("2133334444");
    expect(normalizePhone("11 8765-43210")).toBeNull(); // 11 dígitos sem o 9
    expect(normalizePhone("98765-4321")).toBeNull(); // sem DDD
  });
});

describe("assinatura", () => {
  it("soma semana e mês", () => {
    expect(addPeriod(new Date("2026-10-01T10:00:00Z"), "WEEK").toISOString()).toBe("2026-10-08T10:00:00.000Z");
    expect(addPeriod(new Date("2026-01-31T10:00:00Z"), "MONTH").toISOString()).toBe("2026-02-28T10:00:00.000Z");
  });
  it("monta o link do WhatsApp com a mensagem do plano", () => {
    const completo = DEFAULT_PLANS.find((p) => p.slug === "completo")!;
    const link = whatsappLink(subscribeMessage(completo, "MONTH", { name: "Ana", handle: "ana.silva" }));
    expect(link).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(link.split("text=")[1])).toContain("plano Completo mensal");
    expect(decodeURIComponent(link.split("text=")[1])).toContain("49,90");
    expect(decodeURIComponent(link.split("text=")[1])).toContain("@ana.silva");
  });
  it("início do dia em São Paulo é 03:00 UTC", () => {
    expect(localDayStart("America/Sao_Paulo", new Date("2026-10-05T15:00:00Z")).toISOString()).toBe("2026-10-05T03:00:00.000Z");
    expect(localDayStart("America/Sao_Paulo", new Date("2026-10-06T01:00:00Z")).toISOString()).toBe("2026-10-05T03:00:00.000Z");
  });
  it("início do mês em São Paulo", () => {
    expect(localMonthStart("America/Sao_Paulo", new Date("2026-10-15T15:00:00Z")).toISOString()).toBe("2026-10-01T03:00:00.000Z");
    expect(localMonthStart("America/Sao_Paulo", new Date("2026-11-01T01:00:00Z")).toISOString()).toBe("2026-10-01T03:00:00.000Z");
  });
});

describe("planos", () => {
  it("completa limites faltando com os padrões e aceita ilimitado", () => {
    const l = normalizeLimits({ gamesPerDay: -1, essays: "sim", examsPerMonth: 2.4 }, "essencial");
    expect(l.gamesPerDay).toBe(-1);
    expect(l.essays).toBe(true);
    expect(l.examsPerMonth).toBe(2);
    expect(l.tutorMessagesPerMonth).toBe(100);
  });
  it("lista os benefícios do plano", () => {
    const f = planFeatures(DEFAULT_PLANS[0].limits);
    expect(f).toContain("Sem grupos");
    expect(f).toContain("1 jogo por dia");
    expect(planFeatures(DEFAULT_PLANS[3].limits)).toContain("16 simulados por mês");
  });
});
