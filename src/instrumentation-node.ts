// Parte do instrumentation que só roda no Node (nunca no Edge).
// Com RUN_WORKER_IN_WEB=true o processamento em segundo plano (PDFs, planos, lembretes) roda no mesmo
// servidor do site, mas num PROCESSO SEPARADO: se um PDF pesado derrubar o worker, só ele reinicia e o
// site continua no ar. Mesmo plano do Render, sem custo extra, com os arquivos no disco dele.
// WORKER_MODE=inline volta ao jeito antigo (worker dentro do processo do site).
import "./process-guards";
import { startWorkerProcess } from "./worker/supervisor";

async function startInline() {
  const { startWorker } = await import("./worker/start");
  // se a fila não subir (ex.: banco reiniciando), o site continua no ar e tenta de novo depois
  const boot = (attempt: number): void => {
    startWorker({ handleSignals: false }).catch((e) => {
      console.error(`[worker] falhou ao iniciar (tentativa ${attempt}):`, e);
      (globalThis as unknown as { workerStarted?: boolean }).workerStarted = false;
      setTimeout(() => boot(attempt + 1), Math.min(60_000, 5_000 * attempt));
    });
  };
  boot(1);
}

if (process.env.RUN_WORKER_IN_WEB === "true") {
  if (process.env.WORKER_MODE === "inline") void startInline();
  else startWorkerProcess(startInline);
}
