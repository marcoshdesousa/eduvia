import { z } from "zod";
import { apiUser, jsonError } from "@/lib/api";
import { mp3Duration, speak, TTS_MAX_CHARS } from "@/lib/ai/tts";
import { encodeTimes } from "@/lib/speech-align";

/** Áudio (MP3) de um trecho da aula, com a voz do robô (Piper), e o momento em que cada palavra começa. */
export async function POST(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const input = z.object({ text: z.string().trim().min(1).max(TTS_MAX_CHARS + 200), voice: z.string().optional() }).safeParse(await req.json().catch(() => null));
  if (!input.success) return jsonError("Trecho inválido.");
  try {
    const { mp3, times } = await speak(input.data.text);
    const headers: Record<string, string> = { "Content-Type": "audio/mpeg", "X-Audio-Seconds": mp3Duration(mp3).toFixed(3), "Cache-Control": "private, max-age=86400" };
    // momento em que cada palavra começa (medido no áudio): a marcação laranja acompanha a voz
    if (times?.length) headers["X-Word-Times"] = encodeTimes(times);
    return new Response(new Uint8Array(mp3), { headers });
  } catch (e) {
    console.error("[voz]", e);
    return jsonError("A voz do robô não está disponível agora.", 503);
  }
}
