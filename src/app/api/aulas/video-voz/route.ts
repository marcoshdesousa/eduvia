import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { videoVoiceStatus } from "@/lib/enem/video-voice";

/** Voz gravada de uma aula: pronta (endereço do áudio + tempo de cada palavra) ou ainda não gravada. */
export async function GET(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const s = await videoVoiceStatus(new URL(req.url).searchParams.get("aula") ?? "");
  return s ? NextResponse.json(s) : jsonError("Aula não encontrada.", 404);
}
