"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AiUnavailableError, AiUserError, callStructured, checkGeminiKey, isMockAi } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { allowAttempt } from "@/lib/rate-limit";
import { checkExtraKey } from "@/lib/ai/extra";
import { providerLabel, setProviderEnabled, type AiProvider } from "@/lib/ai/providers";
import { sealSecret } from "@/lib/secret-box";
import { requireUser } from "@/lib/session";
import type { FormState } from "./account";

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

const KEY_FIELDS = {
  gemini: { key: "geminiKey", hint: "geminiKeyHint" },
  groq: { key: "groqKey", hint: "groqKeyHint" },
  openrouter: { key: "openrouterKey", hint: "openrouterKeyHint" },
} as const;

/** Conecta (ou troca) a chave de uma das 4 IAs. Salva na hora: o aluno não perde o que já conectou. */
export async function connectExtraAiAction(provider: AiProvider, _: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const key = String(f.get("key") ?? "").trim();
  const label = providerLabel(provider);
  if (!key) return { error: `Cole a chave da ${label}.` };
  if (!(await allowAttempt(`aikey-${provider}:${user.id}`, 10, 15))) return { error: "Muitas tentativas. Aguarde 15 minutos." };
  const check = provider === "gemini" ? await checkGeminiKey(key) : await checkExtraKey(provider, key);
  if (!check.ok) return { error: check.error };
  const fields = KEY_FIELDS[provider];
  const had = !!user[fields.key];
  await db.user.update({
    where: { id: user.id },
    data: {
      [fields.key]: sealSecret(key),
      [fields.hint]: key.slice(-4),
      ...(provider === "gemini" ? { geminiConnectedAt: new Date(), aiPausedUntil: null } : {}),
    },
  });
  revalidatePath("/conectar-ia");
  revalidatePath("/minha-ia");
  revalidatePath("/inicio");
  return { ok: true, message: had ? `${label} atualizada! ✅` : `${label} conectada! ✅` };
}

export async function removeExtraAiAction(provider: AiProvider) {
  const user = await requireUser();
  if (provider === "gemini") return;
  const fields = KEY_FIELDS[provider];
  await db.user.update({ where: { id: user.id }, data: { [fields.key]: null, [fields.hint]: null } });
  revalidatePath("/minha-ia");
  revalidatePath("/inicio");
}

/** Admin: liga ou desliga uma IA no sistema (desligada, sai do cadastro e não é usada). */
export async function toggleProviderAction(provider: AiProvider, enabled: boolean) {
  const user = await requireUser();
  if (!user.isAdmin) return;
  await setProviderEnabled(provider, enabled);
  revalidatePath("/admin");
}

export type VoiceTestResult = { ok: true; voice: string; ms: number; seconds: number; memoryMb: number } | { ok: false; error: string; memoryMb: number };

/** Admin: testa a voz do robô (Piper) de verdade e mostra o motivo se falhar. */
export async function testVoiceAction(): Promise<VoiceTestResult> {
  const user = await requireUser();
  const memoryMb = Math.round(process.memoryUsage().rss / 1_048_576);
  if (!user.isAdmin) return { ok: false, error: "Só para administradores.", memoryMb };
  const { piperStatus } = await import("@/lib/ai/piper");
  const r = await piperStatus();
  return r.ok ? { ...r, memoryMb } : { ok: false, error: [r.error, r.lastError].filter(Boolean).join(" · "), memoryMb };
}

/** Admin: testa a voz do modo vídeo (Francisca, voz neural) de verdade e mostra o motivo se falhar. */
export async function testVideoVoiceAction(): Promise<VoiceTestResult> {
  const user = await requireUser();
  const memoryMb = Math.round(process.memoryUsage().rss / 1_048_576);
  if (!user.isAdmin) return { ok: false, error: "Só para administradores.", memoryMb };
  const { neuralSpeak, VIDEO_VOICES } = await import("@/lib/ai/neural-voice");
  const { mp3Duration } = await import("@/lib/ai/tts");
  const t0 = Date.now();
  try {
    // texto com a hora: não vem do que ficou guardado, testa o serviço de verdade
    const r = await neuralSpeak(`Olá! Esta é a voz do vídeo do Eduvia. Teste das ${new Date().toLocaleTimeString("pt-BR")}.`, "f");
    return { ok: true, voice: VIDEO_VOICES.f.name, ms: Date.now() - t0, seconds: Math.round(mp3Duration(r.mp3) * 10) / 10, memoryMb };
  } catch (e) {
    return { ok: false, error: (e as Error).message, memoryMb };
  }
}
