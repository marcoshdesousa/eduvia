import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { roleIn } from "@/lib/bookings";
import { db } from "@/lib/db";
import { distanceKm, formatKm } from "@/lib/domain";

type Ctx = { params: Promise<{ id: string }> };

/** Só depois do aceite e até chegar: é quando a distância em tempo real faz sentido. */
const LIVE = ["ACCEPTED", "ON_THE_WAY"] as const;
const live = (s: string) => (LIVE as readonly string[]).includes(s);
const STALE_MS = 5 * 60_000;

async function load(ctx: Ctx) {
  const { user, error } = await apiUser();
  if (error) return { error } as const;
  const { id } = await ctx.params;
  const b = await db.booking.findUnique({ where: { id }, include: { pro: { select: { userId: true } } } });
  if (!b) return { error: jsonError("Pedido não encontrado.", 404) } as const;
  const as = roleIn(b, user);
  if (!as) return { error: jsonError("Pedido não encontrado.", 404) } as const;
  return { b, as } as const;
}

/** Distância do prestador até o endereço do cliente (nunca a posição exata dele). */
export async function GET(_: Request, ctx: Ctx) {
  const r = await load(ctx);
  if ("error" in r) return r.error;
  const { b } = r;
  const fresh = b.proPosAt && Date.now() - b.proPosAt.getTime() < STALE_MS;
  if (!live(b.status) || !fresh || b.proLat == null || b.proLng == null || b.lat == null || b.lng == null) {
    return NextResponse.json({ live: live(b.status), distance: null }, { headers: { "cache-control": "no-store" } });
  }
  const km = distanceKm({ lat: b.lat, lng: b.lng }, { lat: b.proLat, lng: b.proLng });
  return NextResponse.json({ live: true, distance: formatKm(km), km, at: b.proPosAt!.toISOString() }, { headers: { "cache-control": "no-store" } });
}

/** O celular do prestador manda a posição enquanto vai até o cliente. */
export async function POST(req: Request, ctx: Ctx) {
  const r = await load(ctx);
  if ("error" in r) return r.error;
  if (r.as !== "PRO") return jsonError("Só o prestador envia a posição.", 403);
  if (!live(r.b.status)) return NextResponse.json({ ok: false });
  const body = (await req.json().catch(() => null)) as { lat?: number; lng?: number } | null;
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return jsonError("Posição inválida.");
  await db.booking.update({ where: { id: r.b.id }, data: { proLat: lat, proLng: lng, proPosAt: new Date() } });
  const km = r.b.lat != null && r.b.lng != null ? distanceKm({ lat: r.b.lat, lng: r.b.lng }, { lat, lng }) : null;
  return NextResponse.json({ ok: true, distance: km != null ? formatKm(km) : null });
}
