import { NextResponse } from "next/server";
import type { MessageKind } from "@/generated/prisma/enums";
import { apiUser, jsonError } from "@/lib/api";
import { chatAccess, cleanText } from "@/lib/chat";
import { db } from "@/lib/db";
import { MAX_AUDIO_BYTES, MAX_AUDIO_SECONDS, MAX_IMAGE_BYTES, audioType, imageType, newKey } from "@/lib/files";
import { notify } from "@/lib/notifications";
import { allowAttempt } from "@/lib/rate-limit";
import { writeObject } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

const view = (m: { id: string; senderId: string; kind: MessageKind; text: string | null; fileKey: string | null; durationSec: number | null; createdAt: Date; readAt: Date | null }, me: string) => ({
  id: m.id,
  mine: m.senderId === me,
  kind: m.kind,
  text: m.text,
  url: m.fileKey ? `/api/mensagens/${m.id}/arquivo` : null,
  durationSec: m.durationSec,
  createdAt: m.createdAt.toISOString(),
  read: !!m.readAt,
});

/** Mensagens da contratação (a tela pergunta a cada poucos segundos; `after` traz só as novas). */
export async function GET(req: Request, { params }: Ctx) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const access = await chatAccess(id, user);
  if (!access?.read) return jsonError("Chat indisponível.", 403);
  const after = new URL(req.url).searchParams.get("after");
  const since = after && !Number.isNaN(Date.parse(after)) ? new Date(after) : null;
  const msgs = await db.message.findMany({ where: { bookingId: id, ...(since ? { createdAt: { gt: since } } : {}) }, orderBy: { createdAt: "asc" }, take: since ? 100 : 300 });
  if (access.as !== "ADMIN") await db.message.updateMany({ where: { bookingId: id, readAt: null, NOT: { senderId: user.id } }, data: { readAt: new Date() } });
  // confirmações de leitura das minhas mensagens
  const readMine = await db.message.findMany({ where: { bookingId: id, senderId: user.id, readAt: { not: null } }, select: { id: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ messages: msgs.map((m) => view(m, user.id)), readIds: readMine.map((m) => m.id), write: access.write, blocked: access.blocked });
}

/** Envia texto, áudio ou foto. */
export async function POST(req: Request, { params }: Ctx) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const access = await chatAccess(id, user);
  if (!access) return jsonError("Chat indisponível.", 403);
  if (!access.write) return jsonError(access.blocked ? "Conversa bloqueada." : "O chat está fechado para novas mensagens.", 403);
  if (!(await allowAttempt(`chat:${user.id}`, 30, 1))) return jsonError("Muitas mensagens seguidas. Espere um pouco.", 429);
  const form = await req.formData().catch(() => null);
  if (!form) return jsonError("Mensagem inválida.");
  const kind = String(form.get("kind") ?? "TEXT");
  let data: { kind: MessageKind; text?: string; fileKey?: string; mime?: string; durationSec?: number };
  if (kind === "TEXT") {
    const text = cleanText(String(form.get("text") ?? ""));
    if (!text) return jsonError("Escreva a mensagem.");
    data = { kind: "TEXT", text };
  } else if (kind === "IMAGE" || kind === "AUDIO") {
    const file = form.get("file");
    if (!(file instanceof Blob) || !file.size) return jsonError("Envie o arquivo.");
    const max = kind === "IMAGE" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
    if (file.size > max) return jsonError(kind === "IMAGE" ? "Foto grande demais." : "Áudio longo demais.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = kind === "IMAGE" ? imageType(bytes) : audioType(bytes);
    if (!type) return jsonError(kind === "IMAGE" ? "A foto precisa ser JPG, PNG ou WebP." : "Formato de áudio não aceito.");
    const key = newKey(`chat/${id}`, type.ext);
    await writeObject(key, bytes, type.mime);
    const dur = Math.round(Number(form.get("durationSec") ?? 0));
    data = { kind, fileKey: key, mime: type.mime, ...(kind === "AUDIO" ? { durationSec: Math.min(Math.max(dur, 1), MAX_AUDIO_SECONDS) } : {}), text: cleanText(String(form.get("text") ?? "")) || undefined };
  } else return jsonError("Tipo de mensagem inválido.");
  const m = await db.message.create({ data: { bookingId: id, senderId: user.id, ...data } });
  if (access.other) {
    const preview = data.kind === "TEXT" ? (data.text!.length > 80 ? `${data.text!.slice(0, 80)}…` : data.text!) : data.kind === "AUDIO" ? "🎤 Mensagem de áudio" : "📷 Foto";
    await notify(access.other, { title: `Nova mensagem de ${user.name.split(" ")[0]}`, body: preview, href: `/pedidos/${id}#chat`, dedupeKey: `chat:${id}:${access.other}:${Math.floor(Date.now() / 600_000)}` });
  }
  return NextResponse.json({ message: view(m, user.id) });
}
