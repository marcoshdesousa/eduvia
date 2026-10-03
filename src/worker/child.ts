// Processo filho do worker (iniciado pelo próprio site; ver src/instrumentation.ts).
// Lê PDFs, monta planos e envia lembretes. Se cair (ex.: PDF enorme), só ele reinicia: o site continua no ar.
import { startWorker } from "./start";

startWorker({ handleSignals: true }).catch((e) => {
  console.error("[worker] falhou ao iniciar:", e);
  process.exit(1);
});
