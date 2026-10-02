// Cliente de IA: Google Gemini, sempre com a chave do próprio aluno (a plataforma não paga IA).
// Usa a API REST (generativelanguage.googleapis.com) direto, sem SDK.
import { z } from "zod";
import { db } from "@/lib/db";
import { openSecret } from "@/lib/secret-box";
import { localDayStart } from "@/lib/billing";

/** Tarefas de IA (servem para o registro de uso e para escolher o modelo por tarefa via env). */
export type AiTask = "outline" | "edital" | "session" | "grade" | "ocr" | "questions" | "essay" | "tutor";

/** Partes de uma mensagem: texto, PDF ou imagem (base64). */
export type AiPart = { type: "text"; text: string } | { type: "pdf"; data: string } | { type: "image"; mediaType: string; data: string };

const API = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

/**
 * Modelos de reserva (se a lista do Google não puder ser lida). Na prática, os modelos são descobertos
 * com a própria chave do aluno (ListModels), porque o Google aposenta e renomeia modelos com o tempo.
 * A cota grátis é separada por modelo: se um esgota no dia, o próximo assume.
 * Dá para forçar a ordem com GEMINI_MODELS (lista separada por vírgula) ou GEMINI_MODEL_<TAREFA>.
 */
const FALLBACK_MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

/** Tarefas simples rodam sem "pensar" (mais rápidas e leves na cota). */
const NO_THINKING: AiTask[] = ["grade", "ocr", "tutor"];

type ModelInfo = { name?: string; supportedGenerationMethods?: string[] };
const discovered = new Map<string, { models: string[]; at: number }>();

/** Ordena os modelos "flash" disponíveis: aliases -latest, depois versão mais nova, estável antes de preview, flash antes de lite. */
export function rankModels(names: string[]): string[] {
  const re = /^gemini-(?:(\d+(?:\.\d+)?)-)?flash(-lite)?(?:-(latest|preview[\w-]*|\d{3}))?$/;
  const scored = names.flatMap((n) => {
    const m = n.match(re);
    if (!m || /tts|image|audio|live|native/.test(n)) return []; // só texto
    const alias = !m[1] && m[3] === "latest";
    if (!m[1] && !alias) return [];
    const version = alias ? 999 : parseFloat(m[1]);
    const preview = m[3]?.startsWith("preview") ? 1 : 0;
    return [{ n, key: [-version, preview, m[2] ? 1 : 0, n.length] }];
  });
  scored.sort((x, y) => x.key.reduce((acc, v, i) => acc || v - y.key[i], 0));
  return scored.map((s) => s.n);
}

