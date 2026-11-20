import { NextResponse } from "next/server";
import type { MessageKind } from "@/generated/prisma/enums";
import { apiUser, jsonError } from "@/lib/api";
import { cleanText, conversationAccess } from "@/lib/chat";
import { db } from "@/lib/db";
import { MAX_AUDIO_BYTES, MAX_AUDIO_SECONDS, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, audioType, imageType, newKey, videoType } from "@/lib/files";
import { notify } from "@/lib/notifications";
import { allowAttempt } from "@/lib/rate-limit";
import { workerPaid } from "@/lib/session";
import { writeObject } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

type Row = { id: string; senderId: string; kind: MessageKind; text: string | null; fileKey: string | null; durationSec: number | null; createdAt: Date; readAt: Date | null; editedAt: Date | null; bookingId: string | null; booking?: { status: string; scheduledAt: Date; category: string; quantity: number; unit: string; estimateCents: number | null } | null };
const view = (m: Row, me: string) => ({
  id: m.id,
  mine: m.senderId === me,
  kind: m.kind,
  text: m.text,
  url: m.fileKey ? `/api/mensagens/${m.id}/arquivo` : null,
  durationSec: m.durationSec,
  createdAt: m.createdAt.toISOString(),
  read: !!m.readAt,
  edited: !!m.editedAt,
  bookingId: m.bookingId,
  schedule: m.kind === "SCHEDULE" && m.booking ? { status: m.booking.status, at: m.booking.scheduledAt.toISOString(), category: m.booking.category, quantity: m.booking.quantity, unit: m.booking.unit, cents: m.booking.estimateCents } : null,
});
const withBooking = { booking: { select: { status: true, scheduledAt: true, category: true, quantity: true, unit: true, estimateCents: true } } } as const;

/** Mensagens da conversa (a tela pergunta a cada poucos segundos; `after` traz só as novas). */
export async function GET(req: Request, { params }: Ctx) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const access = await conversationAccess(id, user);
  if (!access) return jsonError("Conversa indisponível.", 403);
  if (access.as === "PRO" && !(await workerPaid(access.conversation.pro.id))) return jsonError("Seu plano está vencido. Pague para ver as conversas.", 402);
  const q = new URL(req.url).searchParams;
  const date = (v: string | null) => (v && !Number.isNaN(Date.parse(v)) ? new Date(v) : null);
  const since = date(q.get("after"));
  // `changed`: desde quando procurar mensagens editadas ou apagadas (e cartões de agendamento que mudaram)
  const changedSince = date(q.get("changed"));
  const serverNow = new Date();
  const msgs = await db.message.findMany({ where: { conversationId: id, deletedAt: null, ...(since ? { createdAt: { gt: since } } : {}) }, orderBy: { createdAt: "asc" }, take: since ? 100 : 300, include: withBooking });
  const changed = changedSince
    ? await db.message.findMany({
        where: { conversationId: id, OR: [{ editedAt: { gt: changedSince } }, { deletedAt: { gt: changedSince } }, { kind: "SCHEDULE", booking: { updatedAt: { gt: changedSince } } }] },
        include: withBooking,
        take: 100,
      })
    : [];
  if (access.as !== "ADMIN") await db.message.updateMany({ where: { conversationId: id, readAt: null, NOT: { senderId: user.id } }, data: { readAt: new Date() } });
  // confirmações de leitura das minhas mensagens
  const readMine = await db.message.findMany({ where: { conversationId: id, senderId: user.id, readAt: { not: null } }, select: { id: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({
    messages: msgs.map((m) => view(m, user.id)),
    changes: changed.map((m) => (m.deletedAt ? { id: m.id, deleted: true } : { ...view(m, user.id), deleted: false })),
    now: serverNow.toISOString(),
    readIds: readMine.map((m) => m.id),
    write: access.write,
    blocked: access.blocked,
  });
}

/** Envia texto, áudio, foto ou vídeo. Telefone e WhatsApp são bloqueados (todo contato fica no app). */
export async function POST(req: Request, { params }: Ctx) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const access = await conversationAccess(id, user);
  if (!access) return jsonError("Conversa indisponível.", 403);
  if (access.as === "PRO" && !(await workerPaid(access.conversation.pro.id))) return jsonError("Seu plano está vencido.", 402);
  if (!access.write) return jsonError(access.blocked ? "Conversa bloqueada." : "Não é possível mandar mensagem aqui.", 403);
  if (!(await allowAttempt(`chat:${user.id}`, 30, 1))) return jsonError("Muitas mensagens seguidas. Espere um pouco.", 429);
  const form = await req.formData().catch(() => null);
  if (!form) return jsonError("Mensagem inválida.");
  const kind = String(form.get("kind") ?? "TEXT");
  let data: { kind: MessageKind; text?: string; fileKey?: string; mime?: string; durationSec?: number };
  if (kind === "TEXT") {
    const text = cleanText(String(form.get("text") ?? ""));
    if (!text) return jsonError("Escreva a mensagem.");
    data = { kind: "TEXT", text };
  } else if (kind === "IMAGE" || kind === "AUDIO" || kind === "VIDEO") {
    const file = form.get("file");
    if (!(file instanceof Blob) || !file.size) return jsonError("Envie o arquivo.");
    const max = kind === "IMAGE" ? MAX_IMAGE_BYTES : kind === "VIDEO" ? MAX_VIDEO_BYTES : MAX_AUDIO_BYTES;
    if (file.size > max) return jsonError(kind === "IMAGE" ? "Foto grande demais." : kind === "VIDEO" ? "Vídeo grande demais (máximo 40 MB, cerca de 1 minuto)." : "Áudio longo demais.");
    const caption = cleanText(String(form.get("text") ?? ""));
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = kind === "IMAGE" ? imageType(bytes) : kind === "VIDEO" ? videoType(bytes) : audioType(bytes);
    if (!type) return jsonError(kind === "IMAGE" ? "A foto precisa ser JPG, PNG ou WebP." : kind === "VIDEO" ? "O vídeo precisa ser MP4, MOV ou WebM." : "Formato de áudio não aceito.");
    const key = newKey(`chat/${id}`, type.ext);
    await writeObject(key, bytes, type.mime);
    const dur = Math.round(Number(form.get("durationSec") ?? 0));
    data = { kind, fileKey: key, mime: type.mime, ...(kind === "AUDIO" ? { durationSec: Math.min(Math.max(dur, 1), MAX_AUDIO_SECONDS) } : {}), text: cleanText(String(form.get("text") ?? "")) || undefined };
  } else return jsonError("Tipo de mensagem inválido.");
  const m = await db.message.create({ data: { conversationId: id, senderId: user.id, ...data } });
  await db.conversation.update({ where: { id }, data: { lastMessageAt: m.createdAt } });
  if (access.other) {
    const preview = data.kind === "TEXT" ? (data.text!.length > 80 ? `${data.text!.slice(0, 80)}…` : data.text!) : data.kind === "AUDIO" ? "🎤 Mensagem de áudio" : data.kind === "VIDEO" ? "🎬 Vídeo" : "📷 Foto";
    await notify(access.other, { title: `Nova mensagem de ${user.name.split(" ")[0]}`, body: preview, href: `/mensagens/${id}`, dedupeKey: `chat:${id}:${access.other}:${Math.floor(Date.now() / 600_000)}` });
  }
  return NextResponse.json({ message: view(m, user.id) });
}
