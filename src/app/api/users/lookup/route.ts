import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { db } from "@/lib/db";

/** Confere se um @ existe (para convites). Devolve só nome e @. */
export async function GET(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const h = (new URL(req.url).searchParams.get("h") ?? "").trim().replace(/^@/, "").toLowerCase();
  if (h.length < 3) return NextResponse.json({ exists: false });
  const u = await db.user.findUnique({ where: { handle: h }, select: { name: true, handle: true, cpf: true } });
  return NextResponse.json(u?.cpf ? { exists: true, name: u.name, handle: u.handle } : { exists: false });
}
