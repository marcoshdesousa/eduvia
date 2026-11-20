import { NextResponse } from "next/server";
import { appUrl } from "@/lib/app-url";

/** Link de indicação: guarda o código por 30 dias e leva para a página inicial (de lá a pessoa baixa o app e se cadastra). */
export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const res = NextResponse.redirect(new URL("/", appUrl()));
  if (/^[A-Za-z0-9]{6,12}$/.test(code)) res.cookies.set("dp_ref", code.toUpperCase(), { path: "/", maxAge: 30 * 86_400, sameSite: "lax", httpOnly: true });
  return res;
}
