"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AiUnavailableError, AiUserError, callStructured, checkGeminiKey, isMockAi } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { allowAttempt } from "@/lib/rate-limit";
import { checkExtraKey, EXTRA_PROVIDERS, IA_EXTRA_XP, type ExtraProvider } from "@/lib/ai/extra";
import { addXp } from "@/lib/gamification";
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

export type AiTestResult = { ok: true; text: string; ms: number; models: string[] } | { ok: false; error: string; details?: string };

/** Faz uma chamada bem pequena à IA com a chave do aluno e mostra o resultado (ajuda a achar problemas). */
export async function testAiAction(): Promise<AiTestResult> {
  const user = await requireUser();
  if (!(await allowAttempt(`aitest:${user.id}`, 10, 10))) return { ok: false, error: "Muitos testes seguidos. Aguarde alguns minutos." };
  const started = Date.now();
  if (isMockAi()) return { ok: true, text: "Modo de demonstração: a IA está simulada.", ms: 0, models: ["mock"] };
  try {
    const res = await callStructured({
      task: "grade",
      userId: user.id,
      system: "Responda em português do Brasil.",
      content: "Diga uma frase curta de incentivo para um estudante.",
      schema: z.object({ frase: z.string() }),
      maxTokens: 300,
    });
    const recent = await db.aiUsage.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { model: true } });
    return { ok: true, text: res.frase, ms: Date.now() - started, models: recent ? [recent.model] : [] };
  } catch (e) {
    const details = e instanceof AiUnavailableError ? e.details : e instanceof Error ? e.message : String(e);
    return { ok: false, error: e instanceof AiUserError ? e.message : "Falhou.", details: user.isAdmin ? details : undefined };
  }
}

/** Conecta (ou troca) a chave de uma IA extra (Groq ou Cerebras). Na primeira vez, ganha XP. */
export async function connectExtraAiAction(provider: ExtraProvider, _: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const key = String(f.get("key") ?? "").trim();
  const label = EXTRA_PROVIDERS[provider].label;
  if (!key) return { error: `Cole a chave da ${label}.` };
  if (!(await allowAttempt(`aikey-${provider}:${user.id}`, 10, 15))) return { error: "Muitas tentativas. Aguarde 15 minutos." };
  const check = await checkExtraKey(provider, key);
  if (!check.ok) return { error: check.error };
  const first = provider === "groq" ? !user.groqKey : !user.cerebrasKey;
  await db.user.update({
    where: { id: user.id },
    data: provider === "groq" ? { groqKey: sealSecret(key), groqKeyHint: key.slice(-4) } : { cerebrasKey: sealSecret(key), cerebrasKeyHint: key.slice(-4) },
  });
  if (first && !(await db.xpEvent.findFirst({ where: { userId: user.id, reason: "ia-extra", refId: provider } }))) {
    await addXp(user.id, IA_EXTRA_XP, "ia-extra", provider);
  }
  revalidatePath("/minha-ia");
  revalidatePath("/inicio");
  return { ok: true, message: first ? `${label} conectada! ⚡ +${IA_EXTRA_XP} XP` : `${label} atualizada! ✅` };
}

export async function removeExtraAiAction(provider: ExtraProvider) {
  const user = await requireUser();
  await db.user.update({
    where: { id: user.id },
    data: provider === "groq" ? { groqKey: null, groqKeyHint: null } : { cerebrasKey: null, cerebrasKeyHint: null },
  });
  revalidatePath("/minha-ia");
  revalidatePath("/inicio");
}
