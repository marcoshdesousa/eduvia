import { describe, expect, it } from "vitest";
import { z } from "zod";
import { geminiSchema, nextGoogleReset, parseQuota, rankModels } from "./client";

describe("Gemini", () => {
  it("cota por minuto usa o retryDelay do Google", () => {
    const now = new Date("2026-10-05T15:00:00Z");
    const q = parseQuota(
      { error: { code: 429, details: [{ violations: [{ quotaId: "GenerateRequestsPerMinutePerProjectPerModel-FreeTier" }] }, { retryDelay: "37s" }] } },
      now,
    );
    expect(q.daily).toBe(false);
    expect(q.retryAt.toISOString()).toBe("2026-10-05T15:00:37.000Z");
  });
  it("cota diária volta à meia-noite do Pacífico", () => {
    const now = new Date("2026-10-05T15:00:00Z"); // 08:00 em Los Angeles (PDT)
    const q = parseQuota({ error: { code: 429, details: [{ violations: [{ quotaId: "GenerateRequestsPerDayPerProjectPerModel-FreeTier" }] }] } }, now);
    expect(q.daily).toBe(true);
    expect(q.retryAt.toISOString()).toBe("2026-10-06T07:00:00.000Z");
    expect(nextGoogleReset(now)).toEqual(q.retryAt);
  });
  it("esquema JSON sem palavras-chave que o Gemini não aceita", () => {
    const s = geminiSchema(z.object({ a: z.string().describe("x"), b: z.array(z.number().int()) })) as Record<string, unknown>;
    expect(s).not.toHaveProperty("$schema");
    expect(s).not.toHaveProperty("additionalProperties");
    expect(s).toMatchObject({ type: "object", required: ["a", "b"], properties: { a: { type: "string", description: "x" }, b: { type: "array" } } });
  });
  it("escolhe os modelos flash disponíveis na chave, do mais novo ao mais antigo", () => {
    const names = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3-flash-preview", "gemini-flash-latest", "gemini-3.1-flash", "text-embedding-004", "gemini-2.5-flash-preview-tts", "gemini-3.1-flash-lite"];
    expect(rankModels(names)).toEqual(["gemini-flash-latest", "gemini-3.1-flash", "gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"]);
  });
});
