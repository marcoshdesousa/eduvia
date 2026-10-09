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

// Voz do começo das aulas do Estudar ENEM: preparada no processo do site (o mesmo que entrega o áudio),
// só quando ninguém está usando a voz.
if (process.env.AI_MODE !== "mock" && process.env.NODE_ENV === "production") {
  void import("./lib/enem/audio").then((m) => m.prewarmEnemAudio()).catch((e) => console.error("[voz] pré-preparo ENEM", e));
  // Voz do modo vídeo (Gemini): grava, aos poucos, as aulas que ainda não têm voz. Fica no processo do site, o
  // mesmo que grava quando um aluno abre uma aula sem voz: as duas nunca gravam a mesma aula ao mesmo tempo.
  void import("./lib/enem/video-voice").then((m) => m.videoVoiceFactory()).catch((e) => console.error("[voz do vídeo] fábrica", e));
}

// Aulas do Estudar ENEM: com o worker junto do site, ele já grava o catálogo ao ligar. Sem ele, o site faz isso
// logo que liga (com centenas de aulas leva alguns segundos), para o primeiro aluno não ficar esperando.
if (process.env.RUN_WORKER_IN_WEB !== "true") {
  setTimeout(() => {
    void import("./lib/enem/bank").then((m) => m.ensureEnemCatalog()).catch((e) => console.error("[enem] pré-preparo do catálogo", e));
  }, 2_000);
}
