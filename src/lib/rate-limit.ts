import { db } from "@/lib/db";

/**
 * Limite simples de tentativas guardado no banco (vale com vários servidores).
 * Retorna false quando a chave passou do limite na janela.
 */
export async function allowAttempt(key: string, max: number, windowMinutes: number): Promise<boolean> {
  const identifier = `limit:${key}`;
  const since = new Date(Date.now() - windowMinutes * 60_000);
  const count = await db.verification.count({ where: { identifier, createdAt: { gt: since } } });
  if (count >= max) return false;
  await db.verification.create({
    data: { id: crypto.randomUUID(), identifier, value: "1", expiresAt: new Date(Date.now() + windowMinutes * 60_000) },
  });
  return true;
}

export async function clearAttempts(key: string) {
  await db.verification.deleteMany({ where: { identifier: `limit:${key}` } });
}

/** Quantas falhas a chave já teve na janela passou do limite? (não registra nada) */
export async function tooManyFailures(key: string, max: number, windowMinutes: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60_000);
  return (await db.verification.count({ where: { identifier: `limit:${key}`, createdAt: { gt: since } } })) >= max;
}

/** Registra uma falha (ex.: senha errada). */
export async function recordFailure(key: string, windowMinutes: number) {
  await db.verification.create({ data: { id: crypto.randomUUID(), identifier: `limit:${key}`, value: "1", expiresAt: new Date(Date.now() + windowMinutes * 60_000) } });
}
