// As 4 IAs do aluno e o controle do admin: ligar/desligar cada uma e o aviso quando alguma passa a cobrar.
// Regra do Eduvia: só IAs grátis. Se uma IA começar a pedir pagamento, o site não usa ela (nunca gera
// cobrança) e avisa os administradores; o admin decide desligar, e aí ela sai do cadastro e do uso.
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { EXTRA_LIST, EXTRA_PROVIDERS, type ExtraProvider } from "@/lib/ai/extra";

export type AiProvider = "gemini" | ExtraProvider;
export const ALL_PROVIDERS: AiProvider[] = ["gemini", ...EXTRA_LIST];
export const providerLabel = (p: AiProvider) => (p === "gemini" ? "Gemini" : EXTRA_PROVIDERS[p].label);

const DISABLED_KEY = "ai-disabled";
let cache: { at: number; disabled: AiProvider[] } | null = null;

/** O Eduvia usa só a Gemini do aluno (Groq e OpenRouter ficam desligadas para todo mundo). */
const ALWAYS_OFF: AiProvider[] = ["groq", "openrouter"];

/** IAs desligadas (saem do cadastro e não são usadas). */
export async function disabledProviders(): Promise<AiProvider[]> {
  if (cache && Date.now() - cache.at < 30_000) return cache.disabled;
  const row = await db.siteSetting.findUnique({ where: { key: DISABLED_KEY } }).catch(() => null);
  let disabled: AiProvider[] = [];
  try {
    disabled = row ? (JSON.parse(row.value) as AiProvider[]).filter((p) => ALL_PROVIDERS.includes(p)) : [];
  } catch {}
  disabled = [...new Set([...disabled, ...ALWAYS_OFF])];
  cache = { at: Date.now(), disabled };
  return disabled;
}

export async function setProviderEnabled(p: AiProvider, enabled: boolean) {
  const now = new Set(await disabledProviders());
  if (enabled) now.delete(p);
  else now.add(p);
  // nunca desliga todas: alguma IA precisa ler os arquivos
  if (now.size >= ALL_PROVIDERS.length) return;
  const value = JSON.stringify([...now]);
  await db.siteSetting.upsert({ where: { key: DISABLED_KEY }, create: { key: DISABLED_KEY, value }, update: { value } });
  cache = null;
}

type KeyFields = { geminiKey: string | null; groqKey: string | null; openrouterKey: string | null };
export const hasKey = (u: KeyFields, p: AiProvider) =>
  !!(p === "gemini" ? u.geminiKey : p === "groq" ? u.groqKey : u.openrouterKey);

/** IAs ligadas que o aluno ainda não conectou (o cadastro só termina quando estiverem todas). */
export async function missingProviders(u: KeyFields): Promise<AiProvider[]> {
  const off = await disabledProviders();
  return ALL_PROVIDERS.filter((p) => !off.includes(p) && !hasKey(u, p));
}

/**
 * Uma IA respondeu que agora pede pagamento: avisa os administradores (uma vez por dia por IA).
 * Ela não é desligada sozinha: o admin decide em Admin → IAs.
 */
export async function reportPaidProvider(p: AiProvider, detail: string) {
  console.error(`[ia] ${p} pediu pagamento:`, detail);
  const day = new Date().toISOString().slice(0, 10);
  const admins = await db.user.findMany({ where: { isAdmin: true }, select: { id: true } }).catch(() => []);
  for (const a of admins) {
    await notify(a.id, {
      type: "AI_ALERT",
      title: `⚠️ A IA ${providerLabel(p)} passou a pedir pagamento`,
      body: "O Eduvia parou de usar essa IA para não gerar cobrança. Confira e, se continuar paga, desligue em Admin → IAs (ela sai do cadastro).",
      href: "/admin?aba=ia",
      dedupeKey: `ai-paid:${p}:${day}`,
    }).catch(() => {});
  }
}
