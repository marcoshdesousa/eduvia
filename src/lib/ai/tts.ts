// Voz da aula: Piper (grátis, sem limite, no próprio servidor), sempre em português do Brasil.
// O áudio de cada trecho fica guardado: ouvir de novo é instantâneo.
import { createHash } from "node:crypto";
import { isMockAi } from "@/lib/ai/client";
import { piperSpeak } from "@/lib/ai/piper";
import { readObject, writeObject } from "@/lib/storage";
import { Mp3Encoder } from "@breezystack/lamejs";
import { alignLevels, frameLevels } from "@/lib/speech-align";
import { toBlocks, toSpeech } from "@/lib/speech-text";

export type TtsVoice = "f" | "m";
export const TTS_MAX_CHARS = 2600;
// versão do áudio guardado (v7: voz Piper, frase por frase, com o tempo exato de cada frase)
const CACHE_VERSION = "v7-piper";

/** Modelos de voz disponíveis para a chave (flash antes de pro; mais novo primeiro). */
export function rankTtsModels(names: string[]) {
  return names
    .filter((n) => /^gemini-.*tts/.test(n))
    .map((n) => ({ n, v: parseFloat(n.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? "0"), pro: /pro/.test(n) ? 1 : 0 }))
    .sort((a, b) => a.pro - b.pro || b.v - a.v)
    .map((x) => x.n);
}

/**
 * Limpa o áudio: corta o chiado/silêncio do começo e do fim (trechos bem baixos) e suaviza a entrada
 * e a saída (fade de 25 ms) para não dar estalo entre um trecho e outro.
 */
export function cleanPcm(pcm: Buffer, rate = 24000): Buffer {
  const n = Math.floor(pcm.length / 2);
  if (!n) return pcm;
  const win = Math.max(1, Math.floor(rate * 0.02)); // janelas de 20 ms
  const loud = (start: number) => {
    let sum = 0;
    const end = Math.min(n, start + win);
    for (let i = start; i < end; i++) sum += Math.abs(pcm.readInt16LE(i * 2));
    return sum / Math.max(1, end - start) > 600; // ~2% do volume máximo
  };
  let first = 0;
  while (first < n && !loud(first)) first += win;
  let last = n;
  while (last > first && !loud(Math.max(first, last - win))) last -= win;
  if (last <= first) return pcm;
  first = Math.max(0, first - win * 2); // mantém um respiro
  last = Math.min(n, last + win * 3);
  const out = Buffer.from(pcm.subarray(first * 2, last * 2));
  const len = out.length / 2;
  const fade = Math.min(Math.floor(rate * 0.025), Math.floor(len / 2));
  for (let i = 0; i < fade; i++) {
    const g = i / fade;
    out.writeInt16LE(Math.round(out.readInt16LE(i * 2) * g), i * 2);
    const j = len - 1 - i;
    out.writeInt16LE(Math.round(out.readInt16LE(j * 2) * g), j * 2);
  }
  return out;
}

/** PCM 16 bits mono (o que o Gemini devolve) → WAV, que qualquer navegador toca. */
export function pcmToWav(pcm: Buffer, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

/** Pausa natural no fim de cada trecho (fim de frase/parágrafo), já dentro do áudio: os trechos emendam sem estalo. */
const TAIL_PAUSE_S = 0.35;
const MP3_KBPS = 48;

/** PCM 16 bits mono → MP3 (48 kbps): ~8x menor que WAV, leve para baixar a aula inteira no celular. */
export function pcmToMp3(pcm: Buffer, rate: number): Buffer {
  const samples = new Int16Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.length - (pcm.length % 2)));
  const enc = new Mp3Encoder(1, rate, MP3_KBPS);
  const out: Uint8Array[] = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const b = enc.encodeBuffer(samples.subarray(i, i + 1152));
    if (b.length) out.push(b);
  }
  out.push(enc.flush());
  return Buffer.concat(out.map((b) => Buffer.from(b.buffer, b.byteOffset, b.length)));
}

/** Duração aproximada de um MP3 de taxa constante (reserva, se não der para contar os quadros). */
export const mp3Seconds = (bytes: number) => (bytes * 8) / (MP3_KBPS * 1000);

/** Duração exata do MP3: conta os quadros (cada pedaço emenda no outro sem a marcação escorregar). */
export function mp3Duration(buf: Buffer): number {
  const KBPS = [
    [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], // MPEG-1 camada III
    [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], // MPEG-2/2.5 camada III
  ];
  const RATES: Record<number, number[]> = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
  let off = 0;
  let samples = 0;
  let rate = 0;
  while (off + 4 <= buf.length) {
    if (buf[off] !== 0xff || (buf[off + 1] & 0xe0) !== 0xe0) {
      off++;
      continue;
    }
    const version = (buf[off + 1] >> 3) & 3; // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
    const br = (buf[off + 2] >> 4) & 15;
    const sr = (buf[off + 2] >> 2) & 3;
    const pad = (buf[off + 2] >> 1) & 1;
    if (version === 1 || br === 0 || br === 15 || sr === 3) {
      off++;
      continue;
    }
    const mpeg1 = version === 3;
    rate = RATES[version][sr];
    const len = Math.floor(((mpeg1 ? 144 : 72) * KBPS[mpeg1 ? 0 : 1][br] * 1000) / rate) + pad;
    if (len < 4) break;
    samples += mpeg1 ? 1152 : 576;
    off += len;
  }
  return rate ? samples / rate : mp3Seconds(buf.length);
}

