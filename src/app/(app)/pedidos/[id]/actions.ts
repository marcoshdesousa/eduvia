"use server";
import { revalidatePath } from "next/cache";
import type { BookingStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/components/action-form";
import { BookingError, changeStatus, roleIn } from "@/lib/bookings";
import { db } from "@/lib/db";
import { canReview } from "@/lib/domain";
import { notify } from "@/lib/notifications";
import { requireUser } from "@/lib/session";
import { audit } from "@/lib/audit";

export async function changeStatusAction(bookingId: string, to: BookingStatus, _: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true } } } });
  if (!b) return { error: "Contratação não encontrada." };
  const as = roleIn(b, user);
  if (!as) return { error: "Sem permissão." };
  try {
    const reason = String(d.get("reason") ?? "");
    await changeStatus(bookingId, to, { id: user.id, as }, reason);
    if (as === "ADMIN") await audit(user.id, "booking.status", "Booking", bookingId, { to, reason });
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Atualizado." };
}

/** Avaliação depois do serviço concluído (cliente avalia o profissional e vice-versa). */
export async function reviewAction(bookingId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true, id: true } } } });
  if (!b) return { error: "Contratação não encontrada." };
  const as = roleIn(b, user);
  if (as !== "CLIENT" && as !== "PRO") return { error: "Só quem participou do serviço pode avaliar." };
  const stars = Number(d.get("stars"));
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return { error: "Escolha de 1 a 5 estrelas." };
  const comment = String(d.get("comment") ?? "").trim().slice(0, 600) || null;
  const already = await db.review.findUnique({ where: { bookingId_authorId: { bookingId, authorId: user.id } } });
  if (!canReview(b, !!already)) return { error: already ? "Você já avaliou este serviço." : "A avaliação abre depois que o serviço é concluído." };
  const targetId = as === "CLIENT" ? b.pro.userId : b.clientId;
  await db.$transaction(async (tx) => {
    await tx.review.create({ data: { bookingId, authorId: user.id, targetId, stars, comment } });
    if (as === "CLIENT") await tx.professionalProfile.update({ where: { id: b.pro.id }, data: { ratingSum: { increment: stars }, ratingCount: { increment: 1 } } });
  });
  await notify(targetId, { title: "Você recebeu uma avaliação", body: `${stars} estrela(s).`, href: `/pedidos/${bookingId}`, dedupeKey: `review:${bookingId}:${user.id}` });
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Obrigado pela avaliação!" };
}
