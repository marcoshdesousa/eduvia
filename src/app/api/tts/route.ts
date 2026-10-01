import { z } from "zod";
import { apiUser, jsonError } from "@/lib/api";
import { aiErrorMessage } from "@/lib/ai/client";
import { speak, TTS_MAX_CHARS } from "@/lib/ai/tts";

/** Áudio (WAV) de um trecho da aula, com a voz natural escolhida. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const input = z.object({ text: z.string().trim().min(1).max(TTS_MAX_CHARS + 200), voice: z.enum(["f", "m"]) }).safeParse(await req.json().catch(() => null));
  if (!input.success) return jsonError("Trecho inválido.");
  try {
    const wav = await speak(user.id, input.data.text, input.data.voice);
    return new Response(new Uint8Array(wav), { headers: { "Content-Type": "audio/wav", "Cache-Control": "private, max-age=86400" } });
  } catch (e) {
    console.error("[voz]", e);
    return jsonError(aiErrorMessage(e, "A voz natural não está disponível agora."), 503);
  }
}
