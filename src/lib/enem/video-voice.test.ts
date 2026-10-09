import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { MATERIAS, lessonTopicId } from "./catalog";
import { lessonVideo } from "@/lib/lesson-slides";
import { splitWords } from "@/lib/speech-align";

beforeAll(() => {
  process.env.AI_MODE = "mock";
  process.env.STORAGE_LOCAL_DIR = mkdtempSync(path.join(tmpdir(), "vv-"));
});

describe("voz do vídeo gravada uma vez por aula", () => {
  it("grava, guarda e devolve o tempo de cada palavra dos slides", async () => {
    const { recordVideoVoice, videoVoiceAudio, videoVoiceStatus } = await import("./video-voice");
    const topicId = lessonTopicId("biologia", 0);
    const before = await videoVoiceStatus(topicId);
    expect(before).toMatchObject({ ready: false, done: 0 });
    await recordVideoVoice(topicId, "mock");
    const s = await videoVoiceStatus(topicId);
    if (!s?.ready) throw new Error("não ficou pronta");
    const lesson = MATERIAS.find((m) => m.slug === "biologia")!.lessons[0];
    const words = lessonVideo(lesson.content, lesson.title).parts.reduce((n, p) => n + splitWords(p).length, 0);
    expect(s.times).toHaveLength(words);
    // tempos sempre para a frente e dentro do áudio
    for (let i = 1; i < s.times.length; i++) expect(s.times[i]).toBeGreaterThanOrEqual(s.times[i - 1]);
    expect(s.times.at(-1)!).toBeLessThan(s.seconds);
    const v = new URL(s.url, "http://x").searchParams.get("v")!;
    expect((await videoVoiceAudio(topicId, v))!.length).toBeGreaterThan(10_000);
    expect(await videoVoiceAudio(topicId, "outra-versao")).toBeNull();
  });
});
