import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { canAccessMaterial } from "@/lib/groups";

/** Texto de uma página do material (para DOCX/texto, ou quando o PDF não abre no aparelho). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = (await canAccessMaterial(user.id, id)) ? await db.material.findUnique({ where: { id }, select: { blobId: true, title: true, kind: true } }) : null;
  if (!material?.blobId) return jsonError("Material não encontrado", 404);
  const n = Math.max(1, Number(new URL(req.url).searchParams.get("p")) || 1);
  const [page, total] = await Promise.all([
    db.materialPage.findUnique({ where: { blobId_pageNumber: { blobId: material.blobId, pageNumber: n } } }),
    db.materialPage.count({ where: { blobId: material.blobId } }),
  ]);
  return NextResponse.json({ title: material.title, kind: material.kind, page: n, total, text: page?.text ?? "" });
}
