import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { canAccessMaterial } from "@/lib/groups";
import { downloadUrl } from "@/lib/storage";

/** Abre o arquivo original (opcionalmente numa página) com um link temporário, após checar permissão. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = (await canAccessMaterial(user.id, id)) ? await db.material.findUnique({ where: { id }, include: { blob: true } }) : null;
  if (!material?.blob) return jsonError("Material não encontrado", 404);
  const page = Number(new URL(req.url).searchParams.get("page")) || null;
  const url = await downloadUrl(material.blob.storageKey, material.title);
  const target = new URL(url, req.url); // URL relativa (disco local) ou assinada (S3)
  if (material.kind === "PDF" && page) target.hash = `page=${page}`;
  return NextResponse.redirect(target);
}
