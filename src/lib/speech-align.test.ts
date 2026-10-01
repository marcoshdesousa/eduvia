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

describe("marcação não se adianta nem se atrasa com voz irregular", () => {
  it("ritmo variando, vírgulas sem pausa e respiros fora da pontuação: erro médio pequeno e sem desvio", () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const base =
      "Na América do Sul, o primeiro Clube teve início na cidade de Lima, Peru, em 4 de abril de 1955, na Igreja de Miraflores, sob a liderança do casal Nercida e Armando Ruiz, com o apoio do Pr. Donald J. Von Pohle. No segundo ano, o clube já contava com conversões por meio de classes bíblicas, iniciando uma forte parceria evangelística. No final da década de 50, o Pr. Jairo Tavares de Araújo preparou um manual para organizar novos clubes na Divisão Sul-Americana. A expansão seguiu por outros países: Chile, Argentina e Brasil. Filosofia dos Desbravadores A filosofia é o ramo dos estudos que discute o que as pessoas são, o que é o mundo e como aprender e ensinar. ";
    const text = base.repeat(4).slice(0, 2400);
    for (let run = 0; run < 3; run++) {
      const rate = 24000;
      const pcmParts: Buffer[] = [Buffer.alloc(rate * 0.1 * 2)];
      const truth: number[] = [];
      let t = 0.1;
      for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
        truth.push(t);
        const len = Math.round(rate * syllables(m[0]) * 0.16 * (0.6 + rnd() * 0.8));
        const b = Buffer.alloc(len * 2);
        for (let i = 0; i < len; i++) b.writeInt16LE(Math.round((2000 + 5000 * rnd()) * Math.sin(i / 3)), i * 2);
        const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
        const gap = /[.!?]/.test(after) ? 0.3 + rnd() * 0.4 : /[,;:]/.test(after) ? (rnd() < 0.35 ? 0.03 : 0.13 + rnd() * 0.15) : rnd() < 0.03 ? 0.2 : 0.02;
        const g = Math.round(rate * gap);
        pcmParts.push(b, Buffer.alloc(g * 2));
        t += (len + g) / rate;
      }
      const got = alignWords(Buffer.concat(pcmParts), rate, text)!;
      const errs = got.map((x, i) => x - truth[i]);
      const mean = errs.reduce((a, b) => a + Math.abs(b), 0) / errs.length;
      const bias = errs.reduce((a, b) => a + b, 0) / errs.length;
      expect(mean).toBeLessThan(0.2);
      expect(Math.abs(bias)).toBeLessThan(0.08); // não fica adiantada nem atrasada no geral
    }
  });
});

describe("palavra por palavra dentro da frase", () => {
  it("acha o começo das palavras pelas sílabas (picos de volume), mesmo sem pausa entre elas", () => {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const text = "Na América do Sul o primeiro Clube teve início na cidade de Lima. No segundo ano o clube já contava com conversões por meio de classes bíblicas.";
    const rate = 24000;
    const parts: Buffer[] = [Buffer.alloc(rate * 0.1 * 2)];
    const truth: number[] = [];
    let t = 0.1;
    for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
      truth.push(t);
      for (let k = 0; k < syllables(m[0]); k++) {
        const len = Math.round(rate * (0.12 + rnd() * 0.12)); // cada sílaba com duração diferente
        const amp = 3000 + rnd() * 4000;
        const b = Buffer.alloc(len * 2);
        for (let i = 0; i < len; i++) b.writeInt16LE(Math.round(amp * Math.sin((Math.PI * i) / len) ** 2 * Math.sin(i / 3)), i * 2);
        parts.push(b);
        t += len / rate;
      }
      if (/[.]/.test(text.slice(m.index! + m[0].length, m.index! + m[0].length + 1))) {
        parts.push(Buffer.alloc(Math.round(rate * 0.5) * 2));
        t += Math.round(rate * 0.5) / rate;
      }
    }
    const got = alignWords(Buffer.concat(parts), rate, text)!;
    const errs = got.map((x, i) => Math.abs(x - truth[i]));
    expect(errs.reduce((a, b) => a + b, 0) / errs.length).toBeLessThan(0.06);
    expect(Math.max(...errs)).toBeLessThan(0.2);
  });
});
