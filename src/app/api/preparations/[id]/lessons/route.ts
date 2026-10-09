import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { getOwnedPreparation } from "@/lib/authz";
import { db } from "@/lib/db";
import { enqueue } from "@/lib/queue";

/** Botão "Gerar aulas": só quando todos os arquivos já foram lidos. */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const prep = await getOwnedPreparation(id, user.id);
  if (!prep) return jsonError("Preparação não encontrada", 404);
  const mats = await db.material.findMany({ where: { preparationId: id }, select: { status: true } });
  if (mats.some((m) => ["UPLOADING", "QUEUED", "PROCESSING"].includes(m.status))) return jsonError("Espere todos os arquivos ficarem prontos.");
  if (!mats.some((m) => m.status === "READY")) return jsonError("Envie pelo menos um arquivo.");
  if (prep.lessonsStatus === "RUNNING") return NextResponse.json({ ok: true });
  await db.preparation.update({
    where: { id },
    data: { lessonsStatus: "RUNNING", lessonsStartedAt: new Date(), lessonsStep: "Começando...", lessonsProgress: 1 },
  });
  await enqueue("lessons.generate", { preparationId: id }, { singletonKey: `lessons:${id}:${Date.now()}` });
  return NextResponse.json({ ok: true });
}
