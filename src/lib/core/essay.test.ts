import { describe, expect, it } from "vitest";
import { normalizeScores, placeAnnotations, wordCount } from "./essay";

describe("redação", () => {
  it("ajusta notas do ENEM ao passo de 40 e soma o total", () => {
    const r = normalizeScores("ENEM", [
      { key: "C1", score: 170, comment: "" },
      { key: "C2", score: 250, comment: "" },
      { key: "C5", score: -10, comment: "" },
    ]);
    expect(r.criteria.map((c) => c.score)).toEqual([160, 200, 0, 0, 0]);
    expect(r.total).toBe(360);
    expect(r.max).toBe(1000);
  });
  it("arredonda notas pequenas em meios pontos", () => {
    const r = normalizeScores("GERAL", [{ key: "ORTOGRAFIA", score: 0.58, comment: "" }, { key: "PONTUACAO", score: 1.8, comment: "" }]);
    expect(r.criteria.slice(0, 2).map((c) => c.score)).toEqual([0.5, 2]);
    expect(r.total).toBe(2.5);
  });
  it("localiza trechos sem sobrepor e separa os não encontrados", () => {
    const text = "A gente vamos estudar. A gente vamos vencer.";
    const { placed, unplaced } = placeAnnotations(text, [
      { quote: "a gente vamos", category: "CONCORDANCIA", message: "", suggestion: "nós vamos" },
      { quote: "A gente vamos", category: "CONCORDANCIA", message: "", suggestion: "nós vamos" },
      { quote: "inexistente", category: "ESTILO", message: "", suggestion: "" },
    ]);
    expect(placed.map((p) => p.start)).toEqual([0, 23]);
    expect(unplaced).toHaveLength(1);
  });
  it("conta palavras", () => expect(wordCount("  um dois\ntrês ")).toBe(3));
});
