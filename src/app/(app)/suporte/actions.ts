"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import { db } from "@/lib/db";
import { allowAttempt } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";

export async function openTicket(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const subject = String(d.get("subject") ?? "").trim().slice(0, 120);
  const text = String(d.get("text") ?? "").trim().slice(0, 3000);
  const bookingId = String(d.get("bookingId") ?? "") || null;
  if (subject.length < 3) return { error: "Escolha o assunto." };
  if (text.length < 5) return { error: "Conte o que aconteceu." };
  if (!(await allowAttempt(`ticket:${user.id}`, 5, 60))) return { error: "Muitos chamados em pouco tempo. Responda no chamado que já está aberto." };
  if (bookingId && !(await db.booking.findFirst({ where: { id: bookingId, OR: [{ clientId: user.id }, { pro: { userId: user.id } }] } }))) return { error: "Contratação não encontrada." };
  const t = await db.supportTicket.create({ data: { userId: user.id, subject, bookingId, messages: { create: { authorId: user.id, text } } } });
  redirect(`/suporte/${t.id}`);
}

export async function replyTicket(ticketId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const t = await db.supportTicket.findFirst({ where: { id: ticketId, userId: user.id } });
  if (!t) return { error: "Chamado não encontrado." };
  if (t.status === "CLOSED") return { error: "Este chamado foi encerrado. Abra um novo se precisar." };
  const text = String(d.get("text") ?? "").trim().slice(0, 3000);
  if (!text) return { error: "Escreva a mensagem." };
  if (!(await allowAttempt(`ticket-msg:${user.id}`, 20, 10))) return { error: "Muitas mensagens seguidas. Espere um pouco." };
  await db.supportTicket.update({ where: { id: t.id }, data: { status: "OPEN", messages: { create: { authorId: user.id, text } } } });
  revalidatePath(`/suporte/${t.id}`);
  return { ok: "Enviado." };
}
