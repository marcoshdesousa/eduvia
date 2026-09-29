import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { getOwnedMaterial } from "@/lib/authz";
import { downloadUrl } from "@/lib/storage";

/** Abre o arquivo original (opcionalmente numa página) com um link temporário, após checar permissão. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = await getOwnedMaterial(id, user.id);
  if (!material?.blob) return jsonError("Material não encontrado", 404);
  const page = Number(new URL(req.url).searchParams.get("page")) || null;
  const url = await downloadUrl(material.blob.storageKey, material.title);
  return NextResponse.redirect(material.kind === "PDF" && page ? `${url}#page=${page}` : url);
}
