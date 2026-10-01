// Com RUN_WORKER_IN_WEB=true o processamento em segundo plano roda dentro do próprio app
// (um só serviço no Render, com os arquivos no disco dele). Sem isso, rode `npm run worker` à parte.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Um erro esquecido numa promessa não pode derrubar o site inteiro: registra e segue.
  const g = globalThis as unknown as { eduviaGuards?: boolean };
  if (!g.eduviaGuards) {
    g.eduviaGuards = true;
    process.on("unhandledRejection", (reason) => console.error("[processo] promessa rejeitada sem tratamento:", reason));
    process.on("uncaughtException", (err) => console.error("[processo] exceção não tratada:", err));
  }
  if (process.env.RUN_WORKER_IN_WEB !== "true") return;
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