/** Silêncio que o codificador MP3 põe no começo de cada pedaço (o som da fala começa depois dele). */
export const MP3_START_DELAY_SAMPLES = 1105;

function toMp3WithPause(pcm: Buffer, rate: number) {
  return pcmToMp3(Buffer.concat([pcm, Buffer.alloc(Math.round(rate * TAIL_PAUSE_S) * 2)]), rate);
}

/** Fala de teste (modo sem IA): um "bip" por sílaba e silêncio nas vírgulas, para testar a marcação. */
function mockSpeech(text: string, rate: number) {
  const parts: Buffer[] = [];
  for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
    const len = Math.round(rate * (0.08 + m[0].length * 0.035));
    const b = Buffer.alloc(len * 2);
    for (let i = 0; i < len; i++) b.writeInt16LE(Math.round(4000 * Math.sin((Math.PI * i) / len) * Math.sin(i / 4)), i * 2);
    const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
    parts.push(b, Buffer.alloc(Math.round(rate * (/[,;:]/.test(after) ? 0.2 : 0.04)) * 2));
  }
  return Buffer.concat(parts);
}

export type Spoken = { mp3: Buffer; times: number[] | null };

/** Pausa depois de cada frase: maior no fim de frase e depois de títulos (linhas sem ponto). */
const pauseAfterLine = (line: string) => (/[.!?]["”')\]]*$/.test(line) ? 0.45 : /[:;]$/.test(line) ? 0.35 : 0.6);

/**
 * Gera (ou reaproveita) o áudio MP3 de um trecho e o momento em que cada palavra começa.
 * Cada frase (uma por linha) é falada separadamente: o começo de cada frase no áudio é EXATO;
 * dentro da frase, as palavras são encaixadas pelas pausas e sílabas da própria voz.
 */
const inflight = new Map<string, Promise<Spoken>>();

export function speak(text: string): Promise<Spoken> {
  const clean = text.trim().slice(0, TTS_MAX_CHARS);
  const hash = createHash("sha256").update(`${CACHE_VERSION}:${clean}`).digest("hex");
  // o mesmo trecho pedido duas vezes ao mesmo tempo (ex.: o servidor já está preparando): gera uma vez só
  let job = inflight.get(hash);
  if (!job) {
    job = speakNow(clean, hash).finally(() => inflight.delete(hash));
    inflight.set(hash, job);
  }
  return job;
}

/**
 * Prepara o áudio da aula inteira em segundo plano (quando o aluno abre a aula),
 * um trecho de cada vez: quando ele tocar no robô, o áudio já está pronto ou quase.
 */
export async function warmLesson(markdown: string, labels: string[]) {
  for (const b of toBlocks(toSpeech(markdown, labels))) {
    try {
      await speak(b.text);
    } catch (e) {
      console.error("[voz] preparar aula", e);
      return;
    }
  }
}

async function speakNow(clean: string, hash: string): Promise<Spoken> {
  const mp3Key = `tts/${hash}.mp3`;
  const timesKey = `tts/${hash}.json`;
  try {
    const mp3 = await readObject(mp3Key);
    const times = await readObject(timesKey)
      .then((b) => (JSON.parse(b.toString()) as { times?: number[] | null }).times ?? null)
      .catch(() => null);
    return { mp3, times };
  } catch {}
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  let rate = 22050;
  let pcms: Buffer[];
  if (isMockAi()) {
    rate = 24000;
    pcms = lines.map((l) => mockSpeech(l, rate));
  } else ({ rate, pcms } = await piperSpeak(lines));
  const pieces: Buffer[] = [];
  const times: number[] = [];
  let at = 0;
  lines.forEach((line, i) => {
    const pcm = cleanPcm(pcms[i], rate);
    const words = [...line.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)].length;
    let local: number[] | null = null;
    try {
      local = alignLevels(frameLevels(pcm, rate), line);
    } catch (e) {
      console.error("[voz] tempos das palavras", e);
    }
    const secs = pcm.length / 2 / rate;
    for (let k = 0; k < words; k++) times.push(Math.round((at + (local && local.length === words ? local[k] : (k / Math.max(1, words)) * secs)) * 100) / 100);
    const gap = i < lines.length - 1 ? pauseAfterLine(line) : 0;
    pieces.push(pcm, Buffer.alloc(Math.round(rate * gap) * 2));
    at += secs + Math.round(rate * gap) / rate;
  });
  const mp3 = toMp3WithPause(Buffer.concat(pieces), rate);
  const delay = MP3_START_DELAY_SAMPLES / rate;
  for (let k = 0; k < times.length; k++) times[k] = Math.round((times[k] + delay) * 100) / 100;
  await writeObject(mp3Key, mp3, "audio/mpeg").catch(() => {});
  await writeObject(timesKey, Buffer.from(JSON.stringify({ times })), "application/json").catch(() => {});
  return { mp3, times };
}
