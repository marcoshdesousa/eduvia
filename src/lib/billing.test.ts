import { describe, expect, it } from "vitest";
import { addPeriod, localDayStart, localMonthStart } from "./billing";
import { DEFAULT_PLANS, INTERVALS, normalizeLimits, planFeatures, TRIAL_DAYS } from "./plans";
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
  it("soma 7, 15 ou 30 dias", () => {
    expect(addPeriod(new Date("2026-10-01T10:00:00Z"), "WEEK").toISOString()).toBe("2026-10-08T10:00:00.000Z");
    expect(addPeriod(new Date("2026-10-01T10:00:00Z"), "FORTNIGHT").toISOString()).toBe("2026-10-16T10:00:00.000Z");
    expect(addPeriod(new Date("2026-01-31T10:00:00Z"), "MONTH").toISOString()).toBe("2026-03-02T10:00:00.000Z");
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
    const l = normalizeLimits({ gamesPerDay: -1, groups: "sim", examsPerMonth: 2.4 }, "eduvia");
    expect(l.gamesPerDay).toBe(-1);
    expect(l.groups).toBe(true);
    expect(l.examsPerMonth).toBe(2);
    expect(l.tutorMessagesPerDay).toBe(20);
  });
  it("lista os benefícios do plano", () => {
    const f = planFeatures(DEFAULT_PLANS[0].limits);
    expect(f).toContain("Sem grupos");
    expect(f).toContain("1 teste rápido por dia");
    expect(planFeatures(DEFAULT_PLANS[1].limits)).toContain("3 guias de estudo por mês");
    expect(planFeatures(DEFAULT_PLANS[1].limits)).toContain("Professor IA: 20 mensagens por dia");
    expect(planFeatures(DEFAULT_PLANS[3].limits)).toContain("Testes rápidos à vontade");
  });
  it("três planos mensais (9,90, 19,90 e 44,90) e teste grátis de 3 dias, todos com arquivos sem limite", () => {
    const by = Object.fromEntries(DEFAULT_PLANS.map((p) => [p.slug, p]));
    const paid = [by.eduvia, by.avancado, by.ilimitado];
    expect(paid.map((p) => p.priceMonthCents)).toEqual([990, 1990, 4490]);
    expect(paid.every((p) => p.priceWeekCents === 0 && p.priceFortnightCents === 0)).toBe(true);
    expect(INTERVALS.map((i) => i.key)).toEqual(["MONTH"]);
    expect(TRIAL_DAYS).toBe(3);
    expect(DEFAULT_PLANS.every((p) => p.limits.materials === -1 && p.limits.pagesPerPdf === -1 && p.limits.pagesPerDay === -1)).toBe(true);
    expect(by.ilimitado.limits.essaysPerDay).toBe(-1);
    expect(by.gratis.limits.essaysPerDay).toBe(1);
    expect(by.gratis.limits.examsPerMonth).toBe(1);
    expect(DEFAULT_PLANS.filter((p) => p.slug !== "gratis").map((p) => p.slug)).toEqual(["eduvia", "avancado", "ilimitado"]);
  });
});
