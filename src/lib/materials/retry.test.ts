import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/queue", () => ({ enqueue: vi.fn() }));
import { retryPlan, UserFacingError } from "./process";
import { AiKeyError, AiQuotaError, AiUnavailableError } from "@/lib/ai/client";

describe("tentativas automáticas do material", () => {
  it("cota: espera a cota voltar, sem mostrar erro", () => {
    const r = retryPlan(new AiQuotaError("x", new Date(Date.now() + 120_000), false), 0);
    expect(r?.afterSeconds).toBeGreaterThanOrEqual(120);
    expect(r?.message).toMatch(/Na fila/);
  });
  it("Google instável ou falha inesperada: tenta de novo com espera crescente, até 5 vezes", () => {
    expect(retryPlan(new AiUnavailableError("x", "d"), 0)?.afterSeconds).toBe(20);
    expect(retryPlan(new Error("boom"), 2)?.afterSeconds).toBe(80);
    expect(retryPlan(new Error("boom"), 7)?.afterSeconds).toBe(600);
    expect(retryPlan(new Error("boom"), 8)).toBeNull();
  });
  it("erros que o aluno precisa resolver não ficam em loop", () => {
    expect(retryPlan(new AiKeyError("chave"), 0)).toBeNull();
    expect(retryPlan(new UserFacingError("sem texto"), 0)).toBeNull();
  });
});
