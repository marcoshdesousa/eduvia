import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ db: {} }));
import { pcmToWav, rankTtsModels } from "./tts";
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
  it("junta frases em blocos sem passar do tamanho", () => {
    const blocks = toBlocks(Array.from({ length: 40 }, (_, i) => `Frase número ${i} com algum conteúdo.`), 200);
    expect(blocks.every((b) => b.length <= 200)).toBe(true);
    expect(blocks.join(" ").split("Frase").length - 1).toBe(40);
  });
});
