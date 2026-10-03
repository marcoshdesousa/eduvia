// IAs extras do aluno (grátis, com a chave dele): Groq e Cerebras. As duas usam o formato da OpenAI
// (chat/completions), rodam modelos abertos fortes (GPT-OSS 120B, Qwen 3 235B, Kimi K2, Llama 3.3 70B)
// e entram junto com o Gemini: se uma está ocupada ou no limite, a próxima responde.
// Elas só leem texto: fotos e PDFs escaneados continuam com o Gemini.

export type ExtraProvider = "groq" | "cerebras";

/** XP de presente na primeira vez que o aluno conecta cada IA extra. */
export const IA_EXTRA_XP = 100;

type ProviderInfo = {
  label: string;
  base: () => string;
  /** Modelos preferidos, do melhor para o mais simples (os que existirem na conta são usados). */
  prefer: string[];
  /** Tamanho máximo do pedido (em tokens, ~3,5 letras cada) que cabe no limite grátis. */
  maxPromptTokens: number;
  maxOutputTokens: number;
};

export const EXTRA_PROVIDERS: Record<ExtraProvider, ProviderInfo> = {
  groq: {
    label: "Groq",
    base: () => process.env.GROQ_API_BASE || "https://api.groq.com/openai/v1",
    prefer: ["openai/gpt-oss-120b", "moonshotai/kimi-k2-instruct-0905", "moonshotai/kimi-k2-instruct", "qwen/qwen3-32b", "llama-3.3-70b-versatile"],
    // o plano grátis da Groq aceita pouco texto por minuto: só pedidos menores (perguntas, correções, chat)
    maxPromptTokens: 6000,
    maxOutputTokens: 8000,
  },
  cerebras: {
    label: "Cerebras",
    base: () => process.env.CEREBRAS_API_BASE || "https://api.cerebras.ai/v1",
    prefer: ["gpt-oss-120b", "qwen-3-235b-a22b-instruct-2507", "qwen-3-235b-a22b-thinking-2507", "qwen-3-32b", "llama-3.3-70b", "llama3.1-8b"],
    maxPromptTokens: 55000,
    maxOutputTokens: 16000,
  },
};

export const estimateTokens = (chars: number) => Math.ceil(chars / 3.5);

export type ExtraMessage = { role: "system" | "user" | "assistant"; content: string };

/** Resultado de uma tentativa: texto, ou o motivo para passar à próxima IA. */
export type ExtraResult =
  | { ok: true; text: string; model: string; usage: { input: number; output: number } }
  | { ok: false; kind: "quota" | "key" | "too-big" | "busy" | "format"; detail: string; retryAfter?: number };

const found = new Map<string, { models: string[]; at: number }>();
/** Pausa por IA e por aluno depois de um "limite" (não insiste enquanto a cota não volta). */
const paused = new Map<string, number>();

export function extraPaused(provider: ExtraProvider, userId: string) {
  return (paused.get(`${provider}:${userId}`) ?? 0) > Date.now();
}

