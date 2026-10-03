import { db } from "@/lib/db";
import { deleteObject } from "@/lib/storage";

/** Apaga blobs sem nenhum material apontando para eles (arquivo + trechos). */
async function deleteOrphanBlobs(blobIds: string[]) {
  for (const id of blobIds) {
    const used = await db.material.count({ where: { blobId: id } });
    if (used) continue;
    const blob = await db.materialBlob.delete({ where: { id } }).catch(() => null);
    if (blob) await deleteObject(blob.storageKey);
  }
}

/** Remove compartilhamentos em grupos que apontam para recursos da preparação. */
async function deleteSharesOf(preparationId: string) {
  const [mats, exams, topics] = await Promise.all([
    db.material.findMany({ where: { preparationId }, select: { id: true } }),
    db.exam.findMany({ where: { preparationId }, select: { id: true } }),
    db.topic.findMany({ where: { subject: { preparationId } }, select: { id: true, studyTexts: { select: { id: true } } } }),
  ]);
  const ids = [...mats.map((m) => m.id), ...exams.map((e) => e.id), ...topics.map((t) => t.id), ...topics.flatMap((t) => t.studyTexts.map((s) => s.id))];
  if (ids.length) await db.groupShare.deleteMany({ where: { resourceId: { in: ids } } });
}

export async function deletePreparationData(preparationId: string) {
  await deleteSharesOf(preparationId);
  const mats = await db.material.findMany({ where: { preparationId }, select: { blobId: true } });
  await db.preparation.delete({ where: { id: preparationId } });
  await deleteOrphanBlobs(mats.flatMap((m) => (m.blobId ? [m.blobId] : [])));
}

export async function deleteUserData(userId: string) {
  const preps = await db.preparation.findMany({ where: { userId }, select: { id: true } });
  for (const p of preps) await deleteSharesOf(p.id);
  const mats = await db.material.findMany({ where: { uploaderId: userId }, select: { blobId: true } });
  await db.user.delete({ where: { id: userId } });
  await deleteOrphanBlobs(mats.flatMap((m) => (m.blobId ? [m.blobId] : [])));
}
