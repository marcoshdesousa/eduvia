import { mkdtempSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/** WAV de teste (LINEAR16 24 kHz) com ~ o tempo que uma voz levaria para ler o texto. */
function wavFor(text: string) {
  const pcm = Buffer.alloc(Math.round(24000 * (text.length / 15)) * 2);
  for (let i = 0; i < pcm.length / 2; i++) pcm.writeInt16LE(Math.round(3000 * Math.sin(i / 6) * (Math.floor(i / 2400) % 3 ? 1 : 0.02)), i * 2);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(24000, 24); h.writeUInt32LE(48000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

let server: Server;
const seen: { key: string; voice: string; chars: number }[] = [];
beforeAll(async () => {
  delete process.env.AI_MODE;
  process.env.STORAGE_LOCAL_DIR = mkdtempSync(path.join(tmpdir(), "vvc-"));
  process.env.GOOGLE_TTS_API_KEY = "chave-de-teste";
  server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const j = JSON.parse(body) as { input: { text: string }; voice: { name: string } };
      seen.push({ key: String(req.headers["x-goog-api-key"]), voice: j.voice.name, chars: Buffer.byteLength(j.input.text) });
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ audioContent: wavFor(j.input.text).toString("base64") }));
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  process.env.GOOGLE_TTS_API_BASE = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
afterAll(() => server.close());

describe("ordem da gravação", () => {
  it("todas as matérias na mesma proporção: as últimas aulas de cada uma ficam por último", async () => {
    const { lessonOrder } = await import("./video-voice");
    const order = lessonOrder();
    expect(order).toHaveLength(508);
    expect(new Set(order).size).toBe(508);
    const firstHalf = order.slice(0, 254);
    // metade da fila = mais ou menos metade de cada matéria
    expect(firstHalf.filter((id) => id.startsWith("enem-a-matematica-")).length).toBe(36);
    expect(firstHalf.filter((id) => id.startsWith("enem-a-artes-")).length).toBe(13);
    expect(order.at(-1)).toMatch(/-(\d+)$/);
  });
});

describe("voz das aulas pelo Google Cloud", () => {
  it("grava com a voz Kore, conta as letras do mês e respeita a trava", async () => {
    const mod = await import("./video-voice");
    const { MonthCapError, monthUsage } = mod;
    const r = await mod.testVideoVoice("ninguem");
    expect(r.via).toContain("pt-BR-Chirp3-HD-Kore");
    expect(seen.at(-1)).toMatchObject({ key: "chave-de-teste", voice: "pt-BR-Chirp3-HD-Kore" });
    const before = await monthUsage();
    expect(before).toBe(seen.reduce((n, x) => n + x.chars, 0));

    // trava: com o limite quase no fim, não manda nada e avisa
    process.env.GOOGLE_TTS_MAX_CHARS_MONTH = String(before + 10);
    const sent = seen.length;
    await expect(mod.testVideoVoice("ninguem")).rejects.toBeInstanceOf(MonthCapError);
    expect(seen.length).toBe(sent);

    // aula sem voz com a trava atingida: bloqueada até o dia 1º do mês que vem (mês do Google)
    const { lessonTopicId } = await import("./catalog");
    const notice = await mod.recordingNotice(lessonTopicId("matematica", 71));
    const [y, m] = mod.googleMonth().split("-").map(Number);
    expect(notice?.readyOn?.toISOString().slice(0, 10)).toBe(`${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-01`);
    delete process.env.GOOGLE_TTS_MAX_CHARS_MONTH;

  });

  it("grava uma aula inteira e ela fica pronta, com o tempo de todas as palavras", async () => {
    const { cloudSpeaker, recordVideoVoice, videoVoiceStatus } = await import("./video-voice");
    const { lessonTopicId } = await import("./catalog");
    const id = lessonTopicId("fisica", 0);
    expect((await videoVoiceStatus(id))?.ready).toBe(false);
    await recordVideoVoice(id, cloudSpeaker);
    const s = await videoVoiceStatus(id);
    expect(s?.ready).toBe(true);
    if (s?.ready) expect(s.times.length).toBeGreaterThan(100);
  });
});
