import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { MAX_POSTS, PHONE_BLOCKED_MSG, containsPhone } from "@/lib/domain";
import { allowAttempt } from "@/lib/rate-limit";
import { workerPaid } from "@/lib/session";
import { deleteObject } from "@/lib/storage";
import { saveImage } from "@/lib/upload";

/** Nova foto no portfólio de um perfil (até 8 por perfil). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return jsonError("Só prestadores têm portfólio.", 403);
  if (!(await allowAttempt(`post:${user.id}`, 30, 60))) return jsonError("Muitas fotos em pouco tempo. Tente mais tarde.", 429);
  if (!(await workerPaid(user.provider.id))) return jsonError("Seu plano está vencido.", 402);
  const f = await req.formData().catch(() => null);
  const svc = await db.providerService.findFirst({ where: { id: String(f?.get("serviceId") ?? ""), proId: user.provider.id }, select: { id: true } });
  if (!svc) return jsonError("Escolha o perfil da foto.");
  if ((await db.post.count({ where: { serviceId: svc.id } })) >= MAX_POSTS) return jsonError(`Cada perfil tem até ${MAX_POSTS} fotos. Apague uma para pôr outra.`);
  const caption = String(f?.get("caption") ?? "").trim().slice(0, 300) || null;
  if (caption && containsPhone(caption)) return jsonError(PHONE_BLOCKED_MSG);
  const r = await saveImage(f?.get("image") ?? null, "portfolio");
  if ("error" in r) return jsonError(r.error);
  // confere de novo o limite (dois envios ao mesmo tempo)
  const post = await db.post.create({ data: { proId: user.provider.id, serviceId: svc.id, imageKey: r.key, caption } });
  if ((await db.post.count({ where: { serviceId: svc.id } })) > MAX_POSTS) {
    await db.post.delete({ where: { id: post.id } });
    await deleteObject(r.key).catch(() => {});
    return jsonError(`O portfólio tem até ${MAX_POSTS} fotos.`);
  }
  return NextResponse.json({ ok: true, id: post.id });
}
