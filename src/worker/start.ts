// Worker: processa a fila (materiais, planos) e tarefas agendadas (lembretes, replanejamento diário).
// Roda como processo separado (npm run worker) ou dentro do próprio app web (RUN_WORKER_IN_WEB=true).
import { enqueue, getBoss, QUEUES, type JobPayloads } from "@/lib/queue";
import { processMaterial } from "@/lib/materials/process";
import { generatePlan } from "@/lib/plan";
import { db } from "@/lib/db";
import { sendBillingReminders, sendDailyNudges, sendStudyReminders } from "@/lib/jobs/reminders";
import { pushConfigured } from "@/lib/notifications";
import { isMockAi } from "@/lib/ai/client";
import { usingLocalEmbeddings } from "@/lib/ai/embeddings";

/**
 * Materiais parados (ex.: o servidor reiniciou no meio do processamento): voltam para a fila.
 * Roda a cada 5 minutos junto com os lembretes.
 */
async function recoverStuckMaterials() {
  const stuck = await db.material.findMany({
    // QUEUED com tentativas automáticas já tem a vez marcada na fila (ex.: esperando a cota voltar)
    where: { updatedAt: { lt: new Date(Date.now() - 20 * 60_000) }, OR: [{ status: "PROCESSING" }, { status: "QUEUED", autoRetries: 0 }] },
    select: { id: true },
    take: 50,
  });
  for (const m of stuck) {
    await db.material.update({ where: { id: m.id }, data: { status: "QUEUED", progressStep: "Na fila: retomando o processamento." } });
    await enqueue(QUEUES.processMaterial, { materialId: m.id }, { singletonKey: `material:${m.id}:recover:${Math.floor(Date.now() / 600_000)}` });
  }
  if (stuck.length) console.log(`[worker] ${stuck.length} material(is) parado(s) voltaram para a fila`);
}

/** Limpeza única dos arquivos no disco depois de "recomeçar do zero" (marcada no banco pela migração 19). */
async function wipeFilesIfRequested() {
  const flag = await db.siteSetting.findUnique({ where: { key: "wipe-files" } });
  if (flag?.value !== "pending") return;
  const { wipeLocalFiles } = await import("@/lib/storage");
  // só arquivos com mais de 10 minutos: não pega um envio que acabou de começar
  const removed = await wipeLocalFiles(10 * 60_000);
  await db.siteSetting.update({ where: { key: "wipe-files" }, data: { value: `done:${removed}` } });
  console.log(`[worker] limpeza de arquivos: ${removed} arquivo(s) apagado(s)`);
}

const globalForWorker = globalThis as unknown as { workerStarted?: boolean };

export async function startWorker({ handleSignals }: { handleSignals: boolean }) {
  if (globalForWorker.workerStarted) return;
  globalForWorker.workerStarted = true;
  const boss = await getBoss();
  await wipeFilesIfRequested().catch((e) => console.error("[worker] limpeza de arquivos", e));
  console.log(
    `[worker] iniciado. IA: ${isMockAi() ? "SIMULADA (AI_MODE=mock)" : "Gemini (chave de cada aluno)"}; embeddings: ${usingLocalEmbeddings() ? "locais" : "Voyage AI"}; push: ${(await pushConfigured()) ? "ativo" : "desligado"}`,
  );

  await boss.work<JobPayloads["material.process"]>(QUEUES.processMaterial, { localConcurrency: 1 }, async (jobs) => {
    for (const job of jobs) await processMaterial(job.data.materialId);
  });

  await boss.work<JobPayloads["plan.generate"]>(QUEUES.generatePlan, async (jobs) => {
    for (const job of jobs) await generatePlan(job.data.preparationId);
  });

  await boss.work(QUEUES.reminders, async () => {
    const n = await sendStudyReminders();
    if (n) console.log(`[worker] ${n} lembrete(s) de estudo`);
    const nudges = await sendDailyNudges().catch((e) => (console.error("[worker] chamadas do dia", e), 0));
    if (nudges) console.log(`[worker] ${nudges} chamada(s) do dia`);
    await recoverStuckMaterials();
  });

  await boss.work(QUEUES.dailyMaintenance, async () => {
    const preps = await db.preparation.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
    for (const p of preps) await generatePlan(p.id);
    console.log(`[worker] replanejamento diário: ${preps.length} preparação(ões)`);
    await sendBillingReminders();
  });

  await boss.schedule(QUEUES.reminders, "*/5 * * * *");
  await boss.schedule(QUEUES.dailyMaintenance, "0 3 * * *", {}, { tz: "America/Sao_Paulo" });

  if (handleSignals) {
    const stop = async () => {
      console.log("[worker] encerrando...");
      await boss.stop({ graceful: true });
      process.exit(0);
    };
    process.on("SIGTERM", stop);
    process.on("SIGINT", stop);
  }
}
