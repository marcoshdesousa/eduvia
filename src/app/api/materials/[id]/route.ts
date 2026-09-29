import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { getOwnedMaterial } from "@/lib/authz";
import { deleteObject } from "@/lib/storage";
import { enqueue } from "@/lib/queue";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser({ requireAccess: false });
  if (error) return error;
  const { id } = await params;
  const material = await getOwnedMaterial(id, user.id);
  if (!material) return jsonError("Material não encontrado", 404);

  await db.topic.deleteMany({ where: { materialId: id, source: "MATERIAL" } });
  await db.material.delete({ where: { id } });
  if (material.blob) {
    const others = await db.material.count({ where: { blobId: material.blob.id } });
    if (!others) {
      await db.materialBlob.delete({ where: { id: material.blob.id } });
      await deleteObject(material.blob.storageKey);
    } else {
      // os trechos continuam existindo (outro material usa o mesmo arquivo), mas não devem mais alimentar esta preparação
      await db.topicChunk.deleteMany({ where: { chunk: { blobId: material.blob.id }, topic: { subject: { preparationId: material.preparationId } } } });
    }
  }
  await enqueue("plan.generate", { preparationId: material.preparationId }, { singletonKey: material.preparationId });
  return NextResponse.json({ ok: true });
}
