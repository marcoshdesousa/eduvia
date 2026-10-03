import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

// Servidores simulados: Gemini (no limite do dia), Groq e Cerebras (formato OpenAI).
const calls: string[] = [];
let groqStatus = 200;
let server: Server;

vi.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: async () => ({ geminiKey: "g", groqKey: "q", cerebrasKey: "c", aiPausedUntil: null }),
      update: async () => ({}),
    },
    aiUsage: { create: async () => ({}) },
  },
}));
vi.mock("@/lib/secret-box", () => ({ openSecret: (s: string) => ({ g: "AIzaChaveFalsa", q: "gsk_chavefalsa", c: "csk-chavefalsa" })[s] ?? null }));

beforeAll(async () => {
  server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      calls.push(`${req.method} ${req.url}`);
      res.setHeader("content-type", "application/json");
      const url = req.url ?? "";
      if (url.startsWith("/gemini/models?")) return res.end(JSON.stringify({ models: [{ name: "models/gemini-9-flash", supportedGenerationMethods: ["generateContent"] }] }));
      if (url.startsWith("/gemini/")) {
        res.statusCode = 429;
        return res.end(JSON.stringify({ error: { code: 429, message: "Quota exceeded per day", details: [] } }));
      }
      if (url.endsWith("/models")) return res.end(JSON.stringify({ data: [{ id: "openai/gpt-oss-120b" }, { id: "gpt-oss-120b" }, { id: "llama-3.3-70b" }] }));
      if (url.endsWith("/chat/completions")) {
        const parsed = JSON.parse(body);
        expect(parsed.messages[0].role).toBe("system");
        expect(parsed.messages[0].content).toContain("JSON");
        if (url.startsWith("/groq") && groqStatus !== 200) {
          res.statusCode = groqStatus;
          return res.end(JSON.stringify({ error: { message: "rate limit" } }));
        }
        const who = url.startsWith("/groq") ? "groq" : "cerebras";
        return res.end(JSON.stringify({ choices: [{ message: { content: `<think>hmm</think>{"frase":"Oi da ${who}"}` }, finish_reason: "stop" }], usage: { prompt_tokens: 9, completion_tokens: 5 } }));
      }
      res.statusCode = 404;
      res.end("{}");
    });
  });
  await new Promise<void>((r) => server.listen(0, r));
  const port = (server.address() as { port: number }).port;
  process.env.GEMINI_API_BASE = `http://127.0.0.1:${port}/gemini`;
  process.env.GROQ_API_BASE = `http://127.0.0.1:${port}/groq`;
  process.env.CEREBRAS_API_BASE = `http://127.0.0.1:${port}/cerebras`;
});
afterAll(() => server.close());
beforeEach(() => {
  calls.length = 0;
  vi.resetModules();
});

const schema = z.object({ frase: z.string() });

describe("3 IAs juntas", () => {
  it("perguntas: a Groq responde primeiro (sem gastar o Gemini)", async () => {
    groqStatus = 200;
    const { callStructured } = await import("./client");
    const out = await callStructured({ task: "questions", userId: "u1", system: "x", content: "y", schema });
    expect(out.frase).toBe("Oi da groq");
    expect(calls.some((c) => c.includes("/gemini/"))).toBe(false);
  });
  it("Groq no limite: a Cerebras assume", async () => {
    groqStatus = 429;
    const { callStructured } = await import("./client");
    const out = await callStructured({ task: "questions", userId: "u2", system: "x", content: "y", schema });
    expect(out.frase).toBe("Oi da cerebras");
  });
  it("aula: tenta o Gemini primeiro; no limite do dia, uma IA extra faz a aula", async () => {
    groqStatus = 200;
    const { callStructured } = await import("./client");
    const out = await callStructured({ task: "session", userId: "u3", system: "x", content: "y", schema });
    expect(calls.some((c) => c.includes("/gemini/models/"))).toBe(true);
    expect(out.frase).toMatch(/Oi da (cerebras|groq)/);
  });
  it("foto ou PDF: só o Gemini lê (as extras não recebem)", async () => {
    const { callStructured, AiQuotaError } = await import("./client");
    await expect(
      callStructured({ task: "ocr", userId: "u4", system: "x", content: [{ type: "image", mediaType: "image/png", data: "AAAA" }], schema }),
    ).rejects.toBeInstanceOf(AiQuotaError);
    expect(calls.some((c) => c.includes("chat/completions"))).toBe(false);
  });
  it("texto grande demais para a Groq: nem tenta nela", async () => {
    groqStatus = 200;
    const { callStructured } = await import("./client");
    const out = await callStructured({ task: "questions", userId: "u5", system: "x", content: "palavra ".repeat(6000), schema });
    expect(out.frase).toBe("Oi da cerebras");
    expect(calls.some((c) => c.startsWith("POST /groq"))).toBe(false);
  });
});
