import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ db: {} }));
import { cleanPcm, pcmToWav, rankTtsModels } from "./tts";
import { toBlocks } from "@/components/lesson-narrator";

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
  it("junta frases em blocos sem passar do tamanho (o primeiro é curto)", () => {
    const blocks = toBlocks(Array.from({ length: 40 }, (_, i) => `Frase número ${i} com algum conteúdo.`), 200, 80);
    expect(blocks[0].length).toBeLessThanOrEqual(80);
    expect(blocks.every((b) => b.length <= 200)).toBe(true);
    expect(blocks.join(" ").split("Frase").length - 1).toBe(40);
  });
});
