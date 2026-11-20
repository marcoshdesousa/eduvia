// Conversas entre cliente e prestador (estilo WhatsApp): uma por par, antes ou depois de contratar.
import { db } from "@/lib/db";

/** Abre (ou cria) a conversa entre esta pessoa (como cliente) e o prestador. */
export async function conversationWith(clientId: string, proId: string) {
  return db.conversation.upsert({ where: { clientId_proId: { clientId, proId } }, create: { clientId, proId }, update: {} });
}

/** Papel da pessoa na conversa e o que ela pode fazer (null se não participa). */
export async function conversationAccess(conversationId: string, user: { id: string; role: string }) {
  const c = await db.conversation.findUnique({ where: { id: conversationId }, include: { pro: { select: { id: true, userId: true } } } });
  if (!c) return null;
  const as = user.role === "ADMIN" ? "ADMIN" : c.clientId === user.id ? "CLIENT" : c.pro.userId === user.id ? "PRO" : null;
  if (!as) return null;
  const other = as === "CLIENT" ? c.pro.userId : as === "PRO" ? c.clientId : null;
  const blocked = other ? !!(await db.block.findFirst({ where: { OR: [{ blockerId: user.id, blockedId: other }, { blockerId: other, blockedId: user.id }] } })) : false;
  return { conversation: c, as, other, read: true, write: as !== "ADMIN" && !blocked, blocked } as const;
}

/** Mensagens não lidas desta pessoa (para o número no menu). */
export async function unreadMessages(user: { id: string; provider?: { id: string } | null }, side: "client" | "pro" | "all" = "all") {
  const convs = [
    ...(side !== "pro" ? [{ clientId: user.id }] : []),
    ...(side !== "client" && user.provider ? [{ proId: user.provider.id }] : []),
  ];
  if (!convs.length) return 0;
  return db.message.count({ where: { readAt: null, NOT: { senderId: user.id }, conversation: { OR: convs } } });
}

/** Texto limpo: sem caracteres de controle e com tamanho máximo. */
export const cleanText = (t: string) => t.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, 2000);
