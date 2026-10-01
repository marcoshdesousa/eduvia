// Voz natural da aula: Gemini TTS com a chave do próprio aluno (vozes femininas e masculinas).
// O áudio de cada trecho fica guardado: ouvir de novo não gasta a cota.
import { createHash } from "node:crypto";
import { GEMINI_API, AiQuotaError, AiUnavailableError, isMockAi, parseQuota, userGeminiKey } from "@/lib/ai/client";
import { readObject, writeObject } from "@/lib/storage";

export type TtsVoice = "f" | "m";
/** Vozes do Gemini: Kore (feminina, firme e clara) e Charon (masculina, calma e informativa). */
export const TTS_VOICES: Record<TtsVoice, string> = { f: "Kore", m: "Charon" };
export const TTS_MAX_CHARS = 1800;
const STYLE = "Leia em português do Brasil, como um professor gentil: voz calma, natural e pausada, sem pressa.";

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

/** Gera (ou reaproveita) o áudio WAV de um trecho. */
export async function speak(userId: string, text: string, voice: TtsVoice): Promise<Buffer> {
  const clean = text.trim().slice(0, TTS_MAX_CHARS);
  const cacheKey = `tts/${createHash("sha256").update(`${voice}:${clean}`).digest("hex")}.wav`;
  try {
    return await readObject(cacheKey);
  } catch {}
  if (isMockAi()) {
    const wav = pcmToWav(Buffer.alloc(24000 * 2 * Math.min(3, Math.max(1, Math.round(clean.length / 60)))), 24000); // silêncio
    return wav;
  }
  const key = await userGeminiKey(userId);
  const errors: string[] = [];
  for (const model of (await ttsModels(key)).slice(0, 3)) {
    const res = await fetch(`${GEMINI_API}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE}\n\n${clean}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICES[voice] } } } },
      }),
      signal: AbortSignal.timeout(90_000),
    }).catch((e: Error) => ({ ok: false, status: 0, json: async () => ({ error: { message: e.message } }) }) as unknown as Response);
    if (res.ok) {
      const body = (await res.json()) as { candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[] };
      const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
      if (part?.data) {
        const rate = Number(part.mimeType?.match(/rate=(\d+)/)?.[1]) || 24000;
        const wav = pcmToWav(Buffer.from(part.data, "base64"), rate);
        await writeObject(cacheKey, wav, "audio/wav").catch(() => {});
        return wav;
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
