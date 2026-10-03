import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { z } from "zod";

// Simula a API do Google: lista de modelos + generateContent (um modelo "aposentado" devolve 404).
const calls: string[] = [];
let server: Server;

vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: async () => ({ geminiKey: "sealed", aiPausedUntil: null }), update: async () => ({}) },
    aiUsage: { create: async () => ({}) },
  },
}));
vi.mock("@/lib/secret-box", () => ({ openSecret: () => "AIzaChaveFalsa" }));

beforeAll(async () => {
  server = createServer((req, res) => {
    calls.push(`${req.method} ${req.url}`);
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      res.setHeader("content-type", "application/json");
      if (req.url?.startsWith("/models?")) {
        res.end(JSON.stringify({ models: [
          { name: "models/gemini-9-flash", supportedGenerationMethods: ["generateContent"] },
          { name: "models/gemini-8-flash", supportedGenerationMethods: ["generateContent"] },
          { name: "models/text-embedding-004", supportedGenerationMethods: ["embedContent"] },
        ] }));
        return;
      }
      if (req.url?.includes("gemini-9-flash")) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: { code: 404, message: "model retired" } }));
        return;
      }
      const parsed = JSON.parse(body);
      expect(parsed.generationConfig.responseMimeType).toBe("application/json");
      res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"frase":"Você consegue!"}' }] }, finishReason: "STOP" }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 4 } }));
    });
  });
  await new Promise<void>((r) => server.listen(0, r));
  const port = (server.address() as { port: number }).port;
  process.env.GEMINI_API_BASE = `http://127.0.0.1:${port}`;
});
afterAll(() => server.close());

describe("chamada ao Gemini (servidor simulado)", () => {
  it("descobre os modelos, pula o aposentado e lê o JSON", async () => {
    vi.resetModules();
    const { callStructured } = await import("./client");
    const out = await callStructured({ task: "grade", userId: "u1", system: "x", content: "y", schema: z.object({ frase: z.string() }) });
    expect(out.frase).toBe("Você consegue!");
    expect(calls.some((c) => c.includes("gemini-9-flash:generateContent"))).toBe(true);
    expect(calls.some((c) => c.includes("gemini-8-flash:generateContent"))).toBe(true);
  });
});
