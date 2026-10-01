import { describe, expect, it } from "vitest";
import { syllables, alignWords, decodeTimes, encodeTimes, splitWords } from "./speech-align";

/** Fala sintética: cada palavra é um som com duração pelas sílabas (com variação), pausas reais na pontuação. */
function synth(text: string, rate = 24000) {
  const parts: Buffer[] = [];
  const truth: number[] = [];
  let t = 0.2;
  parts.push(Buffer.alloc(Math.round(rate * 0.2) * 2));
  let k = 0;
  for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
    truth.push(t);
    const vowels = syllables(m[0]);
    const dur = vowels * 0.17 * (k++ % 3 === 0 ? 1.25 : 0.85); // a voz não é regular
    const len = Math.round(rate * dur);
    const b = Buffer.alloc(len * 2);
    for (let i = 0; i < len; i++) b.writeInt16LE(Math.round(6000 * Math.sin(i / 3)), i * 2);
    const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
    const gap = /[.!?]/.test(after) ? 0.45 : /[,;:]/.test(after) ? 0.22 : 0.03;
    parts.push(b, Buffer.alloc(Math.round(rate * gap) * 2));
    t += len / rate + Math.round(rate * gap) / rate;
  }
  return { pcm: Buffer.concat(parts), truth };
}

describe("marcação acompanha a voz", () => {
  it("acha o começo de cada palavra pelas pausas do próprio áudio", () => {
    const text =
      "Na América do Sul, o primeiro Clube teve início na cidade de Lima, Peru, em 4 de abril de 1955. No segundo ano, o clube já contava com conversões por meio de classes bíblicas. A expansão seguiu por outros países: Chile, Argentina e Brasil.";
    const { pcm, truth } = synth(text);
    const got = alignWords(pcm, 24000, text)!;
    expect(got).toHaveLength(splitWords(text).length);
    // nas palavras logo depois de uma pausa (começo de frase), o tempo é quase exato
    const errs = got.map((g, i) => Math.abs(g - truth[i]));
    expect(Math.max(...errs)).toBeLessThan(0.35);
    expect(errs.reduce((x, y) => x + y, 0) / errs.length).toBeLessThan(0.1);
    for (let i = 1; i < got.length; i++) expect(got[i]).toBeGreaterThanOrEqual(got[i - 1]);
  });
  it("sem fala no áudio, não inventa tempos", () => {
    expect(alignWords(Buffer.alloc(48000), 24000, "Olá mundo.")).toBeNull();
  });
  it("os tempos viajam num cabeçalho curto e voltam iguais", () => {
    const t = [0, 0.31, 0.77, 1.5, 12.04];
    expect(decodeTimes(encodeTimes(t))).toEqual(t);
  });
});
