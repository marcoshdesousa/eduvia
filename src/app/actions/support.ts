"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireReadyUser } from "@/lib/session";
import { allowAttempt } from "@/lib/rate-limit";
import { closeTicket, openTicket, replyTicket, sendInTicket, SUPPORT_MAX_CHARS, SupportError } from "@/lib/support";
import type { FormState } from "./account";

function body(f: FormData) {
  return String(f.get("body") ?? "").trim();
}

export async function openTicketAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const text = body(f);
  if (text.length < 2) return { error: "Escreva a sua mensagem." };
  if (text.length > SUPPORT_MAX_CHARS) return { error: `A mensagem pode ter até ${SUPPORT_MAX_CHARS} caracteres.` };
  if (!(await allowAttempt(`support:${user.id}`, 20, 60))) return { error: "Muitas mensagens seguidas. Aguarde um pouco." };
  let id: string;
  try {
    id = (await openTicket(user, String(f.get("kind") ?? ""), text)).id;
  } catch (e) {
    if (e instanceof SupportError) return { error: e.message };
    throw e;
  }
  redirect(`/suporte/${id}`);
}

export async function sendSupportAction(ticketId: string, _: FormState, f: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const text = body(f);
  if (text.length < 2) return { error: "Escreva a sua mensagem." };
  if (text.length > SUPPORT_MAX_CHARS) return { error: `A mensagem pode ter até ${SUPPORT_MAX_CHARS} caracteres.` };
  if (!(await allowAttempt(`support:${user.id}`, 20, 60))) return { error: "Muitas mensagens seguidas. Aguarde um pouco." };
  try {
    await sendInTicket(user, ticketId, text);
  } catch (e) {
    if (e instanceof SupportError) return { error: e.message };
    throw e;
  }
  revalidatePath(`/suporte/${ticketId}`);
  return { ok: true, message: "Mensagem enviada! Você recebe um aviso quando respondermos." };
}

export async function replySupportAction(ticketId: string, _: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const text = body(f);
  if (!text) return { error: "Escreva a resposta." };
  if (text.length > SUPPORT_MAX_CHARS) return { error: `A resposta pode ter até ${SUPPORT_MAX_CHARS} caracteres.` };
  try {
    await replyTicket(ticketId, text);
  } catch (e) {
    if (e instanceof SupportError) return { error: e.message };
    throw e;
  }
  revalidatePath("/admin");
  return { ok: true, message: "Resposta enviada." };
}

export async function closeTicketAction(ticketId: string) {
  await requireAdmin();
  await closeTicket(ticketId);
  revalidatePath("/admin");
}
