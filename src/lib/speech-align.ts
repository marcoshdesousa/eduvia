// Sincroniza a marcação laranja com a voz: acha no próprio áudio onde estão as pausas da fala
// e encaixa as palavras entre elas. Usado no servidor (ao gerar o áudio) e no navegador (palavras).

/** Palavras de uma frase, com a posição na frase e o "peso" de fala (letras + pausa da pontuação logo depois). */
export function splitWords(part: string): { word: string; at: number; weight: number }[] {
  const out: { word: string; at: number; weight: number }[] = [];
  for (const m of part.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
    const after = part.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
    const pause = /[.!?]/.test(after) ? 7 : /[,;:]/.test(after) ? 4 : 0;
    out.push({ word: m[0], at: m.index!, weight: m[0].length + 1 + pause });
  }
  return out;
}

/** Quanto tempo a voz leva numa palavra (em sílabas): números são lidos por extenso e demoram mais. */
export function syllables(word: string) {
  const digits = (word.match(/\d/g) ?? []).length;
  const vowels = (word.normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[aeiouy]+/gi) ?? []).length;
  return Math.max(1, vowels + digits * 2.5);
}

/** Pausa depois da palavra: 2 = fim de frase, 1 = vírgula/dois-pontos, 0 = nenhuma. */
const pauseAfter = (text: string, end: number) => {
  const after = text.slice(end, end + 2);
  return /[.!?]/.test(after) ? 2 : /[,;:]/.test(after) ? 1 : 0;
};

/**
 * Momento (em segundos, desde o começo do áudio) em que cada palavra do texto começa a ser falada.
 * Mede o volume do áudio a cada 10 ms, acha os silêncios (pausas de vírgula e de ponto) e encaixa cada
 * pausa na pontuação certa do texto; entre duas pausas, divide o tempo pelas sílabas das palavras.
 * Devolve null se o áudio não tem fala (ex.: modo de teste).
 */
export function alignWords(pcm: Buffer, rate: number, text: string): number[] | null {
  const words = [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)].map((m) => ({
    syl: syllables(m[0]),
    pause: pauseAfter(text, m.index! + m[0].length),
  }));
  if (!words.length) return [];
  const n = Math.floor(pcm.length / 2);
  const hop = Math.max(1, Math.floor(rate / 100)); // 10 ms
  const frames = Math.floor(n / hop);
  if (frames < 5) return null;
  const level: number[] = new Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let i = f * hop; i < (f + 1) * hop; i++) sum += Math.abs(pcm.readInt16LE(i * 2));
    level[f] = sum / hop;
  }
  const sorted = [...level].sort((a, b) => a - b);
  const loud = sorted[Math.floor(frames * 0.9)];
  if (loud < 300) return null; // sem fala
  const thr = Math.max(150, loud * 0.08);
  const voiced = level.map((l) => l > thr);
  const f0 = voiced.indexOf(true);
  const f1 = voiced.lastIndexOf(true) + 1;
  const sec = (f: number) => (f * hop) / rate;

  // silêncios de pelo menos 120 ms no meio da fala
  const pauses: { a: number; b: number }[] = [];
  for (let f = f0; f < f1; ) {
    if (voiced[f]) {
      f++;
      continue;
    }
    let g = f;
    while (g < f1 && !voiced[g]) g++;
    if (g - f >= 12) pauses.push({ a: sec(f), b: sec(g) });
    f = g;
  }

  const speech = sec(f1) - sec(f0) - pauses.reduce((x, p) => x + (p.b - p.a), 0);
  const totalSyl = words.reduce((x, w) => x + w.syl, 0);
  const perSyl = Math.max(0.05, speech / totalSyl); // segundos por sílaba nesta voz
  const starts: number[] = new Array(words.length);
  const spread = (from: number, to: number, t0: number, t1: number) => {
    const tot = words.slice(from, to + 1).reduce((x, w) => x + w.syl, 0) || 1;
    let acc = 0;
    for (let k = from; k <= to; k++) {
      starts[k] = t0 + (acc / tot) * Math.max(0, t1 - t0);
      acc += words[k].syl;
    }
  };

  let t = sec(f0);
  let i = 0;
  let skipped = 0; // silêncios que não eram pontuação (ficam dentro do trecho)
  for (const p of pauses) {
    if (i >= words.length) break;
    // procura a palavra, a partir da atual, que termina mais perto do começo deste silêncio
    let best = -1;
    let bestCost = Infinity;
    const long = p.b - p.a >= 0.3; // pausa longa: quase sempre fim de frase
    let acc = 0;
    for (let j = i; j < words.length - 1; j++) {
      acc += words[j].syl;
      const end = t + skipped + acc * perSyl;
      if (end > p.a + 4) break;
      const cost = Math.abs(end - p.a) / Math.max(1, (end - t) * 0.25) + (words[j].pause === 2 ? 0 : words[j].pause === 1 ? (long ? 0.5 : 0.2) : 0.9);
      if (cost < bestCost) {
        bestCost = cost;
        best = j;
      }
    }
    if (best >= 0 && bestCost < 1.6) {
      spread(i, best, t, p.a);
      t = p.b;
      i = best + 1;
      skipped = 0;
    } else skipped += p.b - p.a;
  }
  if (i < words.length) spread(i, words.length - 1, t, sec(f1));
  return starts.map((s) => Math.round(s * 100) / 100);
}

/** Tempos das palavras num cabeçalho curto: diferenças em centésimos de segundo, separadas por vírgula. */
export function encodeTimes(times: number[]) {
  let prev = 0;
  return times
    .map((t) => {
      const cs = Math.round(t * 100);
      const d = cs - prev;
      prev = cs;
      return d.toString(36);
    })
    .join(",");
}

export function decodeTimes(s: string | null): number[] | null {
  if (!s) return null;
  let acc = 0;
  const out: number[] = [];
  for (const x of s.split(",")) {
    const d = parseInt(x, 36);
    if (!Number.isFinite(d)) return null;
    acc += d;
    out.push(acc / 100);
  }
  return out;
}
