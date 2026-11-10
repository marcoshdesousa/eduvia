import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proVisible } from "@/lib/domain";
import { imageType } from "@/lib/files";
import { getCurrentUser } from "@/lib/session";
import { readObject } from "@/lib/storage";

/**
 * Foto de perfil do profissional. Pública só para quem está na vitrine; fora dela, só o próprio profissional,
 * o admin e clientes que já fizeram pedido para ele.
 */
export async function GET(_: Request, { params }: { params: Promise<{ proId: string }> }) {
  const { proId } = await params;
  const pro = await db.professionalProfile.findUnique({ where: { id: proId }, include: { subscription: true, user: { select: { blockedAt: true } } } });
  if (!pro?.photoKey) return new NextResponse(null, { status: 404 });
  const isPublic = proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt });
  if (!isPublic) {
    const user = await getCurrentUser();
    const allowed = !!user && (user.role === "ADMIN" || user.id === pro.userId || !!(await db.booking.findFirst({ where: { proId, clientId: user.id }, select: { id: true } })));
    if (!allowed) return new NextResponse(null, { status: 404 });
  }
  try {
    const data = await readObject(pro.photoKey);
    const type = imageType(data);
    return new NextResponse(new Uint8Array(data), {
      headers: { "content-type": type?.mime ?? "application/octet-stream", "cache-control": isPublic ? "public, max-age=86400" : "private, max-age=600", "x-content-type-options": "nosniff" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
