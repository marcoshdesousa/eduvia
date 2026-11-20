import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { category } from "@/lib/domain";
import { lowestPrice } from "@/lib/providers";
import { getSettings } from "@/lib/settings";

/** Menor preço da plataforma para o serviço (perto do ponto, se informado) e quantos prestadores estão disponíveis agora. */
export async function GET(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const q = new URL(req.url).searchParams;
  const cat = category(q.get("servico") ?? "");
  if (!cat) return NextResponse.json({ error: "Serviço inválido." }, { status: 400 });
  const lat = Number(q.get("lat"));
  const lng = Number(q.get("lng"));
  const near = q.get("lat") && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  const { quickMaxKm } = await getSettings();
  const low = (near ? await lowestPrice(cat.slug, near, quickMaxKm, cat.unit) : null) ?? (await lowestPrice(cat.slug, null, 40, cat.unit));
  return NextResponse.json({ unitCents: low?.priceCents ?? null, unit: low?.unit ?? cat.unit, nearby: !!near && !!low });
}
