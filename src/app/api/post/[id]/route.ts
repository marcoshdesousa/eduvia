import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providerViewable } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { serveImage } from "../../foto/[proId]/route";

/** Foto do portfólio do prestador. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return new NextResponse(null, { status: 404 });
  const v = await providerViewable(post.proId, await getCurrentUser());
  if (!v.allowed) return new NextResponse(null, { status: 404 });
  return serveImage(post.imageKey, v.isPublic);
}
