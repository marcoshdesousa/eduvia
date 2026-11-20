import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { workerPaid } from "@/lib/session";
import { deleteObject } from "@/lib/storage";
import { saveImage } from "@/lib/upload";

/** Troca a foto de um perfil (profissão). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const svc = user.provider ? await db.providerService.findFirst({ where: { id, proId: user.provider.id } }) : null;
  if (!svc) return jsonError("Perfil não encontrado.", 404);
  if (!(await workerPaid(svc.proId))) return jsonError("Seu plano está vencido.", 402);
  const r = await saveImage((await req.formData().catch(() => null))?.get("photo") ?? null, "perfil");
  if ("error" in r) return jsonError(r.error);
  await db.providerService.update({ where: { id }, data: { photoKey: r.key } });
  if (svc.photoKey) await deleteObject(svc.photoKey).catch(() => {});
  return NextResponse.json({ ok: true });
}
