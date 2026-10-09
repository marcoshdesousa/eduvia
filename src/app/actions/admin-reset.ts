"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { deleteOrphanBlobs } from "@/lib/cleanup";
import { SYSTEM_USER_ID } from "@/lib/enem/catalog";
import type { FormState } from "./account";

const RESET_CONFIRM = "APAGAR TUDO";

/**
 * Recomeçar do zero (pedido do dono do site): apaga todas as contas, menos as de administrador, e o histórico de
 * estudo dos administradores (preparações, aulas, simulados, redações...). A conta, o login, a IA e o plano do
 * administrador ficam. A promoção e as indicações guardadas pelo CPF também ficam (não voltam ao recriar a conta).
 */
export async function resetAccountsAction(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  if (String(f.get("confirm") ?? "").trim().toUpperCase() !== RESET_CONFIRM) return { error: `Digite ${RESET_CONFIRM} para confirmar.` };
  const admins = (await db.user.findMany({ where: { isAdmin: true }, select: { id: true } })).map((a) => a.id);
  if (!admins.length) return { error: "Nenhum administrador encontrado." };
  const blobs = (await db.material.findMany({ where: { blobId: { not: null } }, select: { blobId: true } })).flatMap((m) => (m.blobId ? [m.blobId] : []));
  const mine = { userId: { in: admins } };
  const removed = await db.$transaction(async (tx) => {
    const users = await tx.user.deleteMany({ where: { isAdmin: false, id: { not: SYSTEM_USER_ID } } });
    await tx.preparation.deleteMany({ where: mine });
    await tx.material.deleteMany({ where: { uploaderId: { in: admins } } });
    await tx.studySession.deleteMany({ where: mine });
    await tx.attempt.deleteMany({ where: mine });
    await tx.reviewItem.deleteMany({ where: mine });
    await tx.topicReview.deleteMany({ where: mine });
    await tx.topicMastery.deleteMany({ where: mine });
    await tx.xpEvent.deleteMany({ where: mine });
    await tx.studyDay.deleteMany({ where: mine });
    await tx.usageCounter.deleteMany({ where: mine });
    await tx.gameRun.deleteMany({ where: mine });
    await tx.examAttempt.deleteMany({ where: mine });
    await tx.exam.deleteMany({ where: { ownerId: { in: admins } } });
    await tx.essay.deleteMany({ where: mine });
    await tx.tutorThread.deleteMany({ where: mine });
    await tx.group.deleteMany({ where: { ownerId: { in: admins } } });
    await tx.groupMember.deleteMany({ where: mine });
    await tx.userAchievement.deleteMany({ where: mine });
    await tx.notification.deleteMany({ where: mine });
    await tx.preparationCreation.deleteMany({ where: mine });
    await tx.user.updateMany({ where: { id: { in: admins } }, data: { xp: 0, currentStreak: 0, longestStreak: 0, lastStudyDate: null } });
    return users.count;
  }, { timeout: 120_000 });
  await deleteOrphanBlobs([...new Set(blobs)]).catch((e) => console.error("[recomeçar] arquivos", e));
  console.log(`[admin] recomeçar do zero: ${removed} conta(s) apagada(s)`);
  revalidatePath("/admin");
  return { ok: true, message: `Pronto: ${removed} conta(s) apagada(s). A sua conta de administrador ficou, sem histórico de estudo.` };
}
