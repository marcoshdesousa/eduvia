// Voz das aulas do ENEM (modo vídeo e "Ler e ouvir"): voz natural do Google (Kore), gravada UMA VEZ por aula e
// guardada. As aulas são iguais para todo mundo: depois de gravada, a aula toca na hora para qualquer aluno (é só um
// arquivo MP3 pronto, sem gerar nada quando o aluno clica e sem usar a chave do aluno).
// Quem grava é a "fábrica", no processo do site:
// - com GOOGLE_TTS_API_KEY (Google Cloud Text-to-Speech, voz Chirp 3 HD Kore): grava todas as aulas de uma vez
//   (cerca de 1 hora), com uma trava de letras por mês para nunca passar do grátis do Google;
// - sem ela: com a chave do Gemini do admin (mesma voz Kore), aos poucos, respeitando o limite grátis do dia.
// O texto falado é exatamente o dos slides (lessonVideo) e o do "Ler e ouvir" (são as mesmas frases).
import { createHash } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import { AiQuotaError, GEMINI_API, isMockAi, parseQuota, userGeminiKey } from "@/lib/ai/client";
import { Mp3Encoder } from "@breezystack/lamejs";
import { cleanPcm, MP3_START_DELAY_SAMPLES, mp3Duration, rankTtsModels } from "@/lib/ai/tts";
import { db } from "@/lib/db";
import { lessonVideo } from "@/lib/lesson-slides";
import { alignLevels, frameLevels, packLevels, splitWords, unpackLevels } from "@/lib/speech-align";
import { toBlocks } from "@/lib/speech-text";
import { readObject, writeObject } from "@/lib/storage";
import { findLesson, MATERIAS, lessonTopicId } from "./catalog";

