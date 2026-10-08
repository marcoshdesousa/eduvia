import { describe, expect, it } from "vitest";
import { addPeriod, localDayStart, localMonthStart } from "./billing";
import { DEFAULT_PLANS, INTERVALS, lessonsAllowed, normalizeLimits, planFeatures, planRank } from "./plans";
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
    const l = normalizeLimits({ gamesPerDay: -1, groups: "sim", examsPerMonth: 2.4 }, "basico");
    expect(l.gamesPerDay).toBe(-1);
    expect(l.groups).toBe(false);
    expect(l.examsPerMonth).toBe(2);
    expect(l.tutorMessagesPerDay).toBe(10);
    expect(l.lessonsPct).toBe(50);
  });
  it("planos antigos usam os limites do plano novo equivalente", () => {
    expect(normalizeLimits({ examsPerMonth: 4 }, "eduvia").lessonsPct).toBe(50);
    expect(normalizeLimits({}, "ilimitado").lessonsPct).toBe(100);
    expect(planRank("avancado")).toBe(2);
  });
  it("lista os benefícios do plano", () => {
    const by = Object.fromEntries(DEFAULT_PLANS.map((p) => [p.slug, p]));
    const free = planFeatures(by.gratis.limits);
    expect(free).toContain("Todas as matérias, com 10% das aulas");
    expect(free).toContain("1 simulado ENEM por mês");
    expect(free).toContain("Sem grupos de estudo");
    expect(planFeatures(by.basico.limits)).toContain("Todas as matérias, com metade das aulas");
    expect(planFeatures(by.basico.limits)).toContain("2 redações corrigidas por dia");
    expect(planFeatures(by.basico.limits)).toContain("Professor IA: 10 perguntas por dia");
    expect(planFeatures(by.completo.limits)).toContain("Testes rápidos à vontade");
    expect(planFeatures(by.completo.limits)).toContain("3 simulados ENEM por dia");
    expect(planFeatures(by.completo.limits)).toContain("Grupos de estudo e torneios");
  });
  it("Grátis, Básico R$ 9,90, Completo R$ 19,90 e Indicação (igual ao Completo)", () => {
    const by = Object.fromEntries(DEFAULT_PLANS.map((p) => [p.slug, p]));
    expect(DEFAULT_PLANS.map((p) => p.slug)).toEqual(["gratis", "basico", "completo", "indicacao"]);
    expect([by.basico.priceMonthCents, by.completo.priceMonthCents, by.indicacao.priceMonthCents]).toEqual([990, 1990, 990]);
    expect(by.indicacao.limits).toEqual(by.completo.limits);
    expect(INTERVALS.map((i) => i.key)).toEqual(["MONTH"]);
    expect([by.gratis.limits.lessonsPct, by.basico.limits.lessonsPct, by.completo.limits.lessonsPct]).toEqual([10, 50, 100]);
    expect(by.basico.limits.groups).toBe(false);
    expect(by.completo.limits.groups).toBe(true);
  });
  it("parte das aulas liberada (pelo menos 1)", () => {
    expect(lessonsAllowed(10, 10)).toBe(1);
    expect(lessonsAllowed(40, 10)).toBe(4);
    expect(lessonsAllowed(3, 10)).toBe(1);
    expect(lessonsAllowed(9, 50)).toBe(5);
    expect(lessonsAllowed(9, 100)).toBe(9);
  });
});
