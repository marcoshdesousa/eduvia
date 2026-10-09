import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { canAccessMaterial } from "@/lib/groups";
import { readObject } from "@/lib/storage";

/** Bytes do PDF para o leitor dentro do app (mesma origem, sem baixar nem abrir outra aba). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = (await canAccessMaterial(user.id, id)) ? await db.material.findUnique({ where: { id }, include: { blob: true } }) : null;
  if (!material?.blob || material.kind !== "PDF") return jsonError("PDF não encontrado", 404);
  const data = await readObject(material.blob.storageKey);
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline", "Cache-Control": "private, max-age=86400" },
  });
}
