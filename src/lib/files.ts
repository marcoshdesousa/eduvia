// Fotos e áudios enviados: conferimos o tipo pelo conteúdo do arquivo (não pelo nome) e limitamos o tamanho.
import { randomUUID } from "node:crypto";

export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
export const MAX_AUDIO_SECONDS = 180;

const startsWith = (b: Buffer, sig: number[], at = 0) => sig.every((x, i) => b[at + i] === x);

/** Tipo real da imagem (JPEG, PNG ou WebP) ou null. */
export function imageType(b: Buffer): { mime: string; ext: string } | null {
  if (startsWith(b, [0xff, 0xd8, 0xff])) return { mime: "image/jpeg", ext: "jpg" };
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { mime: "image/png", ext: "png" };
  if (startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8)) return { mime: "image/webp", ext: "webp" };
  return null;
}

/** Tipo real do áudio gravado no celular/navegador (WebM, Ogg, MP4/M4A, MP3) ou null. */
export function audioType(b: Buffer): { mime: string; ext: string } | null {
  if (startsWith(b, [0x1a, 0x45, 0xdf, 0xa3])) return { mime: "audio/webm", ext: "webm" };
  if (startsWith(b, [0x4f, 0x67, 0x67, 0x53])) return { mime: "audio/ogg", ext: "ogg" };
  if (startsWith(b, [0x66, 0x74, 0x79, 0x70], 4)) return { mime: "audio/mp4", ext: "m4a" };
  if (startsWith(b, [0x49, 0x44, 0x33]) || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)) return { mime: "audio/mpeg", ext: "mp3" };
  return null;
}

export const newKey = (folder: string, ext: string) => `${folder}/${randomUUID()}.${ext}`;
