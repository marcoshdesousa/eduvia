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

export async function deletePreparationData(preparationId: string) {
  const mats = await db.material.findMany({ where: { preparationId }, select: { blobId: true } });
  await db.preparation.delete({ where: { id: preparationId } });
  await deleteOrphanBlobs(mats.flatMap((m) => (m.blobId ? [m.blobId] : [])));
}

export async function deleteUserData(userId: string) {
  const mats = await db.material.findMany({ where: { uploaderId: userId }, select: { blobId: true } });
  await db.user.delete({ where: { id: userId } });
  await deleteOrphanBlobs(mats.flatMap((m) => (m.blobId ? [m.blobId] : [])));
}
