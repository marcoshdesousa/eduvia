import { describe, expect, it } from "vitest";
import { nextReview, masteryStatus, topicReviewDates } from "./spaced";
import { dayFromKey } from "./dates";
import { validateHandle, suggestHandle } from "./handle";

const D = dayFromKey("2026-10-01");
const key = (d: Date) => d.toISOString().slice(0, 10);

describe("nextReview", () => {
  it("erro vai para o banco de erros e volta amanhã", () => {
    const r = nextReview(null, false, D);
    expect(r.inErrorBank).toBe(true);
    expect(key(r.dueAt)).toBe("2026-10-02");
  });
  it("acerto volta com menos frequência que erro", () => {
    const r = nextReview(null, true, D);
    expect(r.inErrorBank).toBe(false);
    expect(key(r.dueAt)).toBe("2026-10-08");
  });
  it("sai do banco de erros após 2 acertos seguidos", () => {
    let s = nextReview(null, false, D);
    s = nextReview(s, true, D);
    expect(s.inErrorBank).toBe(true);
    s = nextReview(s, true, D);
    expect(s.inErrorBank).toBe(false);
    expect(s.resolved).toBe(true);
  });
});

describe("revisões e domínio", () => {
  it("gera R1..R4 com intervalos configuráveis", () => {
    expect(topicReviewDates(D, [1, 7, 15, 30]).map((r) => key(r.dueDate))).toEqual(["2026-10-02", "2026-10-08", "2026-10-16", "2026-10-31"]);
  });
  it("classifica desempenho", () => {
    expect(masteryStatus(2, 0)).toBe("SEM_DADOS");
    expect(masteryStatus(10, 0.4)).toBe("CRITICO");
    expect(masteryStatus(10, 0.6)).toBe("EM_DESENVOLVIMENTO");
    expect(masteryStatus(10, 0.9)).toBe("BOM");
  });
});

describe("@usuário", () => {
  it("valida formato", () => {
    expect(validateHandle("maria.silva_2").ok).toBe(true);
    expect(validateHandle("Maria").ok).toBe(false);
    expect(validateHandle("ab").ok).toBe(false);
    expect(validateHandle("joão").ok).toBe(false);
    expect(validateHandle(".maria").ok).toBe(false);
    expect(validateHandle("admin").ok).toBe(false);
  });
  it("sugere a partir do nome", () => {
    expect(suggestHandle("João da Silva")).toBe("joao.da.silva");
  });
});
