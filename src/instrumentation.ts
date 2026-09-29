// Com RUN_WORKER_IN_WEB=true o processamento em segundo plano roda dentro do próprio app
// (um só serviço no Render, com os arquivos no disco dele). Sem isso, rode `npm run worker` à parte.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.RUN_WORKER_IN_WEB !== "true") return;
  const { startWorker } = await import("./worker/start");
  await startWorker({ handleSignals: false });
}
