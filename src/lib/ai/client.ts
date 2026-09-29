import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { db } from "@/lib/db";

/** Tarefas de IA. Cada uma pode ter modelo e esforço próprios (via env), para equilibrar custo e qualidade. */
export type AiTask = "outline" | "edital" | "session" | "grade" | "ocr";

const DEFAULT_MODEL = "claude-opus-5-5";

const EFFORT: Record<AiTask, "low" | "medium" | "high"> = {
  outline: "medium",
  edital: "medium",
  session: "medium",
  grade: "low",
  ocr: "low",
};

/** Preço por milhão de tokens (US$): entrada, saída, leitura de cache. */
const PRICES: Record<string, [number, number, number]> = {
  "claude-opus-5-5": [4, 20, 0.2],
  "claude-sonnet-5-5": [2, 10, 0.2],
  "claude-haiku-4-5": [1, 5, 0.1],
};

export function modelFor(task: AiTask): string {
  return process.env[`AI_MODEL_${task.toUpperCase()}`] || process.env.AI_MODEL_DEFAULT || DEFAULT_MODEL;
}

/** Modo simulado: sem chave da Anthropic (ou AI_MODE=mock) o app funciona com gerador local, para desenvolvimento e testes. */
export function isMockAi(): boolean {
  return process.env.AI_MODE === "mock" || !process.env.ANTHROPIC_API_KEY;
}

let client: Anthropic | null = null;
function anthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}

export class AiRefusalError extends Error {}

type ContentBlock = Anthropic.Beta.Messages.BetaContentBlockParam;

/**
 * Chamada com saída estruturada (validada por Zod).
 * O system prompt é estável por tarefa e fica em cache; o conteúdo variável vai na mensagem.
 */
export async function callStructured<S extends z.ZodType>(opts: {
  task: AiTask;
  userId?: string | null;
  system: string;
  content: string | ContentBlock[];
  schema: S;
  maxTokens?: number;
}): Promise<z.infer<S>> {
  const model = modelFor(opts.task);
  const stream = anthropic().beta.messages.stream({
    model,
    max_tokens: opts.maxTokens ?? 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    cache_control: { type: "ephemeral" },
    system: opts.system,
    messages: [{ role: "user", content: opts.content }],
    output_config: { effort: EFFORT[opts.task], format: betaZodOutputFormat(opts.schema) },
  });
  const response = await stream.finalMessage();
  await recordUsage(opts.task, response.model ?? model, opts.userId ?? null, response.usage);

  if (response.stop_reason === "refusal") throw new AiRefusalError("A IA não conseguiu processar este conteúdo.");
  if (response.stop_reason === "max_tokens") throw new Error(`Resposta da IA truncada (${opts.task}).`);
  const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return opts.schema.parse(JSON.parse(text));
}

async function recordUsage(
  task: AiTask,
  model: string,
  userId: string | null,
  usage: { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null },
) {
  const [pin, pout, pcache] = PRICES[model] ?? PRICES[DEFAULT_MODEL];
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const micros = Math.round(
    usage.input_tokens * pin + cacheWrite * pin * 1.25 + cacheRead * pcache + usage.output_tokens * pout,
  );
  await db.aiUsage.create({
    data: {
      task,
      model,
      userId,
      inputTokens: usage.input_tokens + cacheWrite,
      outputTokens: usage.output_tokens,
      cacheReadTokens: cacheRead,
      costMicros: micros,
    },
  });
}