/** Voz do Gemini: Kore (feminina, firme e clara). */
export const VIDEO_VOICE = "Kore";
const VERSION = "gv1";
/** Tamanho de cada pedaço gravado (~2,5 min de fala): poucos pedidos por aula. */
const BLOCK_CHARS = 2400;
/** Pausa entre um pedaço e outro (fim de parágrafo). */
const GAP_S = 0.45;
const RATE = 24000;

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/** Título sem pontuação no fim ganha ponto: a voz faz a pausa e a marcação das palavras acerta a pausa. */
const spoken = (block: string) =>
  block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/[.!?;:…]["”')\]]*$/.test(l) ? l : `${l}.`))
    .join("\n");

function plan(topicId: string) {
  const found = findLesson(topicId);
  if (!found) return null;
  const { lesson } = found;
  const v = lessonVideo(lesson.content, lesson.title);
  const blocks = toBlocks(v.parts, BLOCK_CHARS, []).map((b) => spoken(b.text));
  const id = sha(`${VERSION}:${VIDEO_VOICE}:${blocks.join("\n\n")}`).slice(0, 20);
  return { parts: v.parts, blocks, id, key: `video-voz/${topicId}-${id}` };
}
const blockKey = (text: string) => `video-voz/pedacos/${sha(`${VERSION}:${VIDEO_VOICE}:${text}`)}`;

const exists = (key: string) => readObject(key).then(() => true, () => false);

export type VideoVoiceStatus =
  | { ready: true; url: string; seconds: number; times: number[] }
  | { ready: false; done: number; total: number; error?: string };

/** Erros recentes (não tenta de novo a cada segundo com a mesma chave sem cota). */
const failed = new Map<string, { error: string; at: number }>();
const jobs = new Map<string, Promise<void>>();

/** Situação da voz de uma aula: pronta (com o endereço do áudio e o tempo de cada palavra) ou quantos pedaços faltam. */
export async function videoVoiceStatus(topicId: string): Promise<VideoVoiceStatus | null> {
  const p = plan(topicId);
  if (!p) return null;
  try {
    const meta = JSON.parse((await readObject(`${p.key}.json`)).toString()) as { seconds: number; times: number[] };
    return { ready: true, url: `/api/aulas/video-voz/audio?aula=${encodeURIComponent(topicId)}&v=${p.id}`, ...meta };
  } catch {}
  let done = 0;
  for (const b of p.blocks) if (await exists(`${blockKey(b)}.json`)) done++;
  const f = failed.get(topicId);
  const error = f && Date.now() - f.at < 10 * 60_000 && !jobs.has(topicId) ? f.error : undefined;
  return { ready: false, done, total: p.blocks.length, ...(error ? { error } : {}) };
}

/** O MP3 pronto da aula (para tocar). */
export async function videoVoiceAudio(topicId: string, v: string): Promise<Buffer | null> {
  const p = plan(topicId);
  if (!p || p.id !== v) return null;
  return readObject(`${p.key}.mp3`).catch(() => null);
}

/** Grava um pedaço de texto e devolve o áudio (PCM 16 bits mono). */
type Speaker = (text: string) => Promise<{ pcm: Buffer; rate: number }>;

/** Começa a gravar a voz da aula (se já não estiver gravando). */
export function recordVideoVoice(topicId: string, speaker: Speaker): Promise<void> {
  let job = jobs.get(topicId);
  if (!job) {
    failed.delete(topicId);
    job = record(topicId, speaker)
      .catch((e) => {
        failed.set(topicId, { error: (e as Error).message, at: Date.now() });
        throw e;
      })
      .finally(() => jobs.delete(topicId));
    jobs.set(topicId, job);
  }
  return job;
}

async function record(topicId: string, speaker: Speaker) {
  const p = plan(topicId);
  if (!p) return;
  if (await exists(`${p.key}.json`)) return;
  for (const b of p.blocks) {
    if (await exists(`${blockKey(b)}.json`)) continue;
    const { pcm, rate } = await speaker(b);
    const clean = cleanPcm(pcm, rate);
    const mp3 = await toMp3(Buffer.concat([clean, Buffer.alloc(Math.round(rate * GAP_S) * 2)]), rate);
    // o .json por último: ele marca que o pedaço está completo
    await writeObject(`${blockKey(b)}.mp3`, mp3, "audio/mpeg");
    await writeObject(`${blockKey(b)}.json`, Buffer.from(JSON.stringify({ levels: packLevels(frameLevels(clean, rate)), rate })), "application/json");
  }
  // todos os pedaços prontos: junta num áudio só e calcula o momento de cada palavra da aula
  const mp3s: Buffer[] = [];
  const times: number[] = [];
  let offset = 0;
  for (const b of p.blocks) {
    const mp3 = await readObject(`${blockKey(b)}.mp3`);
    const meta = JSON.parse((await readObject(`${blockKey(b)}.json`)).toString()) as { levels: string; rate: number };
    const words = splitWords(b.replace(/\n/g, " ")).length;
    const local = alignLevels(unpackLevels(meta.levels), b);
    const secs = mp3Duration(mp3);
    const delay = MP3_START_DELAY_SAMPLES / (meta.rate || RATE);
    for (let k = 0; k < words; k++) times.push(Math.round((offset + delay + (local && local.length === words ? local[k] : (k / words) * (secs - GAP_S))) * 100) / 100);
    mp3s.push(mp3);
    offset += secs;
  }
  // confere: o número de palavras tem que bater com o texto dos slides
  const expected = p.parts.reduce((n, part) => n + splitWords(part).length, 0);
  if (expected !== times.length) throw new Error(`palavras não batem (${times.length} de ${expected})`);
  await writeObject(`${p.key}.mp3`, Buffer.concat(mp3s), "audio/mpeg"); // e o .json (que marca "pronta") depois
  await writeObject(`${p.key}.json`, Buffer.from(JSON.stringify({ seconds: Math.round(offset * 100) / 100, times })), "application/json");
  console.log(`[voz do vídeo] ${topicId} gravada (${Math.round(offset)} s)`);
}

/**
 * PCM → MP3 (48 kbps, igual ao do robô) em pedacinhos, dando a vez para o resto do site a cada pedaço:
 * gravar a voz de uma aula nunca deixa o site lento para quem está usando.
 */
async function toMp3(pcm: Buffer, rate: number): Promise<Buffer> {
  const samples = new Int16Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.length - (pcm.length % 2)));
  const enc = new Mp3Encoder(1, rate, 48);
  const out: Uint8Array[] = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const b = enc.encodeBuffer(samples.subarray(i, i + 1152));
    if (b.length) out.push(b);
    if ((i / 1152) % 150 === 149) await new Promise((r) => setImmediate(r));
  }
  out.push(enc.flush());
  return Buffer.concat(out.map((b) => Buffer.from(b.buffer, b.byteOffset, b.length)));
}

