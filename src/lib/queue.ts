// Fila de tarefas em segundo plano (pg-boss sobre o próprio Postgres).
import { PgBoss } from "pg-boss";

export const QUEUES = {
  processMaterial: "material.process",
  generatePlan: "plan.generate",
  dailyMaintenance: "maintenance.daily",
  reminders: "reminders.tick",
} as const;

export type JobPayloads = {
  "material.process": { materialId: string };
  "plan.generate": { preparationId: string };
  "maintenance.daily": Record<string, never>;
  "reminders.tick": Record<string, never>;
};

const globalForBoss = globalThis as unknown as { boss?: Promise<PgBoss> };

export function getBoss(): Promise<PgBoss> {
  globalForBoss.boss ??= (async () => {
    const boss = new PgBoss({ connectionString: process.env.DATABASE_URL!, schema: "pgboss" });
    boss.on("error", (e) => console.error("[fila]", e));
    await boss.start();
    for (const name of Object.values(QUEUES)) await boss.createQueue(name);
    return boss;
  })();
  return globalForBoss.boss;
}

export async function enqueue<Q extends keyof JobPayloads>(
  queue: Q,
  data: JobPayloads[Q],
  opts: { singletonKey?: string; startAfter?: number } = {},
) {
  const boss = await getBoss();
  return boss.send(queue, data, { retryLimit: 3, retryDelay: 30, retryBackoff: true, ...opts });
}
