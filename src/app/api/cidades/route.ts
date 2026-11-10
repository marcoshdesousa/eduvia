import { NextResponse } from "next/server";
import { citiesOf } from "@/lib/places";

/** Municípios de um estado (lista oficial), para os campos de cidade. */
export async function GET(req: Request) {
  const uf = new URL(req.url).searchParams.get("uf")?.toUpperCase() ?? "";
  const list = citiesOf(uf);
  if (!list.length) return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  return NextResponse.json(list, { headers: { "cache-control": "public, max-age=86400, immutable" } });
}
