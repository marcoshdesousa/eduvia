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
  return alignLevels(frameLevels(pcm, rate), text);
}

/** Volume do áudio a cada 10 ms (guardado junto do áudio: dá para recalcular os tempos sem gerar a voz de novo). */
export function frameLevels(pcm: Buffer, rate: number): number[] {
  const n = Math.floor(pcm.length / 2);
  const hop = Math.max(1, Math.floor(rate / 100));
  const frames = Math.floor(n / hop);
  const level: number[] = new Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let i = f * hop; i < (f + 1) * hop; i++) sum += Math.abs(pcm.readInt16LE(i * 2));
    level[f] = Math.min(65535, Math.round(sum / hop));
  }
  return level;
}

export const packLevels = (l: number[]) => Buffer.from(new Uint16Array(l).buffer).toString("base64");
export const unpackLevels = (s: string) => {
  const b = Buffer.from(s, "base64");
  return [...new Uint16Array(b.buffer, b.byteOffset, Math.floor(b.length / 2))];
};

/** Tempos das palavras a partir do volume a cada 10 ms. */
export function alignLevels(level: number[], text: string): number[] | null {
  const words = [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)].map((m) => ({
    syl: syllables(m[0]),
    pause: pauseAfter(text, m.index! + m[0].length),
  }));
  if (!words.length) return [];
  const frames = level.length;
  if (frames < 5) return null;
  const sorted = [...level].sort((a, b) => a - b);
  const loud = sorted[Math.floor(frames * 0.9)];
  if (loud < 300) return null; // sem fala
  const thr = Math.max(150, loud * 0.08);
  const voiced = level.map((l) => l > thr);
  const f0 = voiced.indexOf(true);
  const f1 = voiced.lastIndexOf(true) + 1;
  const sec = (f: number) => f / 100;

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
  const cum: number[] = [0]; // sílabas acumuladas até o fim de cada palavra
  for (const w of words) cum.push(cum.at(-1)! + w.syl);
  const perSyl = Math.max(0.05, speech / cum.at(-1)!); // segundos por sílaba nesta voz

  // Encaixe ótimo (programação dinâmica) das pausas do áudio nas pontuações do texto:
  // cada par pausa↔pontuação escolhido tem que deixar a fala entre eles com ritmo parecido com o da voz;
  // pontuação de fim de frase sem pausa e pausa longa sem pontuação custam caro.
  const cands = words.flatMap((w, j) => (w.pause && j < words.length - 1 ? [j] : []));
  const K = pauses.length;
  const M = cands.length;
  // nós: 0 = começo; 1..K×M = (pausa i, pontuação c); fim avaliado à parte
  const pa = (i: number) => (i < 0 ? { a: sec(f0), b: sec(f0) } : i >= K ? { a: sec(f1), b: sec(f1) } : pauses[i]);
  const cs = (c: number) => (c < 0 ? 0 : c >= M ? cum.at(-1)! : cum[cands[c] + 1]);
  const skipCost = (i0: number, i1: number) => {
    let cost = 0;
    let dur = 0;
    for (let i = i0 + 1; i < i1; i++) {
      const d = pauses[i].b - pauses[i].a;
      cost += 0.4 + Math.max(0, d - 0.15) * 6;
      dur += d;
    }
    return { cost, dur };
  };
  const missCost = (c0: number, c1: number) => {
    let cost = 0;
    for (let c = c0 + 1; c < c1; c++) cost += words[cands[c]].pause === 2 ? 1.2 : 0.25;
    return cost;
  };
  const step = (i0: number, c0: number, i1: number, c1: number) => {
    const sk = skipCost(i0, i1);
    const d = pa(i1).a - pa(i0).b - sk.dur;
    const exp = (cs(c1) - cs(c0)) * perSyl;
    if (d <= 0.05 || exp <= 0) return Infinity;
    const r = Math.log(d / exp);
    return 3 * r * r * Math.min(1, exp / 1.5) + sk.cost + missCost(c0, c1);
  };
  const WIN = 10;
  const best = new Map<number, { cost: number; prev: number }>();
  const key = (i: number, c: number) => (i + 1) * (M + 2) + (c + 1);
  best.set(key(-1, -1), { cost: 0, prev: -1 });
  const nodes: [number, number][] = [[-1, -1]];
  for (let i = 0; i < K; i++) for (let c = 0; c < M; c++) nodes.push([i, c]);
  nodes.push([K, M]);
  for (const [i1, c1] of nodes.slice(1)) {
    let bestCost = Infinity;
    let prev = -1;
    for (let i0 = Math.max(-1, i1 - WIN); i0 < i1; i0++) {
      for (let c0 = Math.max(-1, c1 - WIN); c0 < c1; c0++) {
        const from = best.get(key(i0, c0));
        if (!from || !Number.isFinite(from.cost)) continue;
        const cost = from.cost + step(i0, c0, i1, c1);
        if (cost < bestCost) {
          bestCost = cost;
          prev = key(i0, c0);
        }
      }
    }
    if (Number.isFinite(bestCost)) best.set(key(i1, c1), { cost: bestCost, prev });
  }
  // caminho escolhido (do fim para o começo)
  const anchors: { i: number; c: number }[] = [];
  let k = best.has(key(K, M)) ? key(K, M) : -1;
  while (k >= 0) {
    anchors.unshift({ i: Math.floor(k / (M + 2)) - 1, c: (k % (M + 2)) - 1 });
    k = best.get(k)!.prev;
  }
  if (anchors.length < 2) anchors.splice(0, anchors.length, { i: -1, c: -1 }, { i: K, c: M });

  // entre duas âncoras, divide a fala pelas sílabas; pausas não usadas no meio são puladas no tempo
  const starts: number[] = new Array(words.length);
  for (let n = 1; n < anchors.length; n++) {
    const A = anchors[n - 1];
    const B = anchors[n];
    const w0 = A.c < 0 ? 0 : cands[A.c] + 1;
    const w1 = B.c >= M ? words.length - 1 : cands[B.c];
    const inner = pauses.slice(A.i + 1, Math.max(A.i + 1, B.i));
    const t0 = pa(A.i).b;
    const total = pa(B.i).a - t0 - inner.reduce((x, p) => x + (p.b - p.a), 0);
    const syl = cum[w1 + 1] - cum[w0] || 1;
    for (let w = w0; w <= w1; w++) {
      let t = t0 + ((cum[w] - cum[w0]) / syl) * Math.max(0, total);
      for (const p of inner) if (t >= p.a - 0.001) t += p.b - p.a; // silêncio não usado: a fala continua depois dele
      starts[w] = t;
    }
  }
  for (let w = 1; w < starts.length; w++) starts[w] = Math.max(starts[w], starts[w - 1]);
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
