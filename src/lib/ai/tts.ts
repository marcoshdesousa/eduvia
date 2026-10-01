// Voz natural da aula: Gemini TTS com a chave do próprio aluno (vozes femininas e masculinas).
// O áudio de cada trecho fica guardado: ouvir de novo não gasta a cota.
import { createHash } from "node:crypto";
import { GEMINI_API, AiQuotaError, AiUnavailableError, isMockAi, parseQuota, userGeminiKey } from "@/lib/ai/client";
import { readObject, writeObject } from "@/lib/storage";
import { Mp3Encoder } from "@breezystack/lamejs";
import { alignLevels, frameLevels, packLevels, unpackLevels } from "@/lib/speech-align";

export type TtsVoice = "f" | "m";
/** Vozes do Gemini: Kore (feminina, firme e clara) e Charon (masculina, calma e informativa). */
export const TTS_VOICES: Record<TtsVoice, string> = { f: "Kore", m: "Charon" };
export const TTS_MAX_CHARS = 2600;
// versão do áudio guardado (v5: guarda junto o volume a cada 10 ms, de onde saem os tempos das palavras)
const CACHE_VERSION = "v5-mp3";
// áudios de versões anteriores (sem esse volume): usados só se a voz estiver sem cota agora
const OLD_CACHE_VERSIONS = ["v4-mp3", "v3-mp3"];

const found = new Map<string, { models: string[]; at: number }>();

/** Modelos de voz disponíveis para a chave (flash antes de pro; mais novo primeiro). */
export function rankTtsModels(names: string[]) {
  return names
    .filter((n) => /^gemini-.*tts/.test(n))
    .map((n) => ({ n, v: parseFloat(n.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? "0"), pro: /pro/.test(n) ? 1 : 0 }))
    .sort((a, b) => a.pro - b.pro || b.v - a.v)
    .map((x) => x.n);
}

async function ttsModels(key: string): Promise<string[]> {
  const hit = found.get(key);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.models;
  let names: string[] = [];
  try {
    const res = await fetch(`${GEMINI_API}/models?pageSize=200`, { headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) {
      const body = (await res.json()) as { models?: { name?: string }[] };
      names = (body.models ?? []).flatMap((m) => (m.name ? [m.name.replace(/^models\//, "")] : []));
    }
  } catch {}
  const models = [...new Set([...rankTtsModels(names), "gemini-2.5-flash-preview-tts"])];
  found.set(key, { models, at: Date.now() });
  return models;
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

/** Duração aproximada de um MP3 de taxa constante (para acompanhar a leitura frase a frase). */
export const mp3Seconds = (bytes: number) => (bytes * 8) / (MP3_KBPS * 1000);

function toMp3WithPause(pcm: Buffer, rate: number) {
  return pcmToMp3(Buffer.concat([pcm, Buffer.alloc(Math.round(rate * TAIL_PAUSE_S) * 2)]), rate);
}

/** Fala de teste (modo sem IA): um "bip" por palavra e silêncio nas vírgulas e pontos, para testar a marcação. */
function mockSpeech(text: string, rate: number) {
  const parts: Buffer[] = [];
  for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
    const len = Math.round(rate * (0.08 + m[0].length * 0.035));
    const b = Buffer.alloc(len * 2);
    for (let i = 0; i < len; i++) b.writeInt16LE(Math.round(4000 * Math.sin(i / 4)), i * 2);
    const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
    const gap = /[.!?]/.test(after) ? 0.4 : /[,;:]/.test(after) ? 0.2 : 0.04;
    parts.push(b, Buffer.alloc(Math.round(rate * gap) * 2));
  }
  return Buffer.concat(parts);
}

export type Spoken = { mp3: Buffer; times: number[] | null };

/** Gera (ou reaproveita) o áudio MP3 de um trecho, já limpo e com a pausa do fim, e o tempo de cada palavra. */
export async function speak(userId: string, text: string, voice: TtsVoice): Promise<Spoken> {
  const clean = text.trim().slice(0, TTS_MAX_CHARS);
  const hash = (v: string) => createHash("sha256").update(`${v}:${voice}:${clean}`).digest("hex");
  const cacheKey = `tts/${hash(CACHE_VERSION)}.mp3`;
  const timesFrom = (levels: number[]) => {
    try {
      return alignLevels(levels, clean);
    } catch (e) {
      console.error("[voz] tempos das palavras", e);
      return null;
    }
  };
  try {
    const mp3 = await readObject(cacheKey);
    const meta = await readObject(`tts/${hash(CACHE_VERSION)}.json`)
      .then((b) => JSON.parse(b.toString()) as { levels?: string })
      .catch(() => null);
    return { mp3, times: meta?.levels ? timesFrom(unpackLevels(meta.levels)) : null };
  } catch {}
  const finish = async (pcm: Buffer, rate: number): Promise<Spoken> => {
    const cleaned = cleanPcm(pcm, rate);
    const mp3 = toMp3WithPause(cleaned, rate);
    const levels = frameLevels(cleaned, rate);
    await writeObject(cacheKey, mp3, "audio/mpeg").catch(() => {});
    await writeObject(`tts/${hash(CACHE_VERSION)}.json`, Buffer.from(JSON.stringify({ levels: packLevels(levels) })), "application/json").catch(() => {});
    return { mp3, times: timesFrom(levels) };
  };
  if (isMockAi()) return finish(mockSpeech(clean, 24000), 24000);
  try {
    return await generate(userId, clean, voice, finish);
  } catch (e) {
    // sem cota agora: usa o áudio antigo desta aula (se já foi ouvido antes), sem os tempos das palavras
    for (const v of OLD_CACHE_VERSIONS) {
      const old = await readObject(`tts/${hash(v)}.mp3`).catch(() => null);
      if (old) return { mp3: old, times: null };
    }
    throw e;
  }
}

async function generate(userId: string, clean: string, voice: TtsVoice, finish: (pcm: Buffer, rate: number) => Promise<Spoken>): Promise<Spoken> {
  const key = await userGeminiKey(userId);
  const errors: string[] = [];
  for (const model of (await ttsModels(key)).slice(0, 3)) {
    const res = await fetch(`${GEMINI_API}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: clean }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICES[voice] } } } },
      }),
      signal: AbortSignal.timeout(90_000),
    }).catch((e: Error) => ({ ok: false, status: 0, json: async () => ({ error: { message: e.message } }) }) as unknown as Response);
    if (res.ok) {
      const body = (await res.json()) as { candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[] };
      const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
      if (part?.data) {
        const rate = Number(part.mimeType?.match(/rate=(\d+)/)?.[1]) || 24000;
        return finish(Buffer.from(part.data, "base64"), rate);
      }
      errors.push(`${model}: sem áudio`);
      continue;
    }
    const body = (await res.json().catch(() => ({}))) as Parameters<typeof parseQuota>[0];
    if (res.status === 429) {
      const q = parseQuota(body);
      throw new AiQuotaError("A voz natural chegou ao limite por agora.", q.retryAt, q.daily);
    }
    errors.push(`${model}: ${res.status} ${body.error?.message ?? ""}`);
  }
  throw new AiUnavailableError("A voz natural não está disponível agora.", errors.join(" | "));
}
