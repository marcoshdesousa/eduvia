"use server";
import { revalidatePath } from "next/cache";
import type { BookingStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/components/action-form";
import { BookingError, changeStatus, clientNoShow, roleIn } from "@/lib/bookings";
import { db } from "@/lib/db";
import { canReview, parseBRL } from "@/lib/domain";
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
    let finalCents: number | null = null;
    if (to === "COMPLETED") {
      const raw = String(d.get("final") ?? "").trim();
      if (raw) {
        finalCents = parseBRL(raw);
        if (finalCents == null || finalCents < 0 || finalCents > 5_000_000) return { error: "Valor recebido inválido." };
      }
    }
    await changeStatus(bookingId, to, { id: user.id, as }, reason, new Date(), { finalCents });
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
  if (!b.pro) return { error: "Este pedido não teve prestador." };
  const pro = b.pro;
  const targetId = as === "CLIENT" ? pro.userId : b.clientId;
  await db.$transaction(async (tx) => {
    await tx.review.create({ data: { bookingId, authorId: user.id, targetId, stars, comment } });
    if (as === "CLIENT") await tx.providerProfile.update({ where: { id: pro.id }, data: { ratingSum: { increment: stars }, ratingCount: { increment: 1 } } });
  });
  await notify(targetId, { title: "Você recebeu uma avaliação", body: `${stars} estrela(s).`, href: `/pedidos/${bookingId}`, dedupeKey: `review:${bookingId}:${user.id}` });
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Obrigado pela avaliação!" };
}

/** Prestador: chegou, esperou 15 minutos e o cliente não estava (só Contrate rápido). */
export async function clientNoShowAction(bookingId: string): Promise<ActionResult> {
  const user = await requireUser();
  try {
    await clientNoShow(bookingId, user.id);
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Registrado. O cliente foi avisado." };
}

/** Cliente cancela um Contrate rápido que ainda está procurando. */
export async function cancelSearchAction(bookingId: string): Promise<ActionResult> {
  const user = await requireUser();
  const b = await db.booking.findFirst({ where: { id: bookingId, clientId: user.id } });
  if (!b) return { error: "Pedido não encontrado." };
  try {
    await changeStatus(bookingId, "CANCELED_CLIENT", { id: user.id, as: "CLIENT" }, "Cancelado enquanto procurava prestador.");
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Chamado cancelado." };
}

/** Cliente confirma o agendamento feito pelo prestador na conversa, informando o endereço. */
export async function confirmScheduleAction(bookingId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const { confirmSchedule } = await import("@/lib/bookings");
  const s = (k: string) => String(d.get(k) ?? "").trim();
  const num = (v: string) => (v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
  try {
    await confirmSchedule(
      bookingId,
      user.id,
      { street: s("street"), number: s("number"), complement: s("complement"), district: s("district"), city: s("city"), uf: s("uf").toUpperCase(), cep: s("cep"), reference: s("reference"), lat: num(s("lat")), lng: num(s("lng")) },
      { saveAddressLabel: d.get("saveAddress") === "on" ? s("saveLabel") || "Endereço" : null, payMethod: s("payMethod") || null },
    );
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }
  revalidatePath(`/pedidos/${bookingId}`);
  return { ok: "Agendamento confirmado! ✅" };
}
