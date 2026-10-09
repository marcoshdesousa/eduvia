import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { getOwnedMaterial } from "@/lib/authz";
import { enqueue } from "@/lib/queue";

/** Envio terminou (ou nova tentativa após erro): coloca o material na fila de processamento. */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = await getOwnedMaterial(id, user.id);
  if (!material) return jsonError("Material não encontrado", 404);
  if (material.status === "PROCESSING" || material.status === "READY") return NextResponse.json({ ok: true });
  await db.material.update({ where: { id }, data: { status: "QUEUED", errorMessage: null, progressStep: "Na fila" } });
  await enqueue("material.process", { materialId: id }, { singletonKey: id });
  return NextResponse.json({ ok: true });
}
