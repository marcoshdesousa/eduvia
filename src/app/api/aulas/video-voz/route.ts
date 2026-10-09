import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { recordVideoVoiceForUser, videoVoiceStatus } from "@/lib/enem/video-voice";

/** Voz do vídeo de uma aula: pronta (endereço do áudio + tempo de cada palavra) ou quantos pedaços faltam gravar. */
export async function GET(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const s = await videoVoiceStatus(new URL(req.url).searchParams.get("aula") ?? "");
  return s ? NextResponse.json(s) : jsonError("Aula não encontrada.", 404);
}

/** A aula ainda não tem voz: começa a gravar com a chave do Gemini do aluno (uma vez; depois serve para todos). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const aula = new URL(req.url).searchParams.get("aula") ?? "";
  const s = await videoVoiceStatus(aula);
  if (!s) return jsonError("Aula não encontrada.", 404);
  if (!s.ready) await recordVideoVoiceForUser(aula, user.id);
  return NextResponse.json(await videoVoiceStatus(aula));
}
