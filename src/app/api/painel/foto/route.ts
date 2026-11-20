import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { deleteObject } from "@/lib/storage";
import { saveImage } from "@/lib/upload";

/** Troca a foto de perfil do prestador (já recortada no aparelho). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return jsonError("Só prestadores têm foto de perfil.", 403);
  const r = await saveImage((await req.formData().catch(() => null))?.get("photo") ?? null, "perfil");
  if ("error" in r) return jsonError(r.error);
  const old = user.provider.photoKey;
  await db.providerProfile.update({ where: { id: user.provider.id }, data: { photoKey: r.key } });
  if (old) await deleteObject(old).catch(() => {});
  return NextResponse.json({ ok: true });
}
