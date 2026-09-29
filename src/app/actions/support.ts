"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireReadyUser } from "@/lib/session";
import { allowAttempt } from "@/lib/rate-limit";
import { replySupport, sendSupportMessage, SUPPORT_MAX_CHARS } from "@/lib/support";
import type { FormState } from "./account";

export async function sendSupportAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const body = String(f.get("body") ?? "").trim();
  if (body.length < 2) return { error: "Escreva a sua mensagem." };
  if (body.length > SUPPORT_MAX_CHARS) return { error: `A mensagem pode ter até ${SUPPORT_MAX_CHARS} caracteres.` };
  if (!(await allowAttempt(`support:${user.id}`, 20, 60))) return { error: "Muitas mensagens seguidas. Aguarde um pouco." };
  await sendSupportMessage(user, body);
  revalidatePath("/suporte");
  return { ok: true, message: "Mensagem enviada! Você recebe um aviso quando respondermos." };
}

export async function replySupportAction(userId: string, _: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const body = String(f.get("body") ?? "").trim();
  if (body.length < 1) return { error: "Escreva a resposta." };
  if (body.length > SUPPORT_MAX_CHARS) return { error: `A resposta pode ter até ${SUPPORT_MAX_CHARS} caracteres.` };
  await replySupport(userId, body);
  revalidatePath("/admin");
  return { ok: true, message: "Resposta enviada." };
}
