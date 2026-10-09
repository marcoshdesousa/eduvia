import { describe, expect, it } from "vitest";
import { MATERIAS } from "@/lib/enem/catalog";
import { lessonVideo, slideOfPart } from "./lesson-slides";
import { toSpeech } from "./speech-text";

const all = MATERIAS.flatMap((m) => m.lessons.map((l, i) => ({ id: `${m.slug}-${i + 1}`, l })));

describe("modo vídeo", () => {
  it("as frases do vídeo são as mesmas do robô (o áudio pronto da aula serve)", () => {
    for (const { id, l } of all) expect(lessonVideo(l.content, l.title).parts, id).toEqual(toSpeech(l.content));
  });

  it("slides em ordem, cobrindo todas as frases, sem slide vazio", () => {
    for (const { id, l } of all) {
      const v = lessonVideo(l.content, l.title);
      expect(v.slides.length, id).toBeGreaterThan(1);
      expect(v.slides[0].from, id).toBe(0);
      expect(v.slides.at(-1)!.to, id).toBe(v.parts.length);
      v.slides.forEach((s, i) => {
        if (i) expect(s.from, id).toBe(v.slides[i - 1].to);
        expect(s.from <= s.to, id).toBe(true);
        expect(s.els.length || !s.cont, `${id} slide ${i}`).toBeTruthy();
        for (const e of s.els) expect(e.from >= s.from && e.to <= s.to, `${id} slide ${i}`).toBe(true);
      });
      for (let p = 0; p < v.parts.length; p++) {
        const s = v.slides[slideOfPart(v, p)];
        expect(p >= s.from && p < s.to, `${id} frase ${p}`).toBe(true);
      }
    }
  });

  it("monta tópicos, fórmula, tabela e resumo", () => {
    const v = lessonVideo(
      "## A equação\n\n**6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂**\n\nTexto. No ENEM isso cai muito.\n\n## Tabela\n\n| A | B |\n|---|---|\n| x | y |\n\n## Resumindo\n\nFase clara e fase escura.",
      "Fotossíntese",
    );
    expect(v.sections.map((s) => s.title)).toEqual(["A equação", "Tabela", "Resumindo"]);
    expect(v.slides[0].els.map((e) => e.kind)).toEqual(["eq", "enem"]);
    expect(v.slides[1].els[0]).toMatchObject({ kind: "table", rows: [["A", "B"], ["x", "y"]] });
    expect(v.summary).toEqual(["Fase clara e fase escura."]);
  });
});