async function discoverModels(key: string): Promise<string[]> {
  const hit = discovered.get(key);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.models;
  const names: string[] = [];
  try {
    let page = "";
    for (let i = 0; i < 3; i++) {
      const res = await fetch(`${API}/models?pageSize=200${page ? `&pageToken=${page}` : ""}`, { headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(15_000) });
      if (!res.ok) break;
      const body = (await res.json()) as { models?: ModelInfo[]; nextPageToken?: string };
      for (const m of body.models ?? []) {
        if (m.name && m.supportedGenerationMethods?.includes("generateContent")) names.push(m.name.replace(/^models\//, ""));
      }
      if (!body.nextPageToken) break;
      page = body.nextPageToken;
    }
  } catch (e) {
    console.error("[gemini] não foi possível listar os modelos:", (e as Error).message);
  }
  const ranked = rankModels(names).slice(0, 6);
  if (ranked.length) discovered.set(key, { models: ranked, at: Date.now() });
  return ranked;
}

export async function modelChain(task: AiTask, key: string): Promise<string[]> {
  const env = (process.env.GEMINI_MODELS || "").split(",").map((m) => m.trim()).filter(Boolean);
  const override = process.env[`GEMINI_MODEL_${task.toUpperCase()}`]?.trim();
  const found = env.length ? [] : await discoverModels(key);
  const chain = [...(override ? [override] : []), ...env, ...found, ...FALLBACK_MODELS];
  return [...new Set(chain)];
}

/** Modo simulado (desenvolvimento e testes): AI_MODE=mock. Aceita qualquer chave e gera conteúdo local. */
export function isMockAi(): boolean {
  return process.env.AI_MODE === "mock";
}

/** Erros que o aluno precisa ver (não adianta a fila tentar de novo sozinha). */
export class AiUserError extends Error {}
export class AiRefusalError extends AiUserError {}
/** Nenhum modelo respondeu (fora do ar, modelo aposentado, erro do Google). `details` vai para o log e para o teste do admin. */
export class AiUnavailableError extends AiUserError {
  constructor(
    message: string,
    readonly details: string,
  ) {
    super(message);
  }
}
/** Sem chave, ou chave recusada pelo Google. */
export class AiKeyError extends AiUserError {}
/** A cota da chave do aluno acabou (por minuto ou no dia). */
export class AiQuotaError extends AiUserError {
  constructor(
    message: string,
    readonly retryAt: Date,
    readonly daily: boolean,
  ) {
    super(message);
  }
}

// ───────────── Chave do aluno ─────────────

const NO_KEY = "Para usar este recurso, conecte sua chave de acesso em Ajustes → Chave de acesso.";

async function keyFor(userId: string | null | undefined): Promise<string> {
  if (!userId) throw new AiKeyError(NO_KEY);
  const user = await db.user.findUnique({ where: { id: userId }, select: { geminiKey: true, aiPausedUntil: true } });
  const key = user?.geminiKey ? openSecret(user.geminiKey) : null;
  if (!key) throw new AiKeyError(NO_KEY);
  if (user!.aiPausedUntil && user!.aiPausedUntil > new Date()) throw quotaError(user!.aiPausedUntil, user!.aiPausedUntil.getTime() - Date.now() > 5 * 60_000);
  return key;
}

/** Chave do Gemini do aluno (para chamadas especiais, como a voz da aula). */
export const userGeminiKey = keyFor;
export const GEMINI_API = API;

function quotaError(retryAt: Date, daily: boolean) {
  return new AiQuotaError(
    daily
      ? "Você chegou ao limite de hoje. Descanse um pouco: logo libera de novo."
      : "Muitos pedidos seguidos. Faça uma pausa de um minuto e tente de novo.",
    retryAt,
    daily,
  );
}

/** Meia-noite no horário do Pacífico: quando o Google zera a cota diária. */
export function nextGoogleReset(now = new Date()) {
  return localDayStart("America/Los_Angeles", new Date(now.getTime() + 24 * 3600_000));
}

type GoogleError = { error?: { code?: number; message?: string; status?: string; details?: { "@type"?: string; reason?: string; retryDelay?: string; violations?: { quotaId?: string }[] }[] } };

/** Interpreta o erro 429 do Google: cota diária ou por minuto, e quando tentar de novo. */
export function parseQuota(body: GoogleError, now = new Date()): { daily: boolean; retryAt: Date } {
  const details = body.error?.details ?? [];
  const ids = details.flatMap((d) => d.violations?.map((v) => v.quotaId ?? "") ?? []);
  const daily = ids.some((id) => /PerDay/i.test(id)) || /per day|daily/i.test(body.error?.message ?? "");
  if (daily) return { daily, retryAt: nextGoogleReset(now) };
  const delay = details.find((d) => d.retryDelay)?.retryDelay;
  const secs = delay ? Math.ceil(parseFloat(delay)) : 60;
  return { daily, retryAt: new Date(now.getTime() + Math.max(15, Math.min(secs, 300)) * 1000) };
}

function isKeyProblem(status: number, body: GoogleError) {
  const reason = body.error?.details?.find((d) => d.reason)?.reason ?? "";
  return (status === 400 && (/API_KEY/i.test(reason) || /api key/i.test(body.error?.message ?? ""))) || status === 401 || status === 403;
}

/** Testa uma chave (sem gastar cota): lista os modelos disponíveis. */
export async function checkGeminiKey(key: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const k = key.trim();
  if (k.length < 20 || /\s/.test(k)) return { ok: false, error: "Essa não parece uma chave do Gemini. Copie a chave inteira (começa com AIza)." };
  if (isMockAi()) return { ok: true };
  try {
    const res = await fetch(`${API}/models?pageSize=1`, { headers: { "x-goog-api-key": k }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as GoogleError;
    if (isKeyProblem(res.status, body)) return { ok: false, error: "O Google recusou essa chave. Confira se copiou a chave inteira ou crie uma nova." };
    return { ok: false, error: "Não conseguimos falar com o Google agora. Tente de novo em instantes." };
  } catch {
    return { ok: false, error: "Não conseguimos falar com o Google agora. Tente de novo em instantes." };
  }
}

// ───────────── Chamada ao Gemini ─────────────

const unavailable = new Set<string>(); // modelos que não existem mais (404) nesta execução

function toGeminiParts(content: string | AiPart[]) {
  const parts = typeof content === "string" ? [{ type: "text", text: content } as AiPart] : content;
  return parts.map((p) =>
    p.type === "text" ? { text: p.text } : { inlineData: { mimeType: p.type === "pdf" ? "application/pdf" : p.mediaType, data: p.data } },
  );
}

/** JSON Schema do Zod limpo para o Gemini (só as palavras-chave que ele aceita). */
export function geminiSchema(schema: z.ZodType): unknown {
  const KEEP = new Set(["type", "properties", "required", "items", "enum", "description", "minimum", "maximum", "minItems", "maxItems", "anyOf", "format", "title", "nullable"]);
  const clean = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(clean);
    if (!node || typeof node !== "object") return node;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      if (!KEEP.has(k)) continue;
      if ((k === "minimum" || k === "maximum") && Math.abs(Number(v)) > 1e12) continue; // limites do "int" do Zod
      if (k === "properties") out[k] = Object.fromEntries(Object.entries(v as object).map(([pk, pv]) => [pk, clean(pv)]));
      else out[k] = clean(v);
    }
    return out;
  };
  return clean(z.toJSONSchema(schema, { unrepresentable: "any" }));
}

type Request = {
  task: AiTask;
  userId?: string | null;
  system: string;
  contents: { role: "user" | "model"; parts: ReturnType<typeof toGeminiParts> }[];
  maxTokens: number;
  schema?: z.ZodType;
  onText?: (delta: string) => void;
};

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
  modelVersion?: string;
};

async function generate(req: Request): Promise<string> {
  const key = await keyFor(req.userId);
  const chain = (await modelChain(req.task, key)).filter((m) => !unavailable.has(m));
  const errors: string[] = [];
  let lastQuota: { daily: boolean; retryAt: Date } | null = null;
  let lastError: unknown = null;

  for (const model of chain) {
    let useSchema = !!req.schema;
    let simple = false; // 2ª tentativa: sem esquema e sem configuração de raciocínio
    let busyRetries = 0;
    for (let attempt = 0; attempt < 2; attempt++) {
      // folga para o "pensamento" dos modelos 2.5+ (que conta no limite de saída)
      const generationConfig: Record<string, unknown> = { maxOutputTokens: Math.min(65_536, req.maxTokens * 2) };
      if (req.schema) {
        generationConfig.responseMimeType = "application/json";
        if (useSchema) generationConfig.responseJsonSchema = geminiSchema(req.schema);
      }
      if (simple) {
        // sem extras
      } else if (/^gemini-2\.5-flash/.test(model)) generationConfig.thinkingConfig = { thinkingBudget: NO_THINKING.includes(req.task) ? 0 : 2048 };
      else if (/^gemini-3/.test(model)) generationConfig.thinkingConfig = { thinkingLevel: "low" };
      const system = useSchema || !req.schema ? req.system : `${req.system}\n\nResponda somente com JSON válido neste formato (JSON Schema):\n${JSON.stringify(geminiSchema(req.schema))}`;

      const url = `${API}/models/${model}:${req.onText ? "streamGenerateContent?alt=sse" : "generateContent"}`;
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: req.contents, generationConfig }),
          signal: AbortSignal.timeout(180_000),
        });
      } catch (e) {
        lastError = e;
        errors.push(`${model}: ${(e as Error).message}`);
        break; // rede/timeout: tenta o próximo modelo
      }

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as GoogleError;
        if (res.status === 404) {
          unavailable.add(model);
          errors.push(`${model}: não existe (404)`);
          break;
        }
        if (res.status === 429) {
          lastQuota = parseQuota(body);
          break; // cota deste modelo acabou: tenta o próximo
        }
        if (isKeyProblem(res.status, body)) {
          throw new AiKeyError("Sua chave de acesso do Google não funciona mais. Cole uma nova em Ajustes → Chave de acesso.");
        }
        if (res.status === 400 && (useSchema || generationConfig.thinkingConfig)) {
          // modelo sem suporte ao esquema ou à configuração de raciocínio: tenta de novo mais simples
          errors.push(`${model}: ${res.status} ${body.error?.message ?? ""}`);
          useSchema = false;
          simple = true;
          continue;
        }
        errors.push(`${model}: ${res.status} ${body.error?.message ?? ""}`);
        lastError = new Error(`Gemini ${model} respondeu ${res.status}: ${body.error?.message ?? ""}`);
        if (res.status >= 500 && busyRetries < 2) {
          // Google sobrecarregado (500/503): espera um pouco e tenta o mesmo modelo de novo
          busyRetries++;
          attempt--;
          await new Promise((r) => setTimeout(r, busyRetries * 4000));
          continue;
        }
        break;
      }

      const data = req.onText ? await readStream(res, req.onText) : ((await res.json()) as GeminiResponse);
      await recordUsage(req.task, data.modelVersion ?? model, req.userId ?? null, data.usageMetadata);
      const candidate = data.candidates?.[0];
      if (data.promptFeedback?.blockReason || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII", "RECITATION"].includes(candidate?.finishReason ?? "")) {
        throw new AiRefusalError("A IA não conseguiu processar este conteúdo.");
      }
      if (candidate?.finishReason === "MAX_TOKENS" && req.schema) {
        errors.push(`${model}: resposta cortada (MAX_TOKENS)`);
        lastError = new Error(`Resposta da IA truncada (${req.task}).`);
        break; // tenta o próximo modelo
      }
      return (candidate?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    }
  }

  if (lastQuota) {
    if (req.userId) await db.user.update({ where: { id: req.userId }, data: { aiPausedUntil: lastQuota.retryAt } }).catch(() => {});
    throw quotaError(lastQuota.retryAt, lastQuota.daily);
  }
  console.error(`[gemini] ${req.task} falhou em todos os modelos:`, errors.join(" | ") || String(lastError));
  throw new AiUnavailableError("Não conseguimos gerar agora. Tente de novo em alguns minutos.", errors.join("\n") || String(lastError ?? "sem modelos"));
}

