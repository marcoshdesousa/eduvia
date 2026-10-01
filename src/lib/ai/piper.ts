// Voz do robô: Piper (código aberto), rodando no próprio servidor. Grátis, sem limite e sempre em português.
// O programa e a voz são baixados uma vez para o disco do servidor (na primeira vez que precisar).
import { spawn } from "node:child_process";
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

function run(cmd: string, args: string[], opts: { input?: string; cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, env: opts.env ?? process.env, stdio: ["pipe", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err = (err + d).slice(-4000)));
    child.stdout.on("data", () => {});
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(err) : reject(new Error(`${cmd} saiu com ${code}: ${err.slice(-800)}`))));
    child.stdin.end(opts.input ?? "");
  });
}

let installing: Promise<{ bin: string; model: string }> | null = null;

/** Garante o programa e uma voz no disco (baixa só na primeira vez). */
export function ensurePiper() {
  installing ??= install().catch((e) => {
    installing = null; // tenta de novo na próxima vez
    throw e;
  });
  return installing;
}

async function install() {
  const dir = piperDir();
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
    if (await exists(path.join(vdir, "ok"))) return { bin, model };
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
      console.log(`[voz] Piper pronto com a voz ${v.id}`);
      return { bin, model };
    } catch (e) {
      errors.push(`${v.id}: ${(e as Error).message}`);
    }
  }
  throw new Error(`nenhuma voz do Piper baixou: ${errors.join(" | ")}`);
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

// um áudio de cada vez: o servidor tem pouca CPU e o site precisa continuar rápido
let queue: Promise<unknown> = Promise.resolve();

/** Fala cada linha separadamente (uma frase por linha) e devolve o áudio de cada uma. */
export function piperSpeak(lines: string[]): Promise<{ rate: number; pcms: Buffer[] }> {
  const job = queue.then(async () => {
    const { bin, model } = await ensurePiper();
    const out = await mkdtemp(path.join(tmpdir(), "voz-"));
    try {
      const input = lines.map((text, i) => JSON.stringify({ text, output_file: path.join(out, `${i}.wav`) })).join("\n") + "\n";
      const pdir = path.dirname(bin);
      const env = { ...process.env, LD_LIBRARY_PATH: [pdir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":") };
      const args = ["--model", model, "--json-input", "--length_scale", LENGTH_SCALE, "--espeak_data", path.join(pdir, "espeak-ng-data")];
      // prioridade baixa: o site responde primeiro, a voz usa a CPU que sobrar
      await run("nice", ["-n", "10", bin, ...args], { input, env }).catch((e: Error & { code?: string }) =>
        e.code === "ENOENT" ? run(bin, args, { input, env }) : Promise.reject(e),
      );
      let rate = 22050;
      const pcms: Buffer[] = [];
      for (let i = 0; i < lines.length; i++) {
        const wav = readWav(await readFile(path.join(out, `${i}.wav`)));
        rate = wav.rate;
        pcms.push(Buffer.from(wav.pcm));
      }
      return { rate, pcms };
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
  queue = job.catch(() => {});
  return job;
}
