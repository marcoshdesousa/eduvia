import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providerViewable } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { serveImage } from "../../../foto/[proId]/route";

/** Foto de um perfil (profissão) do trabalhador. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const svc = await db.providerService.findUnique({ where: { id }, select: { proId: true, photoKey: true } });
  if (!svc?.photoKey) return new NextResponse(null, { status: 404 });
  const v = await providerViewable(svc.proId, await getCurrentUser());
  if (!v.allowed) return new NextResponse(null, { status: 404 });
  return serveImage(svc.photoKey, v.isPublic);
}
