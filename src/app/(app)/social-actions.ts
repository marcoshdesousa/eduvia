"use server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import { db } from "@/lib/db";
import { allowAttempt } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";
import { REPORT_REASONS } from "@/lib/domain";

export async function toggleFavorite(proId: string) {
  const user = await requireUser();
  if (user.role !== "CLIENT") return;
  const key = { clientId_proId: { clientId: user.id, proId } };
  const had = await db.favorite.findUnique({ where: key });
  if (had) await db.favorite.delete({ where: key });
  else if (await db.professionalProfile.findUnique({ where: { id: proId }, select: { id: true } })) await db.favorite.create({ data: { clientId: user.id, proId } });
  revalidatePath(`/profissional/${proId}`);
  revalidatePath("/favoritos");
}

/** Denúncia de um usuário (e, se for o caso, de uma contratação, mensagem ou avaliação). Vai para o admin analisar. */
export async function report(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const targetId = String(d.get("targetId") ?? "") || null;
  const bookingId = String(d.get("bookingId") ?? "") || null;
  const messageId = String(d.get("messageId") ?? "") || null;
  const reviewId = String(d.get("reviewId") ?? "") || null;
  const reason = String(d.get("reason") ?? "");
  const details = String(d.get("details") ?? "").trim().slice(0, 1000) || null;
  if (!REPORT_REASONS.includes(reason as (typeof REPORT_REASONS)[number])) return { error: "Escolha o motivo." };
  if (!targetId && !bookingId) return { error: "Denúncia sem destino." };
  if (targetId === user.id) return { error: "Você não pode denunciar a si mesmo." };
  if (!(await allowAttempt(`report:${user.id}`, 10, 60))) return { error: "Muitas denúncias em pouco tempo. Tente mais tarde." };
  await db.report.create({ data: { reporterId: user.id, targetId, bookingId, messageId, reviewId, reason, details } });
  return { ok: "Denúncia enviada. A equipe da HoraLimp vai analisar." };
}

export async function toggleBlock(otherUserId: string) {
  const user = await requireUser();
  if (otherUserId === user.id) return;
  const key = { blockerId_blockedId: { blockerId: user.id, blockedId: otherUserId } };
  if (await db.block.findUnique({ where: key })) await db.block.delete({ where: key });
  else await db.block.create({ data: { blockerId: user.id, blockedId: otherUserId } });
  revalidatePath("/", "layout");
}
