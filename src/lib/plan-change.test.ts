import { describe, expect, it } from "vitest";
import { planOption, quotePlan } from "./plan-change";

const now = new Date("2026-10-06T12:00:00Z");
const daysLeft = (d: number) => new Date(now.getTime() + d * 86_400_000 + 3_600_000); // + 1 h (dia em andamento)

describe("subir de plano (sem desconto pelos dias que sobraram)", () => {
  it("sem plano ou mesmo plano: preço cheio e 30 dias", () => {
    expect(quotePlan({ slug: "completo", name: "Completo", priceCents: 1990 }, null, now)).toEqual({ priceCents: 1990, payCents: 1990, days: 30, change: null });
    expect(quotePlan({ slug: "basico", name: "Básico", priceCents: 990 }, { planSlug: "basico", planName: "Básico", currentPeriodEnd: daysLeft(20) }, now)).toMatchObject({ payCents: 990, change: null });
  });
  it("do Básico para o Completo: paga o preço cheio do Completo", () => {
    expect(quotePlan({ slug: "completo", name: "Completo", priceCents: 1990 }, { planSlug: "basico", planName: "Básico", currentPeriodEnd: daysLeft(20) }, now)).toEqual({
      priceCents: 1990,
      payCents: 1990,
      days: 30,
      change: { fromName: "Básico" },
    });
  });
});

describe("o que dá para comprar com um plano ativo", () => {
  const cur = { planSlug: "basico", currentPeriodEnd: daysLeft(20) };
  it("sem plano: compra qualquer um", () => {
    expect(planOption({ slug: "basico" }, null, false, now)).toEqual({ kind: "buy" });
  });
  it("o próprio plano: só renova perto de vencer", () => {
    expect(planOption({ slug: "basico" }, cur, false, now)).toEqual({ kind: "current", until: cur.currentPeriodEnd });
    expect(planOption({ slug: "basico" }, cur, true, now)).toEqual({ kind: "renew" });
  });
  it("plano maior: sobe; plano menor: só quando o atual acabar", () => {
    expect(planOption({ slug: "completo" }, cur, false, now)).toEqual({ kind: "upgrade" });
    expect(planOption({ slug: "indicacao" }, cur, false, now)).toEqual({ kind: "upgrade" });
    const full = { planSlug: "completo", currentPeriodEnd: daysLeft(20) };
    expect(planOption({ slug: "basico" }, full, false, now)).toEqual({ kind: "lower", availableAt: full.currentPeriodEnd });
  });
  it("Completo e Indicação são do mesmo nível: troca só na renovação", () => {
    const full = { planSlug: "completo", currentPeriodEnd: daysLeft(20) };
    expect(planOption({ slug: "indicacao" }, full, false, now).kind).toBe("lower");
    expect(planOption({ slug: "indicacao" }, full, true, now)).toEqual({ kind: "renew" });
  });
});

describe("promoção dos primeiros meses", () => {
  it("Completo: R$ 14,90 nos 3 primeiros meses e depois R$ 19,90; Básico sem promoção", async () => {
    const { monthPrice } = await import("./plans");
    const full = { slug: "completo", priceMonthCents: 1990 };
    expect(monthPrice(full, 0)).toMatchObject({ priceCents: 1490, promo: { month: 1, months: 3 } });
    expect(monthPrice(full, 2)).toMatchObject({ priceCents: 1490, promo: { month: 3 } });
    expect(monthPrice(full, 3)).toEqual({ priceCents: 1990, promo: null });
    expect(monthPrice({ slug: "basico", priceMonthCents: 990 }, 0)).toEqual({ priceCents: 990, promo: null });
  });
});
