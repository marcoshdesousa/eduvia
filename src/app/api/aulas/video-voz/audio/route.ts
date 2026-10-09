import { apiUser, jsonError } from "@/lib/api";
import { videoVoiceAudio } from "@/lib/enem/video-voice";

/**
 * O áudio pronto da aula (MP3). Aceita pedaços (Range): o vídeo começa a tocar na hora, sem baixar tudo antes,
 * e dá para pular para qualquer ponto. O endereço muda quando a aula muda (v), então pode ficar guardado no celular.
 */
export async function GET(req: Request) {
  const { error } = await apiUser();
  if (error) return error;
  const q = new URL(req.url).searchParams;
  const mp3 = await videoVoiceAudio(q.get("aula") ?? "", q.get("v") ?? "");
  if (!mp3) return jsonError("Áudio não encontrado.", 404);
  const headers: Record<string, string> = { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes", "Cache-Control": "private, max-age=31536000, immutable" };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    const size = mp3.length;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    return new Response(new Uint8Array(mp3.subarray(start, end + 1)), { status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) } });
  }
  return new Response(new Uint8Array(mp3), { headers: { ...headers, "Content-Length": String(mp3.length) } });
}
