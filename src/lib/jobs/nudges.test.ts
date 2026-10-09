import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ db: {} }));
import { nudgeMinute } from "./reminders";
import { findQuoteItems } from "@/components/pdf-viewer";

describe("chamadas do dia", () => {
  it("horário varia até 40 min por aluno e por dia, sempre igual para o mesmo dia", () => {
    const base = { kind: "teste1", at: 600 };
    const a = nudgeMinute("u1", "2026-10-01", base);
    expect(a).toBe(nudgeMinute("u1", "2026-10-01", base));
    expect(Math.abs(a - 600)).toBeLessThanOrEqual(40);
    const days = new Set(Array.from({ length: 10 }, (_, i) => nudgeMinute("u1", `2026-10-${10 + i}`, base)));
    expect(days.size).toBeGreaterThan(1);
  });
});

describe("grifo no PDF", () => {
  it("acha os itens do trecho citado, ignorando acentos e pontuação", () => {
    const items = ["Capítulo 1 — A fotossíntese", "A fotossíntese é o processo pelo qual plantas,", "algas e bactérias transformam energia.", "Outro parágrafo."];
    expect(findQuoteItems(items, "A fotossintese e o processo pelo qual plantas, algas")).toEqual([1, 2]);
    expect(findQuoteItems(items, "texto que não existe na página de jeito nenhum")).toEqual([]);
  });
});
