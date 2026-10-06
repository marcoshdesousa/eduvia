import { describe, expect, it } from "vitest";
import { planOption, quotePlan } from "./plan-change";

const now = new Date("2026-10-06T12:00:00Z");
const daysLeft = (d: number) => new Date(now.getTime() + d * 86_400_000 + 3_600_000); // + 1 h (dia em andamento)
const pro = { planSlug: "eduvia", planName: "Pro", priceCents: 990 };
const avancado = { slug: "avancado", name: "Avançado", priceCents: 1990 };

describe("troca de plano (desconto por dia)", () => {
  it("sem plano ou mesmo plano: preço cheio e 30 dias", () => {
    expect(quotePlan(avancado, null, now)).toMatchObject({ payCents: 1990, creditCents: 0, days: 30, change: null });
    expect(quotePlan({ slug: "eduvia", name: "Pro", priceCents: 990 }, { ...pro, currentPeriodEnd: daysLeft(20) }, now)).toMatchObject({ payCents: 990, change: null });
  });
  it("usou 10 dias do Pro e troca para o Avançado: desconto dos 20 dias que sobraram", () => {
    // 9,90 ÷ 30 = 0,33 por dia × 20 = 6,60 de desconto → paga 19,90 − 6,60 = 13,30
    expect(quotePlan(avancado, { ...pro, currentPeriodEnd: daysLeft(20) }, now)).toEqual({
      priceCents: 1990, creditCents: 660, payCents: 1330, days: 30, change: { fromName: "Pro", unusedDays: 20 },
    });
  });
  it("usou 29 dias: desconto pequeno", () => {
    expect(quotePlan(avancado, { ...pro, currentPeriodEnd: daysLeft(1) }, now)).toMatchObject({ creditCents: 33, payCents: 1957, days: 30 });
  });
  it("troca para um plano mais barato com muito crédito: paga o mínimo e o resto vira dias", () => {
    const q = quotePlan({ slug: "eduvia", name: "Pro", priceCents: 990 }, { planSlug: "ilimitado", planName: "Ilimitado", priceCents: 4490, currentPeriodEnd: daysLeft(29) }, now);
    // crédito 44,90 ÷ 30 × 29 = 43,40; paga 1,00 (8,90 de desconto); sobram 34,50 = 104 dias de Pro a mais
    expect(q).toMatchObject({ payCents: 100, creditCents: 890, days: 134 });
  });
});

describe("o que dá para comprar com um plano ativo", () => {
  const cur = { planSlug: "avancado", priceCents: 1990, currentPeriodEnd: daysLeft(20) };
  it("sem plano: compra qualquer um", () => {
    expect(planOption({ slug: "eduvia", priceCents: 990 }, null, false, now)).toEqual({ kind: "buy" });
  });
  it("o próprio plano: só renova perto de vencer", () => {
    expect(planOption({ slug: "avancado", priceCents: 1990 }, cur, false, now)).toEqual({ kind: "current", until: cur.currentPeriodEnd });
    expect(planOption({ slug: "avancado", priceCents: 1990 }, cur, true, now)).toEqual({ kind: "renew" });
  });
  it("plano maior: troca com desconto; plano menor: só quando o atual acabar", () => {
    expect(planOption({ slug: "ilimitado", priceCents: 4490 }, cur, false, now)).toEqual({ kind: "upgrade" });
    expect(planOption({ slug: "eduvia", priceCents: 990 }, cur, false, now)).toEqual({ kind: "lower", availableAt: cur.currentPeriodEnd });
  });
});

describe("promoção dos primeiros meses", () => {
  it("Avançado: R$ 14,90 nos 3 primeiros meses e depois R$ 19,90; Ilimitado: R$ 29,90 e depois R$ 44,90; Pro sem promoção", async () => {
    const { monthPrice } = await import("./plans");
    const av = { slug: "avancado", priceMonthCents: 1990 };
    expect(monthPrice(av, 0)).toMatchObject({ priceCents: 1490, promo: { month: 1, months: 3 } });
    expect(monthPrice(av, 2)).toMatchObject({ priceCents: 1490, promo: { month: 3 } });
    expect(monthPrice(av, 3)).toEqual({ priceCents: 1990, promo: null });
    expect(monthPrice({ slug: "ilimitado", priceMonthCents: 4490 }, 0).priceCents).toBe(2990);
    expect(monthPrice({ slug: "ilimitado", priceMonthCents: 4490 }, 5).priceCents).toBe(4490);
    expect(monthPrice({ slug: "eduvia", priceMonthCents: 990 }, 0)).toEqual({ priceCents: 990, promo: null });
  });
});
