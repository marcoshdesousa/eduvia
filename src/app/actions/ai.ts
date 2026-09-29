"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkGeminiKey } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { allowAttempt } from "@/lib/rate-limit";
import { sealSecret } from "@/lib/secret-box";
import { requireUser } from "@/lib/session";
import type { FormState } from "./account";

/** Conecta (ou troca) a chave do Gemini do aluno. `next` = para onde ir depois (ex.: /inicio). */
export async function connectAiAction(next: string | null, _: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const key = String(f.get("geminiKey") ?? "").trim();
  if (!key) return { error: "Cole a chave da sua IA do Gemini." };
  if (!(await allowAttempt(`aikey:${user.id}`, 10, 15))) return { error: "Muitas tentativas. Aguarde 15 minutos." };
  const check = await checkGeminiKey(key);
  if (!check.ok) return { error: check.error };
  await db.user.update({
    where: { id: user.id },
    data: { geminiKey: sealSecret(key), geminiKeyHint: key.slice(-4), geminiConnectedAt: new Date(), aiPausedUntil: null },
  });
  if (next) redirect(next);
  revalidatePath("/perfil");
  return { ok: true, message: "IA conectada! ✅" };
}
