import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { canAccessMaterial } from "@/lib/groups";
import { renderedPage } from "@/lib/materials/page-image";

/**
 * Página do PDF como imagem (?p=8&img=1 devolve o PNG; sem img devolve o tamanho, o total de páginas
 * e a posição dos textos, para grifar o trecho citado).
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const material = (await canAccessMaterial(user.id, id)) ? await db.material.findUnique({ where: { id }, include: { blob: true } }) : null;
  if (!material?.blob || material.kind !== "PDF") return jsonError("PDF não encontrado", 404);
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("p")) || 1);
  try {
    const { png, info } = await renderedPage(material.id, material.blob.storageKey, page);
    if (url.searchParams.get("img")) {
      return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=86400" } });
    }
    return NextResponse.json(info, { headers: { "Cache-Control": "private, max-age=3600" } });
  } catch (e) {
    console.error("[fonte] desenhar página", e);
    return jsonError("Não foi possível mostrar esta página.", 500);
  }
}