async function models(provider: ExtraProvider, key: string): Promise<string[]> {
  const p = EXTRA_PROVIDERS[provider];
  const cacheKey = `${provider}:${key.slice(-8)}`;
  const hit = found.get(cacheKey);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.models;
  let names: string[] = [];
  try {
    const res = await fetch(`${p.base()}/models`, { headers: { authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) names = ((await res.json()) as { data?: { id?: string }[] }).data?.flatMap((m) => (m.id ? [m.id] : [])) ?? [];
  } catch {}
  // os preferidos que existem na conta; se a lista não veio, tenta os preferidos mesmo assim
  const chosen = names.length ? p.prefer.filter((m) => names.includes(m)) : p.prefer;
  const list = chosen.length ? chosen : p.prefer;
  if (names.length) found.set(cacheKey, { models: list, at: Date.now() });
  return list;
}

/** Tira o "pensamento" que alguns modelos escrevem antes da resposta. */
export const stripThinking = (t: string) => t.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

/** Pede uma resposta a uma das IAs extras, tentando os modelos dela em ordem. */
export async function callExtra(
  provider: ExtraProvider,
  key: string,
  userId: string,
  req: { messages: ExtraMessage[]; maxTokens: number; json: boolean; light: boolean },
): Promise<ExtraResult> {
  const p = EXTRA_PROVIDERS[provider];
  const promptTokens = estimateTokens(req.messages.reduce((n, m) => n + m.content.length, 0));
  if (promptTokens > p.maxPromptTokens) return { ok: false, kind: "too-big", detail: `${p.label}: pedido grande demais (${promptTokens} tokens)` };
  let last: ExtraResult = { ok: false, kind: "busy", detail: `${p.label}: sem modelos` };
  for (const model of (await models(provider, key)).slice(0, 3)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const body: Record<string, unknown> = {
        model,
        messages: req.messages,
        max_tokens: Math.min(p.maxOutputTokens, req.maxTokens),
        temperature: 0.4,
      };
      if (req.json && attempt === 0) body.response_format = { type: "json_object" };
      if (/gpt-oss/.test(model)) body.reasoning_effort = req.light ? "low" : "medium";
      let res: Response;
      try {
        res = await fetch(`${p.base()}/chat/completions`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(120_000),
        });
      } catch (e) {
        last = { ok: false, kind: "busy", detail: `${p.label} ${model}: ${(e as Error).message}` };
        break;
      }
      if (res.ok) {
        const data = (await res.json()) as { choices?: { message?: { content?: string | null }; finish_reason?: string }[]; usage?: { prompt_tokens?: number; completion_tokens?: number } };
        const choice = data.choices?.[0];
        const text = stripThinking(choice?.message?.content ?? "");
        if (!text || (req.json && choice?.finish_reason === "length")) {
          last = { ok: false, kind: "format", detail: `${p.label} ${model}: resposta vazia ou cortada` };
          break;
        }
        return { ok: true, text, model: `${provider}:${model}`, usage: { input: data.usage?.prompt_tokens ?? 0, output: data.usage?.completion_tokens ?? 0 } };
      }
      const errText = (await res.text().catch(() => "")).slice(0, 300);
      if (res.status === 401 || res.status === 403) return { ok: false, kind: "key", detail: `${p.label}: chave recusada (${res.status})` };
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after")) || 60;
        paused.set(`${provider}:${userId}`, Date.now() + Math.min(retryAfter, 3600) * 1000);
        return { ok: false, kind: "quota", detail: `${p.label}: limite (${errText})`, retryAfter };
      }
      if (res.status === 413) return { ok: false, kind: "too-big", detail: `${p.label}: pedido grande demais` };
      if (res.status === 400 && attempt === 0 && req.json) {
        last = { ok: false, kind: "format", detail: `${p.label} ${model}: 400 ${errText}` };
        continue; // modelo sem "modo JSON": tenta de novo sem ele (o formato vai no próprio pedido)
      }
      if (res.status === 404 || res.status === 400) {
        last = { ok: false, kind: "busy", detail: `${p.label} ${model}: ${res.status} ${errText}` };
        break; // modelo não existe ou não aceita o pedido: próximo modelo
      }
      last = { ok: false, kind: "busy", detail: `${p.label} ${model}: ${res.status} ${errText}` };
      if (res.status >= 500 && attempt === 0) {
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }
      break;
    }
  }
  return last;
}

/** Testa uma chave (sem gastar cota): lista os modelos. */
export async function checkExtraKey(provider: ExtraProvider, key: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const p = EXTRA_PROVIDERS[provider];
  const k = key.trim();
  if (k.length < 20 || /\s/.test(k)) return { ok: false, error: `Essa não parece uma chave da ${p.label}. Copie a chave inteira.` };
  if (process.env.AI_MODE === "mock") return { ok: true };
  try {
    const res = await fetch(`${p.base()}/models`, { headers: { authorization: `Bearer ${k}` }, signal: AbortSignal.timeout(15_000) });
    if (res.ok) return { ok: true };
    if (res.status === 401 || res.status === 403) return { ok: false, error: `A ${p.label} recusou essa chave. Confira se copiou inteira ou crie uma nova.` };
    return { ok: false, error: `Não conseguimos falar com a ${p.label} agora. Tente de novo em instantes.` };
  } catch {
    return { ok: false, error: `Não conseguimos falar com a ${p.label} agora. Tente de novo em instantes.` };
  }
}
