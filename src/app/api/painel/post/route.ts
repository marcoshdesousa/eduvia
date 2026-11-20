import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { MAX_POSTS, PHONE_BLOCKED_MSG, containsPhone } from "@/lib/domain";
import { allowAttempt } from "@/lib/rate-limit";
import { deleteObject } from "@/lib/storage";
import { saveImage } from "@/lib/upload";

/** Nova foto no portfólio (até 8). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return jsonError("Só prestadores têm portfólio.", 403);
  if (!(await allowAttempt(`post:${user.id}`, 30, 60))) return jsonError("Muitas fotos em pouco tempo. Tente mais tarde.", 429);
  if ((await db.post.count({ where: { proId: user.provider.id } })) >= MAX_POSTS) return jsonError(`O portfólio tem até ${MAX_POSTS} fotos. Apague uma para pôr outra.`);
  const f = await req.formData().catch(() => null);
  const caption = String(f?.get("caption") ?? "").trim().slice(0, 300) || null;
  if (caption && containsPhone(caption)) return jsonError(PHONE_BLOCKED_MSG);
  const r = await saveImage(f?.get("image") ?? null, "portfolio");
  if ("error" in r) return jsonError(r.error);
  // confere de novo o limite (dois envios ao mesmo tempo)
  const post = await db.post.create({ data: { proId: user.provider.id, imageKey: r.key, caption } });
  if ((await db.post.count({ where: { proId: user.provider.id } })) > MAX_POSTS) {
    await db.post.delete({ where: { id: post.id } });
    await deleteObject(r.key).catch(() => {});
    return jsonError(`O portfólio tem até ${MAX_POSTS} fotos.`);
  }
  return NextResponse.json({ ok: true, id: post.id });
}
