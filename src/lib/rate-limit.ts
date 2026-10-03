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
