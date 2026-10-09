// Voz do robô: Piper (código aberto), rodando no próprio servidor. Grátis, sem limite e sempre em português.
// O programa e a voz vêm instalados no deploy (vendor/piper, via scripts/setup-piper.ts); se faltar,
// são baixados uma vez para o disco. O Piper fica LIGADO (um processo só, com a voz carregada): cada
// frase sai em menos de 1 segundo, sem carregar a voz de novo a cada pedido.
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createWriteStream } from "node:fs";
import { access, chmod, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const PIPER_URL = "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz";
/** Vozes em português do Brasil, da melhor para a mais simples (se a melhor não baixar, usa a próxima). */
const VOICES = [
  {
    id: "pt_BR-faber-medium",
    files: [
      "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx",
      "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json",
    ],
  },
  { id: "pt-br-edresson-low", tarball: "https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-pt-br-edresson-low.tar.gz" },
] as const;
/** Fala um pouco mais devagar que o normal do Piper: mais pausada e fácil de acompanhar. */
const LENGTH_SCALE = process.env.PIPER_LENGTH_SCALE || "1.1";
/** Tempo máximo de uma frase: passou disso, o Piper é reiniciado (nunca trava a fila). */
const LINE_TIMEOUT_MS = 45_000;

/** Pasta instalada no deploy (dentro do app). */
export const vendorPiperDir = () => path.resolve(/*turbopackIgnore: true*/ process.cwd(), "vendor/piper");
/** Pasta de reserva no disco (se o deploy não conseguiu instalar). */
export const piperDir = () =>
  path.resolve(
    /*turbopackIgnore: true*/ process.env.PIPER_DIR || path.join(path.dirname(process.env.STORAGE_LOCAL_DIR || ".data/uploads"), "piper"),
  );

const exists = (p: string) =>
  access(p).then(
    () => true,
    () => false,
  );

async function download(url: string, to: string) {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10 * 60_000) });
  if (!res.ok || !res.body) throw new Error(`download ${res.status} ${url}`);
  const tmp = `${to}.part`;
  await pipeline(Readable.fromWeb(res.body as import("node:stream/web").ReadableStream), createWriteStream(tmp));
  await rename(tmp, to);
}

