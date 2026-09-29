// Worker: processa a fila (materiais, planos) e tarefas agendadas (lembretes, replanejamento diário).
import "dotenv/config";
import { getBoss, QUEUES, type JobPayloads } from "@/lib/queue";
import { processMaterial } from "@/lib/materials/process";
import { generatePlan } from "@/lib/plan";
import { db } from "@/lib/db";
import { sendBillingReminders, sendStudyReminders } from "@/lib/jobs/reminders";
import { pushConfigured } from "@/lib/notifications";
import { isMockAi } from "@/lib/ai/client";
import { usingLocalEmbeddings } from "@/lib/ai/embeddings";

async function main() {
  const boss = await getBoss();
  console.log(`[worker] iniciado. IA: ${isMockAi() ? "SIMULADA (sem ANTHROPIC_API_KEY)" : "Claude"}; embeddings: ${usingLocalEmbeddings() ? "locais" : "Voyage AI"}; push: ${pushConfigured() ? "ativo" : "desligado (sem VAPID)"}`);

  await boss.work<JobPayloads["material.process"]>(QUEUES.processMaterial, { localConcurrency: 2 }, async (jobs) => {
    for (const job of jobs) await processMaterial(job.data.materialId);
  });

  await boss.work<JobPayloads["plan.generate"]>(QUEUES.generatePlan, async (jobs) => {
    for (const job of jobs) await generatePlan(job.data.preparationId);
  });

  await boss.work(QUEUES.reminders, async () => {
    const n = await sendStudyReminders();
    if (n) console.log(`[worker] ${n} lembrete(s) de estudo`);
  });

  await boss.work(QUEUES.dailyMaintenance, async () => {
    const preps = await db.preparation.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
    for (const p of preps) await generatePlan(p.id);
    console.log(`[worker] replanejamento diário: ${preps.length} preparação(ões)`);
    await sendBillingReminders();
  });

  await boss.schedule(QUEUES.reminders, "*/5 * * * *");
  await boss.schedule(QUEUES.dailyMaintenance, "0 3 * * *", {}, { tz: "America/Sao_Paulo" });

  const stop = async () => {
    console.log("[worker] encerrando...");
    await boss.stop({ graceful: true });
    process.exit(0);
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
