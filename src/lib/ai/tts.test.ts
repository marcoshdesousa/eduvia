import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ db: {} }));
import { cleanPcm, pcmToWav, rankTtsModels } from "./tts";
import { mapSentences, sentenceTimeline, toBlocks, toSpeech } from "@/components/lesson-narrator";

describe("voz natural", () => {
  it("prefere modelos de voz flash e mais novos", () => {
    expect(rankTtsModels(["gemini-2.5-pro-preview-tts", "gemini-2.5-flash-preview-tts", "gemini-2.5-flash", "gemini-3-flash-preview-tts"])).toEqual([
      "gemini-3-flash-preview-tts",
      "gemini-2.5-flash-preview-tts",
      "gemini-2.5-pro-preview-tts",
    ]);
  });
  it("monta um WAV válido a partir do PCM", () => {
    const wav = pcmToWav(Buffer.alloc(48000), 24000);
    expect(wav.subarray(0, 4).toString()).toBe("RIFF");
    expect(wav.readUInt32LE(24)).toBe(24000);
    expect(wav.length).toBe(48044);
  });
  it("corta o chiado do começo e do fim e mantém a fala", () => {
    const rate = 24000;
    const pcm = Buffer.alloc(rate * 2 * 3); // 3 s: 1 s de chiado baixo, 1 s de fala, 1 s de chiado
    for (let i = 0; i < rate * 3; i++) {
      const speech = i >= rate && i < rate * 2;
      pcm.writeInt16LE(speech ? Math.round(8000 * Math.sin(i / 5)) : (i % 7) * 40 - 120, i * 2);
    }
    const out = cleanPcm(pcm, rate);
    expect(out.length / 2).toBeGreaterThan(rate * 0.9);
    expect(out.length / 2).toBeLessThan(rate * 1.3);
    expect(Math.abs(out.readInt16LE(0))).toBeLessThan(200); // começa suave (sem estalo)
  });
  it("junta frases em blocos sem passar do tamanho e sabe quais frases estão em cada um", () => {
    const parts = Array.from({ length: 40 }, (_, i) => `Frase número ${i} com algum conteúdo.`);
    const blocks = toBlocks(parts, 200);
    expect(blocks.every((b) => b.text.length <= 200)).toBe(true);
    expect(blocks[0].from).toBe(0);
    expect(blocks.at(-1)!.to).toBe(39);
    blocks.forEach((b, i) => i && expect(b.from).toBe(blocks[i - 1].to + 1));
  });
  it("calcula quando cada frase começa no áudio (para a marcação laranja)", () => {
    const parts = ["Uma frase.", "Outra frase maior aqui.", "Terceira."];
    const starts = sentenceTimeline(parts, [{ from: 0, to: 1 }, { from: 2, to: 2 }], [5.35, 2.35]);
    expect(starts[0]).toBe(0);
    expect(starts[1]).toBeGreaterThan(1);
    expect(starts[1]).toBeLessThan(5);
    expect(starts[2]).toBeCloseTo(5.35);
  });
  it("o robô não lê as marcações de fonte", () => {
    expect(toSpeech("A fotossíntese [T1, T2] gera energia (T3). Fim.", ["T1", "T2", "T3"]).join(" ")).toBe("A fotossíntese gera energia. Fim.");
  });
  it("acha as frases no texto em ordem, sempre para a frente (a marcação não pula)", () => {
    const flat = "Capítulo 1 — A fotossíntese Capítulo 1 — A fotossíntese é o processo pelo qual plantas transformam energia. p.1 Ela ocorre nos cloroplastos, organelas das folhas. p.1 Fim do capítulo.";
    const parts = ["Capítulo 1 — A fotossíntese", "Capítulo 1 — A fotossíntese é o processo pelo qual plantas transformam energia.", "Ela ocorre nos cloroplastos, organelas das folhas.", "Fim do capítulo."];
    const spots = mapSentences(flat, parts);
    expect(spots.every(Boolean)).toBe(true);
    for (let i = 1; i < spots.length; i++) expect(spots[i]!.start).toBeGreaterThanOrEqual(spots[i - 1]!.end - 1);
    expect(flat.slice(spots[2]!.start, spots[2]!.end)).toBe("Ela ocorre nos cloroplastos, organelas das folhas.");
    expect(flat.slice(spots[1]!.start, spots[1]!.end).startsWith("Capítulo 1 — A fotossíntese é")).toBe(true); // a 2ª ocorrência, não a 1ª
  });
});