/** Lê a resposta em SSE (streamGenerateContent), repassando o texto conforme chega. */
async function readStream(res: Response, onText: (delta: string) => void): Promise<GeminiResponse> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let last: GeminiResponse = {};
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const chunk = JSON.parse(line.slice(5)) as GeminiResponse;
      const delta = (chunk.candidates?.[0]?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? "").join("");
      if (delta) {
        text += delta;
        onText(delta);
      }
      last = { ...chunk, usageMetadata: chunk.usageMetadata ?? last.usageMetadata, modelVersion: chunk.modelVersion ?? last.modelVersion };
    }
  }
  return { ...last, candidates: [{ content: { parts: [{ text }] }, finishReason: last.candidates?.[0]?.finishReason }] };
}

async function recordUsage(task: AiTask, model: string, userId: string | null, usage: GeminiResponse["usageMetadata"]) {
  await db.aiUsage.create({
    data: {
      task,
      model,
      userId,
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: (usage?.candidatesTokenCount ?? 0) + (usage?.thoughtsTokenCount ?? 0),
      costMicros: 0, // a chave é do aluno: custo zero para a plataforma
    },
  });
}

/** Chamada com saída estruturada (JSON validado pelo Zod). */
export async function callStructured<S extends z.ZodType>(opts: {
  task: AiTask;
  userId?: string | null;
  system: string;
  content: string | AiPart[];
  schema: S;
  maxTokens?: number;
}): Promise<z.infer<S>> {
  const request: Request = {
    task: opts.task,
    userId: opts.userId,
    system: opts.system,
    contents: [{ role: "user", parts: toGeminiParts(opts.content) }],
    maxTokens: opts.maxTokens ?? 16000,
    schema: opts.schema,
  };
  const text = await generate(request);
  const parsed = opts.schema.safeParse(parseJson(text));
  if (parsed.success) return parsed.data;
  // raro: JSON fora do formato. Uma nova tentativa costuma resolver.
  const retry = opts.schema.safeParse(parseJson(await generate(request)));
  if (retry.success) return retry.data;
  console.error(`[gemini] ${opts.task}: JSON fora do formato`, retry.error.issues.slice(0, 3));
  throw new AiUnavailableError("A IA respondeu fora do formato esperado. Tente de novo.", `JSON inválido em ${opts.task}: ${retry.error.issues[0]?.message ?? ""}`);
}

function parseJson(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

/** Resposta em texto livre com streaming (chat do Professor IA). Retorna o texto completo. */
export async function streamText(opts: {
  task: AiTask;
  userId?: string | null;
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  onText: (delta: string) => void;
  maxTokens?: number;
}): Promise<string> {
  return generate({
    task: opts.task,
    userId: opts.userId,
    system: opts.system,
    contents: opts.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    maxTokens: opts.maxTokens ?? 8000,
    onText: opts.onText,
  });
}

/** Mensagem para o aluno: a do próprio erro quando é um problema da IA dele (chave, cota), senão a genérica. */
export function aiErrorMessage(e: unknown, fallback: string): string {
  return e instanceof AiUserError ? e.message : fallback;
}
