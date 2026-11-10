import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { MAX_IMAGE_BYTES, imageType, newKey } from "@/lib/files";
import { deleteObject, writeObject } from "@/lib/storage";

/** Troca a foto de perfil do profissional (já recortada no aparelho). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (user.role !== "PRO" || !user.pro) return jsonError("Só profissionais têm foto de perfil.", 403);
  const photo = (await req.formData().catch(() => null))?.get("photo");
  if (!(photo instanceof Blob) || !photo.size) return jsonError("Envie a foto.");
  if (photo.size > MAX_IMAGE_BYTES) return jsonError("Foto grande demais.");
  const bytes = Buffer.from(await photo.arrayBuffer());
  const type = imageType(bytes);
  if (!type) return jsonError("A foto precisa ser JPG, PNG ou WebP.");
  const key = newKey("perfil", type.ext);
  await writeObject(key, bytes, type.mime);
  const old = user.pro.photoKey;
  await db.professionalProfile.update({ where: { id: user.pro.id }, data: { photoKey: key } });
  if (old) await deleteObject(old).catch(() => {});
  return NextResponse.json({ ok: true });
}
