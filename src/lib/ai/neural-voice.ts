// Voz do MODO VÍDEO: vozes neurais em português do Brasil (Francisca e Antônio), as mesmas do "Ler em voz alta"
// do navegador Edge. Grátis e sem chave. Bem mais natural que o robô (Piper), que continua no "Ler e ouvir".
// O serviço também diz o momento exato de cada palavra: a legenda e o texto do slide acompanham a fala.
// Cada trecho fica guardado (tts/): a mesma aula não é pedida de novo. Se o serviço falhar, o vídeo usa o robô.
import { createHash, randomBytes, randomUUID } from "node:crypto";
import WebSocket from "ws";
import { Mp3Encoder } from "@breezystack/lamejs";
import { readObject, writeObject } from "@/lib/storage";
import { mp3Duration, type Spoken } from "@/lib/ai/tts";

export type VideoVoice = "f" | "m";
export const VIDEO_VOICES: Record<VideoVoice, { id: string; name: string }> = {
  f: { id: "pt-BR-FranciscaNeural", name: "Francisca" },
  m: { id: "pt-BR-AntonioNeural", name: "Antônio" },
};

const CACHE_VERSION = "nv1";
const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WSS = () => process.env.EDGE_TTS_URL || "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const GEC_VERSION = () => process.env.EDGE_TTS_VERSION || "1-130.0.2849.68";
const TIMEOUT_MS = 30_000;
/** Um pouquinho mais devagar que o normal: aula, não notícia. */
const RATE = "-4%";
/** Pausa no fim de cada trecho (o próximo emenda sem atropelar). */
const TAIL_PAUSE_S = 0.35;
/** Poucos pedidos ao mesmo tempo (educado com o serviço e leve para o servidor). */
const MAX_PARALLEL = 4;

/** Diferença entre o relógio do servidor e o do serviço (o token depende da hora certa). */
let skewSeconds = 0;

/** Token de acesso do serviço: hash da hora (arredondada a 5 min, contada desde 1601) com o token público. */
export function secMsGec(nowMs = Date.now()) {
  let ticks = nowMs / 1000 + skewSeconds + 11644473600;
  ticks -= ticks % 300;
  return createHash("sha256").update(`${(ticks * 1e7).toFixed(0)}${TRUSTED_CLIENT_TOKEN}`).digest("hex").toUpperCase();
}

const escapeXml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Uma frase por linha; linha sem pontuação no fim (título) ganha um ponto, para a voz fazer a pausa. */
export function voiceText(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/[.!?;:…]["”')\]]*$/.test(l) ? l : `${l}.`))
    .join("\n");
}

/** Mensagem binária do serviço: 2 bytes com o tamanho do cabeçalho, o cabeçalho e o pedaço de MP3. */
export function parseAudioFrame(data: Buffer): Buffer | null {
  if (data.length < 2) return null;
  const len = data.readUInt16BE(0);
  const head = data.subarray(2, 2 + len).toString();
  if (!/Path:audio\r?\n/.test(head)) return null;
  const audio = data.subarray(2 + len);
  return audio.length ? audio : null;
}

/** Mensagem de texto do serviço: cabeçalhos ("Path:...") e o corpo. */
export function parseTextFrame(text: string): { path: string; body: string } {
  const at = text.indexOf("\r\n\r\n");
  const head = at < 0 ? text : text.slice(0, at);
  return { path: /Path:([^\r\n]+)/.exec(head)?.[1]?.trim() ?? "", body: at < 0 ? "" : text.slice(at + 4) };
}

const norm = (w: string) => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Momento (s) de cada palavra do texto (do mesmo jeito que o app conta as palavras), a partir das palavras que o
 * serviço avisou. Palavra que não bate (número lido por extenso, sigla...) fica entre as vizinhas.
 */
export function alignBoundaries(text: string, marks: { t: number; text: string }[], total: number): number[] {
  const words = [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)].map((m) => norm(m[0]));
  const out: (number | null)[] = new Array(words.length).fill(null);
  let j = 0;
  for (let i = 0; i < words.length && j < marks.length; i++) {
    const w = words[i];
    if (!w) continue;
    // procura a palavra entre as próximas avisadas (pula as que o serviço juntou ou separou diferente)
    for (let k = j; k < Math.min(marks.length, j + 4); k++) {
      const m = norm(marks[k].text);
      if (m && (m === w || m.startsWith(w) || w.startsWith(m))) {
        out[i] = marks[k].t;
        j = k + 1;
        break;
      }
    }
  }
  // as que ficaram sem tempo: entre a anterior e a próxima conhecidas
  const times: number[] = [];
  for (let i = 0; i < out.length; i++) {
    if (out[i] !== null) {
      times.push(out[i]!);
      continue;
    }
    const prev = times[i - 1] ?? 0;
    let n = i + 1;
    while (n < out.length && out[n] === null) n++;
    const next = n < out.length ? out[n]! : total;
    times.push(prev + (next - prev) / (n - i + 1));
  }
  return times.map((t) => Math.round(t * 100) / 100);
}

/** Silêncio em MP3 no mesmo formato da voz (24 kHz, 48 kbps, mono): emenda direto no fim do trecho. */
function silenceMp3(seconds: number) {
  const rate = 24000;
  const enc = new Mp3Encoder(1, rate, 48);
  const samples = new Int16Array(Math.round(rate * seconds));
  const out: Uint8Array[] = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const b = enc.encodeBuffer(samples.subarray(i, i + 1152));
    if (b.length) out.push(b);
  }
  out.push(enc.flush());
  return Buffer.concat(out.map((b) => Buffer.from(b.buffer, b.byteOffset, b.length)));
}

