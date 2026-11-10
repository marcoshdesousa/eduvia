import { describe, expect, it } from "vitest";
import { nextPeriod, subscriptionActive } from "./subscription";

describe("período da assinatura", () => {
  const now = new Date("2026-11-10T12:00:00Z");
  it("sem assinatura: 30 dias a partir de agora", () => {
    expect(nextPeriod(null, now).end.toISOString()).toBe("2026-12-10T12:00:00.000Z");
  });
  it("renovando antes de vencer: soma ao vencimento (não perde dias)", () => {
    expect(nextPeriod(new Date("2026-11-15T12:00:00Z"), now).end.toISOString()).toBe("2026-12-15T12:00:00.000Z");
  });
  it("vencida: conta a partir de agora", () => {
    expect(nextPeriod(new Date("2026-10-01T00:00:00Z"), now).start).toEqual(now);
  });
  it("ativa só até o vencimento", () => {
    expect(subscriptionActive({ currentPeriodEnd: new Date("2026-11-11T00:00:00Z") }, now)).toBe(true);
    expect(subscriptionActive({ currentPeriodEnd: new Date("2026-11-09T00:00:00Z") }, now)).toBe(false);
    expect(subscriptionActive(null, now)).toBe(false);
  });
});
