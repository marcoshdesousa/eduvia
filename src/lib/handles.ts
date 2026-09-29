import { db } from "@/lib/db";
import { validateHandle, type HandleCheck } from "@/lib/core/handle";

/** Formato + disponibilidade no banco. */
export async function checkHandleAvailable(raw: string, currentUserId?: string): Promise<HandleCheck> {
  const v = validateHandle(raw);
  if (!v.ok) return v;
  const taken = await db.user.findUnique({ where: { handle: v.handle }, select: { id: true } });
  if (taken && taken.id !== currentUserId) return { ok: false, reason: "Esse @ já está em uso." };
  return v;
}
