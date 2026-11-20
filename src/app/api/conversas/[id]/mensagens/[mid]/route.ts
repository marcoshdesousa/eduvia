import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { cleanText, conversationAccess } from "@/lib/chat";
import { db } from "@/lib/db";
import { PHONE_BLOCKED_MSG, containsPhone } from "@/lib/domain";
import { deleteObject } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; mid: string }> };

async function own(ctx: Ctx) {
  const { user, error } = await apiUser();
  if (error) return { error };
  const { id, mid } = await ctx.params;
  const access = await conversationAccess(id, user);
  const m = access ? await db.message.findFirst({ where: { id: mid, conversationId: id, deletedAt: null } }) : null;
  if (!access || !m) return { error: jsonError("Mensagem não encontrada.", 404) };
  if (m.senderId !== user.id) return { error: jsonError("Você só pode mudar as suas mensagens.", 403) };
  return { m };
}

/** Editar o texto de uma mensagem minha (muda para os dois). */
export async function PATCH(req: Request, ctx: Ctx) {
  const r = await own(ctx);
  if ("error" in r) return r.error;
  if (r.m.kind === "SCHEDULE" || r.m.kind === "AUDIO") return jsonError("Esta mensagem não pode ser editada.");
  const body = (await req.json().catch(() => null)) as { text?: string } | null;
  const text = cleanText(String(body?.text ?? ""));
  if (!text && r.m.kind === "TEXT") return jsonError("Escreva a mensagem.");
  if (containsPhone(text)) return jsonError(PHONE_BLOCKED_MSG);
  const m = await db.message.update({ where: { id: r.m.id }, data: { text: text || null, editedAt: new Date() } });
  return NextResponse.json({ ok: true, text: m.text });
}

/** Apagar uma mensagem minha (some para os dois, com o arquivo). */
export async function DELETE(_: Request, ctx: Ctx) {
  const r = await own(ctx);
  if ("error" in r) return r.error;
  if (r.m.kind === "SCHEDULE") return jsonError("Para desfazer um agendamento, cancele o pedido.");
  await db.message.update({ where: { id: r.m.id }, data: { deletedAt: new Date(), text: null, fileKey: null } });
  if (r.m.fileKey) await deleteObject(r.m.fileKey).catch(() => {});
  return NextResponse.json({ ok: true });
}