let running = 0;
const waiting: (() => void)[] = [];
async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  running++;
  try {
    return await fn();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

const stamp = () => new Date().toUTCString().replace("GMT", "GMT+0000 (Coordinated Universal Time)");

/** Pede a fala ao serviço: devolve o MP3 e as palavras com o momento de cada uma (em segundos). */
function synthesize(text: string, voice: VideoVoice): Promise<{ mp3: Buffer; marks: { t: number; text: string }[] }> {
  return new Promise((resolve, reject) => {
    const url = `${WSS()}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${randomUUID().replace(/-/g, "")}&Sec-MS-GEC=${secMsGec()}&Sec-MS-GEC-Version=${GEC_VERSION()}`;
    const ws = new WebSocket(url, {
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: `muid=${randomBytes(16).toString("hex").toUpperCase()};`,
      },
    });
    const audio: Buffer[] = [];
    const marks: { t: number; text: string }[] = [];
    let done = false;
    const finish = (err?: Error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      ws.removeAllListeners();
      ws.on("error", () => {});
      ws.terminate();
      if (err) reject(err);
      else if (!audio.length) reject(new Error("a voz do vídeo não mandou áudio"));
      else resolve({ mp3: Buffer.concat(audio), marks });
    };
    const timer = setTimeout(() => finish(new Error("a voz do vídeo demorou demais")), TIMEOUT_MS);
    ws.on("unexpected-response", (_req, res) => {
      // 403: o relógio do servidor está diferente do serviço; acerta pela hora que ele mandou e tenta de novo
      const date = Date.parse(String(res.headers.date ?? ""));
      if (res.statusCode === 403 && date) skewSeconds = (date - Date.now()) / 1000;
      finish(new Error(`a voz do vídeo recusou (${res.statusCode})`));
    });
    ws.on("error", (e) => finish(e instanceof Error ? e : new Error(String(e))));
    ws.on("close", () => finish(new Error("a voz do vídeo fechou a conexão antes de terminar")));
    ws.on("open", () => {
      ws.send(
        `X-Timestamp:${stamp()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
          `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`,
      );
      const name = `Microsoft Server Speech Text to Speech Voice (pt-BR, ${VIDEO_VOICES[voice].id.replace("pt-BR-", "")})`;
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'><voice name='${name}'><prosody pitch='+0Hz' rate='${RATE}' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
      ws.send(`X-RequestId:${randomUUID().replace(/-/g, "")}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp()}Z\r\nPath:ssml\r\n\r\n${ssml}`);
    });
    ws.on("message", (data, isBinary) => {
      if (isBinary) {
        const chunk = parseAudioFrame(Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer));
        if (chunk) audio.push(chunk);
        return;
      }
      const { path, body } = parseTextFrame(data.toString());
      if (path === "audio.metadata") {
        try {
          for (const m of (JSON.parse(body) as { Metadata?: { Type: string; Data: { Offset: number; text?: { Text?: string } } }[] }).Metadata ?? []) {
            if (m.Type === "WordBoundary" && m.Data.text?.Text) marks.push({ t: m.Data.Offset / 1e7, text: m.Data.text.Text });
          }
        } catch {}
      } else if (path === "turn.end") finish();
    });
  });
}

const inflight = new Map<string, Promise<Spoken>>();

/** Áudio (MP3) de um trecho com a voz do vídeo e o momento de cada palavra. Guardado: a 2ª vez é instantânea. */
export function neuralSpeak(text: string, voice: VideoVoice): Promise<Spoken> {
  const clean = voiceText(text);
  const hash = createHash("sha256").update(`${CACHE_VERSION}:${voice}:${clean}`).digest("hex");
  let job = inflight.get(hash);
  if (!job) {
    job = speakNow(clean, hash, voice).finally(() => inflight.delete(hash));
    inflight.set(hash, job);
  }
  return job;
}

async function speakNow(clean: string, hash: string, voice: VideoVoice): Promise<Spoken> {
  const mp3Key = `tts/${CACHE_VERSION}-${hash}.mp3`;
  const timesKey = `tts/${CACHE_VERSION}-${hash}.json`;
  try {
    const [mp3, meta] = await Promise.all([readObject(mp3Key), readObject(timesKey)]);
    return { mp3, times: (JSON.parse(meta.toString()) as { times: number[] }).times };
  } catch {}
  let r: Awaited<ReturnType<typeof synthesize>> | null = null;
  let last: Error | null = null;
  for (let attempt = 0; attempt < 2 && !r; attempt++) {
    try {
      r = await slot(() => synthesize(clean, voice));
    } catch (e) {
      last = e as Error;
    }
  }
  if (!r) throw last ?? new Error("a voz do vídeo não respondeu");
  const speech = mp3Duration(r.mp3);
  const times = alignBoundaries(clean, r.marks, speech);
  const mp3 = Buffer.concat([r.mp3, silenceMp3(TAIL_PAUSE_S)]);
  await writeObject(mp3Key, mp3, "audio/mpeg").catch(() => {});
  await writeObject(timesKey, Buffer.from(JSON.stringify({ times })), "application/json").catch(() => {});
  return { mp3, times };
}