function run(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(/*turbopackIgnore: true*/ cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err = (err + d).slice(-2000)));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} saiu com ${code}: ${err}`))));
  });
}

/** Instala o programa e uma voz numa pasta (usado no deploy e, se faltar, na primeira vez). */
export async function installPiper(dir: string): Promise<{ bin: string; model: string; voice: string }> {
  await mkdir(dir, { recursive: true });
  const bin = path.join(dir, "piper", "piper");
  if (!(await exists(bin))) {
    const tgz = path.join(dir, "piper.tar.gz");
    await download(PIPER_URL, tgz);
    await run("tar", ["xzf", tgz, "-C", dir]);
    await rm(tgz, { force: true });
    await chmod(bin, 0o755);
  }
  const errors: string[] = [];
  for (const v of VOICES) {
    const vdir = path.join(dir, "voices", v.id);
    const model = path.join(vdir, `${v.id}.onnx`);
    if (await exists(path.join(vdir, "ok"))) return { bin, model, voice: v.id };
    try {
      await mkdir(vdir, { recursive: true });
      if ("tarball" in v) {
        const tgz = path.join(vdir, "voice.tar.gz");
        await download(v.tarball, tgz);
        await run("tar", ["xzf", tgz, "-C", vdir]);
        await rm(tgz, { force: true });
      } else {
        for (const url of v.files) await download(url, path.join(vdir, path.basename(url)));
      }
      if (!(await exists(model)) || !(await exists(`${model}.json`))) throw new Error("arquivos da voz incompletos");
      await writeFile(path.join(vdir, "ok"), new Date().toISOString());
      console.log(`[voz] Piper pronto com a voz ${v.id} em ${dir}`);
      return { bin, model, voice: v.id };
    } catch (e) {
      errors.push(`${v.id}: ${(e as Error).message}`);
    }
  }
  throw new Error(`nenhuma voz do Piper baixou: ${errors.join(" | ")}`);
}

let installing: Promise<{ bin: string; model: string; voice: string }> | null = null;

/** Garante o Piper: o do deploy (vendor/piper) ou, se não houver, baixa uma vez para o disco. */
export function ensurePiper() {
  installing ??= (async () => {
    const vendor = vendorPiperDir();
    if (await exists(path.join(vendor, "piper", "piper"))) {
      for (const v of VOICES) {
        const model = path.join(vendor, "voices", v.id, `${v.id}.onnx`);
        if (await exists(path.join(vendor, "voices", v.id, "ok"))) return { bin: path.join(vendor, "piper", "piper"), model, voice: v.id };
      }
    }
    return installPiper(piperDir());
  })().catch((e) => {
    installing = null; // tenta de novo na próxima vez
    throw e;
  });
  return installing;
}

/** WAV (PCM 16 bits mono) → amostras e taxa. */
export function readWav(buf: Buffer): { pcm: Buffer; rate: number } {
  let rate = 22050;
  let off = 12;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === "fmt ") rate = buf.readUInt32LE(off + 12);
    if (id === "data") return { pcm: buf.subarray(off + 8, Math.min(buf.length, off + 8 + size)), rate };
    off += 8 + size + (size % 2);
  }
  throw new Error("WAV sem áudio");
}

// ───────────── Piper ligado (um processo só) ─────────────

type Waiting = { file: string; resolve: () => void; reject: (e: Error) => void; timer: NodeJS.Timeout };
let proc: ChildProcessWithoutNullStreams | null = null;
let starting: Promise<ChildProcessWithoutNullStreams> | null = null;
const waiting: Waiting[] = [];
let lastError: string | null = null;

function stop(reason: string) {
  lastError = reason;
  const p = proc;
  proc = null;
  starting = null;
  for (const w of waiting.splice(0)) {
    clearTimeout(w.timer);
    w.reject(new Error(reason));
  }
  p?.kill("SIGKILL");
}

async function start(): Promise<ChildProcessWithoutNullStreams> {
  if (proc) return proc;
  starting ??= (async () => {
    const { bin, model } = await ensurePiper();
    const pdir = path.dirname(bin);
    const env = { ...process.env, LD_LIBRARY_PATH: [pdir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":") };
    const args = ["--model", model, "--json-input", "--length_scale", LENGTH_SCALE, "--espeak_data", path.join(pdir, "espeak-ng-data")];
    // stdbuf: o Piper avisa (uma linha) assim que cada frase fica pronta; nice: o site responde primeiro
    const tryCmds: [string, string[]][] = [
      ["nice", ["-n", "10", "stdbuf", "-oL", bin, ...args]],
      ["stdbuf", ["-oL", bin, ...args]],
    ];
    let child: ChildProcessWithoutNullStreams | null = null;
    for (const [cmd, a] of tryCmds) {
      const c = spawn(/*turbopackIgnore: true*/ cmd, a, { env });
      const ok = await new Promise<boolean>((res) => {
        c.once("error", () => res(false));
        c.once("spawn", () => res(true));
      });
      if (ok) {
        child = c;
        break;
      }
    }
    if (!child) throw new Error("não foi possível iniciar o Piper (stdbuf/nice ausentes)");
    let buf = "";
    child.stdout.on("data", (d: Buffer) => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        const k = waiting.findIndex((w) => w.file === line);
        if (k >= 0) {
          const [w] = waiting.splice(k, 1);
          clearTimeout(w.timer);
          w.resolve();
        }
      }
    });
    let err = "";
    child.stderr.on("data", (d: Buffer) => (err = (err + d).slice(-2000)));
    child.on("close", (code) => {
      if (proc === child) stop(`Piper parou (código ${code}): ${err.slice(-300)}`);
    });
    child.stdin.on("error", () => {});
    proc = child;
    return child;
  })().catch((e) => {
    starting = null;
    lastError = (e as Error).message;
    throw e;
  });
  return starting;
}

/** Fala uma frase e espera o arquivo WAV ficar pronto. */
async function speakLine(text: string, file: string) {
  const p = await start();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => stop("Piper demorou demais numa frase; reiniciando"), LINE_TIMEOUT_MS);
    waiting.push({ file, resolve, reject, timer });
    p.stdin.write(JSON.stringify({ text, output_file: file }) + "\n");
  });
}

// Fila do Piper (ele fala uma coisa de cada vez): quem está esperando para ouvir ("alta") passa na frente
// do áudio preparado em segundo plano ("baixa"). Um pedido igual que já está na fila é reaproveitado.
export type Priority = "high" | "low";
type Job = { key: string; lines: string[]; priority: Priority; waiters: { resolve: (r: Spoken) => void; reject: (e: Error) => void }[] };
type Spoken = { rate: number; pcms: Buffer[] };
const pending: Job[] = [];
let working = false;

async function synth(lines: string[]): Promise<Spoken> {
  const out = await mkdtemp(path.join(tmpdir(), "voz-"));
  try {
    let rate = 22050;
    const pcms: Buffer[] = [];
    for (const [i, line] of lines.entries()) {
      const file = path.join(out, `${i}.wav`);
      try {
        await speakLine(line, file);
      } catch {
        await speakLine(line, file); // o Piper reiniciou: tenta a frase mais uma vez
      }
      const wav = readWav(await readFile(file));
      rate = wav.rate;
      pcms.push(Buffer.from(wav.pcm));
    }
    return { rate, pcms };
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}

async function work() {
  if (working) return;
  working = true;
  try {
    while (pending.length) {
      const i = pending.findIndex((j) => j.priority === "high");
      const [job] = pending.splice(i >= 0 ? i : 0, 1);
      try {
        const r = await synth(job.lines);
        job.waiters.forEach((w) => w.resolve(r));
      } catch (e) {
        job.waiters.forEach((w) => w.reject(e as Error));
      }
    }
  } finally {
    working = false;
  }
}

/** Fala cada linha separadamente (uma frase por linha) e devolve o áudio de cada uma. */
let lastHighAt = 0;
/** Alguém pediu áudio para ouvir agora há pouco? (o pré-preparo em segundo plano espera a vez) */
export const piperRecentlyUsed = (ms = 90_000) => Date.now() - lastHighAt < ms;

export function piperSpeak(lines: string[], priority: Priority = "high"): Promise<Spoken> {
  const key = lines.join("\n");
  if (priority === "high") lastHighAt = Date.now();
  return new Promise<Spoken>((resolve, reject) => {
    const same = pending.find((j) => j.key === key);
    if (same) {
      same.waiters.push({ resolve, reject });
      if (priority === "high") same.priority = "high";
    } else pending.push({ key, lines, priority, waiters: [{ resolve, reject }] });
    void work();
  });
}

/** Quantos pedidos estão esperando na fila do Piper (o pré-preparo em segundo plano espera a fila esvaziar). */
export const piperBusy = () => pending.length > 0 || working;

/** Situação da voz (para o painel do admin). */
export async function piperStatus() {
  const t0 = Date.now();
  try {
    const { voice } = await ensurePiper();
    const { pcms, rate } = await piperSpeak(["Olá! A voz do Eduvia está funcionando."]);
    return { ok: true as const, voice, ms: Date.now() - t0, seconds: Math.round((pcms[0].length / 2 / rate) * 10) / 10 };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message, lastError };
  }
}
