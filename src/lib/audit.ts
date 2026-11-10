import { db } from "@/lib/db";

/** Registro das operações administrativas sensíveis (quem fez, o quê, em quem). */
export async function audit(adminId: string | null, action: string, targetType: string, targetId: string | null, details?: Record<string, unknown>) {
  await db.auditLog.create({ data: { adminId, action, targetType, targetId, details: details as never } });
}
