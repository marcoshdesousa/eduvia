import { describe, expect, it } from "vitest";
import {
  SUBSCRIPTION_CENTS,
  ageOn,
  canReview,
  chatOpen,
  estimateCents,
  fitsAvailability,
  formatBRL,
  nextSteps,
  parseBRL,
  parseDateOnly,
  proSeesAddress,
  proVisible,
  shortName,
  transitionRule,
} from "./domain";

describe("regras comerciais", () => {
  it("assinatura do profissional: R$ 15,00 + R$ 0,85 = R$ 15,85", () => {
    expect(SUBSCRIPTION_CENTS).toBe(1585);
    expect(formatBRL(SUBSCRIPTION_CENTS).replace(/\s/g, " ")).toBe("R$ 15,85");
  });
  it("valor estimado = preço por hora × horas (de 1 a 12)", () => {
    expect(estimateCents(2500, 4)).toBe(10_000); // exemplo do documento: R$ 25 × 4 h = R$ 100
    expect(estimateCents(3333, 12)).toBe(39_996);
    expect(() => estimateCents(2500, 0)).toThrow();
    expect(() => estimateCents(2500, 13)).toThrow();
    expect(() => estimateCents(2500, 2.5)).toThrow();
  });
  it("lê preço digitado em reais", () => {
    expect(parseBRL("25")).toBe(2500);
    expect(parseBRL("25,50")).toBe(2550);
    expect(parseBRL("R$ 1.200,00")).toBe(120_000);
    expect(parseBRL("abc")).toBeNull();
  });
});

describe("idade do profissional (18 anos completos)", () => {
  const birth = parseDateOnly("2008-03-15")!;
  it("um dia antes do aniversário de 18: 17", () => expect(ageOn(birth, new Date(Date.UTC(2026, 2, 14)))).toBe(17));
  it("no dia do aniversário de 18: 18", () => expect(ageOn(birth, new Date(Date.UTC(2026, 2, 15)))).toBe(18));
  it("data inválida é recusada", () => {
    expect(parseDateOnly("2008-02-30")).toBeNull();
    expect(parseDateOnly("15/03/2008")).toBeNull();
  });
});

describe("vitrine", () => {
  const future = new Date(Date.now() + 86_400_000);
  const base = { status: "APPROVED" as const, paused: false, hourlyCents: 2500, subscriptionEnd: future };
  it("aparece só aprovado, com assinatura em dia, sem pausa e com preço", () => {
    expect(proVisible(base)).toBe(true);
    expect(proVisible({ ...base, status: "PENDING" })).toBe(false);
    expect(proVisible({ ...base, subscriptionEnd: new Date(Date.now() - 1000) })).toBe(false);
    expect(proVisible({ ...base, subscriptionEnd: null })).toBe(false);
    expect(proVisible({ ...base, paused: true })).toBe(false);
    expect(proVisible({ ...base, hourlyCents: null })).toBe(false);
    expect(proVisible({ ...base, blocked: true })).toBe(false);
  });
  it("nome curto na vitrine", () => expect(shortName("Maria da Silva Souza")).toBe("Maria S."));
});

describe("solicitação e contratação", () => {
  it("só o profissional aceita ou recusa; o cliente não confirma sozinho", () => {
    expect(transitionRule("WAITING_PRO", "ACCEPTED", "PRO")).toBeTruthy();
    expect(transitionRule("WAITING_PRO", "ACCEPTED", "CLIENT")).toBeNull();
    expect(transitionRule("WAITING_PRO", "REFUSED", "PRO")).toBeTruthy();
    expect(transitionRule("WAITING_PRO", "EXPIRED", "SYSTEM")).toBeTruthy();
  });
  it("cancelar depois do aceite exige motivo; antes, não", () => {
    expect(transitionRule("WAITING_PRO", "CANCELED_CLIENT", "CLIENT")?.reason).toBeFalsy();
    expect(transitionRule("ACCEPTED", "CANCELED_CLIENT", "CLIENT")?.reason).toBe(true);
    expect(transitionRule("ACCEPTED", "CANCELED_PRO", "PRO")?.reason).toBe(true);
  });
  it("andamento do serviço segue a ordem", () => {
    expect(nextSteps("ACCEPTED", "PRO").map((s) => s.to)).toEqual(["ON_THE_WAY", "ARRIVED", "STARTED", "CANCELED_PRO"]);
    expect(transitionRule("ACCEPTED", "COMPLETED", "PRO")).toBeNull();
    expect(transitionRule("STARTED", "COMPLETED", "PRO")).toBeTruthy();
    expect(transitionRule("COMPLETED", "CANCELED_CLIENT", "CLIENT")).toBeNull();
  });
  it("chat só depois do aceite", () => {
    const b = { status: "WAITING_PRO" as const, acceptedAt: null, completedAt: null, canceledAt: null };
    expect(chatOpen(b)).toEqual({ read: false, write: false });
    expect(chatOpen({ ...b, status: "ACCEPTED", acceptedAt: new Date() })).toEqual({ read: true, write: true });
    const old = new Date(Date.now() - 10 * 86_400_000);
    expect(chatOpen({ status: "COMPLETED", acceptedAt: old, completedAt: old, canceledAt: null })).toEqual({ read: true, write: false });
  });
  it("endereço para o profissional só depois do aceite", () => {
    expect(proSeesAddress({ status: "WAITING_PRO", acceptedAt: null, completedAt: null, canceledAt: null })).toBe(false);
    expect(proSeesAddress({ status: "ACCEPTED", acceptedAt: new Date(), completedAt: null, canceledAt: null })).toBe(true);
    expect(proSeesAddress({ status: "CANCELED_CLIENT", acceptedAt: new Date(), completedAt: null, canceledAt: new Date() })).toBe(false);
  });
  it("avaliação só de serviço concluído, uma vez", () => {
    expect(canReview({ status: "COMPLETED" }, false)).toBe(true);
    expect(canReview({ status: "COMPLETED" }, true)).toBe(false);
    expect(canReview({ status: "ACCEPTED" }, false)).toBe(false);
  });
  it("agenda: o horário pedido precisa caber na faixa do dia", () => {
    const rules = [{ weekday: 1, startMin: 8 * 60, endMin: 17 * 60 }];
    expect(fitsAvailability(rules, 1, 8 * 60, 4)).toBe(true);
    expect(fitsAvailability(rules, 1, 14 * 60, 4)).toBe(false);
    expect(fitsAvailability(rules, 2, 8 * 60, 1)).toBe(false);
    expect(fitsAvailability([], 2, 8 * 60, 1)).toBe(true);
  });
});
