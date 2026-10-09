import { describe, expect, it } from "vitest";
import { copiedPassages, drawEssayTheme, motivatingTexts } from "./essay-themes";
import { applyCopyPenalty, normalizeScores } from "./essay";

describe("textos motivadores", () => {
  it("todo tema ENEM sorteado vem com textos motivadores", () => {
    for (let i = 0; i < 30; i++) {
      const p = drawEssayTheme();
      expect(p.texts?.length).toBeGreaterThanOrEqual(2);
      expect(motivatingTexts(p.theme)).toEqual(p.texts);
    }
  });
  it("encontra trechos copiados (ignora acentos e pontuação)", () => {
    const src = ["Notícias falsas circulam mais rápido do que as verdadeiras porque costumam despertar medo."];
    const essay = "Hoje em dia, noticias falsas circulam mais rapido do que as verdadeiras, e isso preocupa.";
    expect(copiedPassages(essay, src)).toEqual(["noticias falsas circulam mais rapido do que as verdadeiras,"]);
    expect(copiedPassages("Um texto totalmente autoral sobre o tema proposto aqui.", src)).toEqual([]);
  });
  it("desconta 40 da C3 por trecho copiado e 80 da C2 se a cópia passar de 30%", () => {
    const base = normalizeScores("ENEM", ["C1", "C2", "C3", "C4", "C5"].map((key) => ({ key, score: 160, comment: "" })));
    const one = applyCopyPenalty("ENEM", base, ["a b c d e f g"], 200);
    expect(one.penalty).toBe(40);
    expect(one.scores.total).toBe(760);
    const lots = applyCopyPenalty("ENEM", base, ["a b c d e f g h i j", "k l m n o p q r s t"], 40);
    expect(lots.penalty).toBe(160);
    expect(applyCopyPenalty("GERAL", normalizeScores("GERAL", []), ["x"], 10).penalty).toBe(0);
  });
});
