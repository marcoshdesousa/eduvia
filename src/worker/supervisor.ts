// Liga o worker num processo separado e religa sozinho se ele cair.
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const g = globalThis as unknown as { eduviaWorker?: ChildProcess | null; eduviaWorkerStarted?: boolean };

export function startWorkerProcess(fallback: () => Promise<void>) {
  if (g.eduviaWorkerStarted) return;
  g.eduviaWorkerStarted = true;
  const entry = path.join(process.cwd(), "src", "worker", "child.ts");
  const tsx = path.join(process.cwd(), "node_modules", "tsx");
  if (!existsSync(entry) || !existsSync(tsx)) {
    console.warn("[worker] processo separado indisponível; rodando dentro do site.");
    void fallback();
    return;
  }
  // memória máxima do worker (MB): deixa o resto para o site
  const maxMb = Number(process.env.WORKER_MAX_MB || 1024);
  let failures = 0;

  const launch = () => {
    const startedAt = Date.now();
    const child = spawn(process.execPath, [`--max-old-space-size=${maxMb}`, "--import", "tsx", entry], {
      cwd: process.cwd(),
      env: { ...process.env, WORKER_CHILD: "1" },
      stdio: "inherit",
    });
    g.eduviaWorker = child;
    console.log(`[worker] processo separado iniciado (pid ${child.pid}, até ${maxMb} MB)`);
    child.on("exit", (code, signal) => {
      g.eduviaWorker = null;
      if (stopping) return;
      // ficou de pé mais de 5 min: zera a contagem de falhas
      failures = Date.now() - startedAt > 5 * 60_000 ? 1 : failures + 1;
      const wait = Math.min(60_000, 2_000 * 2 ** Math.min(failures - 1, 5));
      console.error(`[worker] processo parou (código ${code ?? "-"}, sinal ${signal ?? "-"}); religando em ${Math.round(wait / 1000)} s`);
      setTimeout(launch, wait);
    });
    child.on("error", (e) => console.error("[worker] erro no processo:", e));
  };

  let stopping = false;
  const stop = () => {
    stopping = true;
    g.eduviaWorker?.kill("SIGTERM");
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
  process.once("exit", stop);
  launch();
}
