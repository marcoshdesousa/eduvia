import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WebSocketServer } from "ws";
import { Mp3Encoder } from "@breezystack/lamejs";
import { alignBoundaries, neuralSpeak, parseAudioFrame, parseTextFrame, secMsGec, voiceText } from "./neural-voice";
import { mp3Duration } from "./tts";

/** MP3 de teste no formato da voz (24 kHz, 48 kbps, mono). */
function tone(seconds: number) {
  const enc = new Mp3Encoder(1, 24000, 48);
  const s = new Int16Array(24000 * seconds).map((_, i) => Math.round(3000 * Math.sin(i / 8)));
  const out: Uint8Array[] = [];
  for (let i = 0; i < s.length; i += 1152) out.push(enc.encodeBuffer(s.subarray(i, i + 1152)));
  out.push(enc.flush());
  return Buffer.concat(out.map((b) => Buffer.from(b)));
}

const frame = (audio: Buffer) => {
  const head = Buffer.from("X-RequestId:1\r\nContent-Type:audio/mpeg\r\nPath:audio\r\n");
  const len = Buffer.alloc(2);
  len.writeUInt16BE(head.length);
  return Buffer.concat([len, head, audio]);
};

describe("voz do vídeo (serviço de vozes neurais)", () => {
  it("token de acesso: hash em maiúsculas que muda a cada 5 minutos", () => {
    const a = secMsGec(Date.UTC(2026, 0, 1, 12, 0, 10));
    expect(a).toMatch(/^[0-9A-F]{64}$/);
    expect(secMsGec(Date.UTC(2026, 0, 1, 12, 4, 50))).toBe(a);
    expect(secMsGec(Date.UTC(2026, 0, 1, 12, 5, 10))).not.toBe(a);
  });

  it("título sem pontuação ganha ponto (para a voz pausar)", () => {
    expect(voiceText("Fase clara\nA luz quebra a água.\n")).toBe("Fase clara.\nA luz quebra a água.");
  });

  it("lê as mensagens do serviço", () => {
    expect(parseAudioFrame(frame(Buffer.from([1, 2, 3])))).toEqual(Buffer.from([1, 2, 3]));
    expect(parseTextFrame("X-RequestId:1\r\nPath:turn.end\r\n\r\n{}")).toEqual({ path: "turn.end", body: "{}" });
  });

  it("encaixa o tempo de cada palavra, mesmo quando o serviço conta diferente", () => {
    const t = alignBoundaries("O CO₂ é fixado em 1.672 metros.", [
      { t: 0.1, text: "O" },
      { t: 0.3, text: "CO₂" },
      { t: 0.8, text: "é" },
      { t: 1.0, text: "fixado" },
      { t: 1.5, text: "em" },
      { t: 1.7, text: "mil seiscentos e setenta e dois" },
      { t: 3.0, text: "metros" },
    ], 3.6);
    // palavras do app: O, CO₂, é, fixado, em, 1, 672, metros
    expect(t).toHaveLength(8);
    expect(t.slice(0, 5)).toEqual([0.1, 0.3, 0.8, 1, 1.5]);
    expect(t[7]).toBe(3);
    expect(t[5]).toBeGreaterThan(1.5);
    expect(t[6]).toBeLessThan(3);
  });

  describe("conversa com o serviço", () => {
    let server: WebSocketServer;
    const seen: { ssml: string; url: string }[] = [];
    beforeAll(async () => {
      process.env.STORAGE_LOCAL_DIR = mkdtempSync(path.join(tmpdir(), "nv-"));
      server = new WebSocketServer({ port: 0 });
      server.on("connection", (ws, req) => {
        const entry = { ssml: "", url: req.url ?? "" };
        seen.push(entry);
        ws.on("message", (m) => {
          const text = m.toString();
          if (!text.includes("Path:ssml")) return;
          entry.ssml = text;
          ws.send("X-RequestId:1\r\nPath:turn.start\r\n\r\n{}");
          const meta = { Metadata: ["Fase", "clara", "A", "luz"].map((w, i) => ({ Type: "WordBoundary", Data: { Offset: (1 + i * 4) * 1e6, Duration: 3e6, text: { Text: w } } })) };
          ws.send(`X-RequestId:1\r\nContent-Type:application/json\r\nPath:audio.metadata\r\n\r\n${JSON.stringify(meta)}`);
          const mp3 = tone(2);
          ws.send(frame(mp3.subarray(0, 900)));
          ws.send(frame(mp3.subarray(900)));
          ws.send("X-RequestId:1\r\nPath:turn.end\r\n\r\n{}");
        });
      });
      await new Promise((r) => server.on("listening", r));
      process.env.EDGE_TTS_URL = `ws://127.0.0.1:${(server.address() as { port: number }).port}/edge`;
    });
    afterAll(() => server.close());

    it("junta o áudio, guarda e devolve o tempo das palavras", async () => {
      const r = await neuralSpeak("Fase clara\nA luz", "f");
      expect(mp3Duration(r.mp3)).toBeGreaterThan(2.2); // 2 s de fala + pausa no fim
      expect(r.times).toEqual([0.1, 0.5, 0.9, 1.3]);
      expect(seen[0].ssml).toContain("FranciscaNeural");
      expect(seen[0].ssml).toContain("Fase clara.\nA luz");
      expect(seen[0].url).toMatch(/Sec-MS-GEC=[0-9A-F]{64}/);
      // a 2ª vez vem do que ficou guardado
      await neuralSpeak("Fase clara\nA luz", "f");
      expect(seen).toHaveLength(1);
    });
  });
});
