import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imageType } from "@/lib/files";
import { providerViewable } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { readObject } from "@/lib/storage";

/** Foto de perfil do prestador (pública se ele está na vitrine). */
export async function GET(_: Request, { params }: { params: Promise<{ proId: string }> }) {
  const { proId } = await params;
  const v = await providerViewable(proId, await getCurrentUser());
  const pro = v.allowed ? await db.providerProfile.findUnique({ where: { id: proId }, select: { photoKey: true } }) : null;
  if (!pro?.photoKey) return new NextResponse(null, { status: 404 });
  return serveImage(pro.photoKey, v.isPublic);
}

export async function serveImage(key: string, isPublic: boolean) {
  try {
    const data = await readObject(key);
    return new NextResponse(new Uint8Array(data), {
      headers: { "content-type": imageType(data)?.mime ?? "application/octet-stream", "cache-control": isPublic ? "public, max-age=86400" : "private, max-age=600", "x-content-type-options": "nosniff" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