const modelsFor = new Map<string, string[]>();
async function ttsModels(key: string) {
  const hit = modelsFor.get(key);
  if (hit) return hit;
  let names: string[] = [];
  try {
    const res = await fetch(`${GEMINI_API}/models?pageSize=200`, { headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) names = (((await res.json()) as { models?: { name?: string }[] }).models ?? []).flatMap((m) => (m.name ? [m.name.replace(/^models\//, "")] : []));
  } catch {}
  const models = [...new Set([...rankTtsModels(names), "gemini-2.5-flash-preview-tts"])].slice(0, 3);
  modelsFor.set(key, models);
  return models;
}

/** Fala de teste (modo sem IA): um "bip" por palavra, com pausas nas vírgulas e pontos. */
export const mockSpeaker: Speaker = async (text) => ({ pcm: mockPcm(text), rate: RATE });
function mockPcm(text: string) {
  const out: Buffer[] = [];
  for (const m of text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)) {
    const len = Math.round(RATE * (0.06 + m[0].length * 0.03));
    const b = Buffer.alloc(len * 2);
    for (let i = 0; i < len; i++) b.writeInt16LE(Math.round(4000 * Math.sin(i / 4)), i * 2);
    const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 2);
    out.push(b, Buffer.alloc(Math.round(RATE * (/[.!?]/.test(after) ? 0.35 : /[,;:]/.test(after) ? 0.18 : 0.04)) * 2));
  }
  return Buffer.concat(out);
}

/**
 * Grava um pedaço com a voz do Gemini, sempre em português do Brasil. Confere se o tamanho do áudio combina com o
 * tamanho do texto (a voz às vezes pula ou repete um trecho): se não combinar, grava de novo.
 */
const geminiSpeaker = (key: string): Speaker => (text) => speakGemini(key, text);
async function speakGemini(key: string, text: string): Promise<{ pcm: Buffer; rate: number }> {
  if (isMockAi()) return { pcm: mockPcm(text), rate: RATE };
  const errors: string[] = [];
  for (const model of await ttsModels(key)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(`${GEMINI_API}/models/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { languageCode: "pt-BR", voiceConfig: { prebuiltVoiceConfig: { voiceName: VIDEO_VOICE } } } },
        }),
        signal: AbortSignal.timeout(180_000),
      }).catch((e: Error) => new Response(JSON.stringify({ error: { message: e.message } }), { status: 599 }));
      if (res.status === 429) {
        const q = parseQuota((await res.json().catch(() => ({}))) as Parameters<typeof parseQuota>[0]);
        throw new AiQuotaError("A voz do Gemini chegou ao limite grátis por agora.", q.retryAt, q.daily);
      }
      if (!res.ok) {
        errors.push(`${model}: ${res.status} ${((await res.json().catch(() => ({}))) as { error?: { message?: string } }).error?.message ?? ""}`);
        break;
      }
      const body = (await res.json()) as { candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[] };
      const part = body.candidates?.[0]?.content?.parts?.find((x) => x.inlineData?.data)?.inlineData;
      if (!part?.data) {
        errors.push(`${model}: sem áudio`);
        continue;
      }
      const rate = Number(part.mimeType?.match(/rate=(\d+)/)?.[1]) || RATE;
      const pcm = Buffer.from(part.data, "base64");
      const perSecond = text.length / (pcm.length / 2 / rate);
      if (perSecond > 6 && perSecond < 32) return { pcm, rate };
      errors.push(`${model}: áudio fora do tamanho esperado (${perSecond.toFixed(1)} letras/s)`);
    }
  }
  throw new Error(`A voz do Gemini não gravou: ${errors.join(" | ")}`);
}

// ---------- Google Cloud Text-to-Speech (Chirp 3 HD) ----------
const cloudKey = () => process.env.GOOGLE_TTS_API_KEY?.trim() || "";
export const CLOUD_VOICE = "pt-BR-Chirp3-HD-Kore";
/** Trava: no máximo tantas letras por mês (o grátis do Google é 1 milhão). Chegou nela, continua no mês seguinte. */
const monthCap = () => Number(process.env.GOOGLE_TTS_MAX_CHARS_MONTH) || 985_000;
export class MonthCapError extends Error {}
const usageKey = () => `video-voz/uso-${new Date().toISOString().slice(0, 7)}.json`;
/** Letras já enviadas ao Google neste mês (todas as tentativas contam: o Google cobra cada pedido). */
export const monthUsage = () => readObject(usageKey()).then((b) => (JSON.parse(b.toString()) as { chars: number }).chars, () => 0);
let usageChain: Promise<unknown> = Promise.resolve();
/** Reserva as letras de um pedido antes de mandar (um de cada vez, para a conta nunca passar da trava). */
function reserve(chars: number): Promise<void> {
  const job = usageChain.then(async () => {
    const used = await monthUsage();
    if (used + chars > monthCap()) throw new MonthCapError(`Trava do mês: ${used.toLocaleString("pt-BR")} letras já usadas (limite ${monthCap().toLocaleString("pt-BR")}). Continua no mês que vem.`);
    await writeObject(usageKey(), Buffer.from(JSON.stringify({ chars: used + chars })), "application/json");
  });
  usageChain = job.catch(() => {});
  return job;
}

/** WAV (o que o Google devolve em LINEAR16) → PCM e taxa. */
export function fromWav(wav: Buffer): { pcm: Buffer; rate: number } {
  if (wav.toString("ascii", 0, 4) !== "RIFF") return { pcm: wav, rate: RATE };
  let rate = RATE;
  for (let off = 12; off + 8 <= wav.length; ) {
    const id = wav.toString("ascii", off, off + 4);
    const size = wav.readUInt32LE(off + 4);
    if (id === "fmt ") rate = wav.readUInt32LE(off + 12);
    if (id === "data") return { pcm: wav.subarray(off + 8, Math.min(wav.length, off + 8 + size)), rate };
    off += 8 + size + (size % 2);
  }
  return { pcm: wav.subarray(44), rate };
}

const okLength = (text: string, pcm: Buffer, rate: number) => {
  const perSecond = text.length / (pcm.length / 2 / rate);
  return perSecond > 6 && perSecond < 32;
};

export const cloudSpeaker: Speaker = async (text) => {
  if (isMockAi()) return { pcm: mockPcm(text), rate: RATE };
  let last = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    await reserve(text.length);
    const res = await fetch(`${process.env.GOOGLE_TTS_API_BASE || "https://texttospeech.googleapis.com"}/v1/text:synthesize`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": cloudKey() },
      body: JSON.stringify({ input: { text }, voice: { languageCode: "pt-BR", name: CLOUD_VOICE }, audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: RATE } }),
      signal: AbortSignal.timeout(120_000),
    }).catch((e: Error) => new Response(JSON.stringify({ error: { message: e.message } }), { status: 599 }));
    const body = (await res.json().catch(() => ({}))) as { audioContent?: string; error?: { message?: string } };
    if (!res.ok || !body.audioContent) throw new Error(`Google Cloud (voz): ${res.status} ${body.error?.message ?? "sem áudio"}`);
    const { pcm, rate } = fromWav(Buffer.from(body.audioContent, "base64"));
    if (okLength(text, pcm, rate)) return { pcm, rate };
    last = "áudio fora do tamanho esperado";
  }
  throw new Error(`Google Cloud (voz): ${last}`);
};

/** As aulas na ordem de gravação: a 1ª de cada matéria, depois a 2ª... (as mais vistas ficam prontas primeiro). */
function lessonOrder() {
  const out: string[] = [];
  const longest = Math.max(...MATERIAS.map((m) => m.lessons.length));
  for (let li = 0; li < longest; li++) for (const m of MATERIAS) if (m.lessons[li]) out.push(lessonTopicId(m.slug, li));
  return out;
}

/**
 * Fábrica (no processo do site): grava as aulas que ainda não têm voz. Com a chave do Google Cloud, grava todas de
 * uma vez (4 ao mesmo tempo), parando na trava do mês. Sem ela, usa a chave do Gemini do admin, aos poucos.
 * Nunca apaga nada; aula já gravada é pulada.
 */
export async function videoVoiceFactory() {
  await sleep(isMockAi() ? 1000 : 60_000); // deixa o servidor terminar de subir
  for (;;) {
    const pending: string[] = [];
    for (const id of lessonOrder()) {
      const s = await videoVoiceStatus(id);
      if (s && !s.ready) pending.push(id);
    }
    if (!pending.length) {
      await sleep(6 * 3600_000);
      continue;
    }
    if (cloudKey() || isMockAi()) {
      let capped = false;
      let made = 0;
      let next = 0;
      const worker = async () => {
        while (!capped && next < pending.length) {
          const id = pending[next++];
          try {
            await recordVideoVoice(id, cloudSpeaker);
            made++;
          } catch (e) {
            if (e instanceof MonthCapError) capped = true;
            console.warn(`[voz das aulas] ${id}: ${(e as Error).message}`);
          }
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      console.log(`[voz das aulas] ${made} aula(s) gravada(s) com o Google Cloud${capped ? " (parou na trava do mês)" : ""}`);
      await sleep(capped ? 6 * 3600_000 : 15 * 60_000);
      continue;
    }
    // sem a chave do Google Cloud: chave do Gemini do admin, aos poucos (limite grátis por minuto e por dia)
    const admin = await db.user.findFirst({ where: { isAdmin: true, geminiKey: { not: null } }, select: { id: true }, orderBy: { createdAt: "asc" } }).catch(() => null);
    const key = admin ? await userGeminiKey(admin.id).catch(() => null) : null;
    if (!key) {
      await sleep(3600_000);
      continue;
    }
    try {
      for (const id of pending) {
        if (cloudKey()) break; // a chave do Google Cloud chegou: a próxima volta grava tudo de uma vez
        await recordVideoVoice(id, geminiSpeaker(key));
        await sleep(25_000);
      }
    } catch (e) {
      console.warn(`[voz das aulas] fábrica (Gemini) parou: ${(e as Error).message}`);
      const retry = e instanceof AiQuotaError ? Math.max(15 * 60_000, e.retryAt.getTime() - Date.now()) : 15 * 60_000;
      await sleep(Math.min(retry, 6 * 3600_000));
      continue;
    }
    await sleep(60_000);
  }
}

/** Para o admin: quantas aulas já têm a voz do vídeo gravada. */
export async function videoVoiceProgress() {
  let ready = 0;
  let total = 0;
  for (const m of MATERIAS)
    for (let i = 0; i < m.lessons.length; i++) {
      total++;
      const p = plan(lessonTopicId(m.slug, i));
      if (p && (await exists(`${p.key}.json`))) ready++;
    }
  return { ready, total };
}

/** Teste do admin: grava uma frase curta (não guarda) e diz quantos segundos deu e com qual serviço. */
export async function testVideoVoice(userId: string) {
  const text = "Olá! Esta é a voz das aulas do Eduvia.";
  const cloud = !!cloudKey();
  const { pcm, rate } = cloud ? await cloudSpeaker(text) : await speakGemini(await userGeminiKey(userId), text);
  return { seconds: Math.round((pcm.length / 2 / rate) * 10) / 10, via: cloud ? `Google Cloud (${CLOUD_VOICE})` : `Gemini (${VIDEO_VOICE}, chave do admin)` };
}
