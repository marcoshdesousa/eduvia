// Suporte por chamados: o aluno abre um chamado com um tipo; a equipe responde no /admin (aba Suporte)
// e finaliza. Chamado finalizado não aceita novas mensagens; para outro assunto, o aluno abre outro chamado.
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";

export const SUPPORT_MAX_CHARS = 2000;
export const SUPPORT_KINDS = ["Dúvida", "Problema técnico", "Pagamento e assinatura", "Sugestão", "Outro"] as const;

export class SupportError extends Error {}

export async function userTickets(userId: string) {
  return db.supportTicket.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { fromStaff: true, readAt: null } } } },
    },
  });
}

export async function ticketFor(ticketId: string, userId?: string) {
  return db.supportTicket.findFirst({
    where: { id: ticketId, ...(userId ? { userId } : {}) },
    include: { messages: { orderBy: { createdAt: "asc" } }, user: { select: { id: true, name: true, handle: true, phone: true, avatar: true } } },
  });
}

async function notifyStaff(user: { id: string; handle: string | null }, ticketId: string, messageId: string, body: string, kind: string) {
  const admins = await db.user.findMany({ where: { isAdmin: true, id: { not: user.id } }, select: { id: true } });
  for (const a of admins) {
    await notify(a.id, {
      type: "SUPPORT_MESSAGE",
      title: `Suporte (${kind}): mensagem de @${user.handle}`,
      body: body.slice(0, 120),
      href: `/admin?aba=suporte&chamado=${ticketId}`,
      dedupeKey: `suporte:${messageId}`,
    });
  }
}

export async function openTicket(user: { id: string; handle: string | null }, kind: string, body: string) {
  if (!(SUPPORT_KINDS as readonly string[]).includes(kind)) throw new SupportError("Escolha o tipo do chamado.");
  const ticket = await db.supportTicket.create({ data: { userId: user.id, kind, messages: { create: { userId: user.id, body } } }, include: { messages: true } });
  await notifyStaff(user, ticket.id, ticket.messages[0].id, body, kind);
  return ticket;
}

export async function sendInTicket(user: { id: string; handle: string | null }, ticketId: string, body: string) {
  const ticket = await db.supportTicket.findFirst({ where: { id: ticketId, userId: user.id } });
  if (!ticket) throw new SupportError("Chamado não encontrado.");
  if (ticket.status === "CLOSED") throw new SupportError("Este chamado foi finalizado. Para outro assunto, abra um novo chamado.");
  const msg = await db.supportMessage.create({ data: { userId: user.id, ticketId, body } });
  await db.supportTicket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } });
  await notifyStaff(user, ticketId, msg.id, body, ticket.kind);
  return msg;
}

/** O aluno abriu o chamado: marca as respostas da equipe como lidas. */
export async function markStaffRepliesRead(ticketId: string) {
  await db.supportMessage.updateMany({ where: { ticketId, fromStaff: true, readAt: null }, data: { readAt: new Date() } });
}

/** A equipe abriu o chamado: marca as mensagens do aluno como lidas. */
export async function markUserMessagesRead(ticketId: string) {
  await db.supportMessage.updateMany({ where: { ticketId, fromStaff: false, readAt: null }, data: { readAt: new Date() } });
}

export async function replyTicket(ticketId: string, body: string) {
  const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new SupportError("Chamado não encontrado.");
  if (ticket.status === "CLOSED") throw new SupportError("Chamado finalizado.");
  const msg = await db.supportMessage.create({ data: { userId: ticket.userId, ticketId, body, fromStaff: true } });
  await db.supportTicket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } });
  await markUserMessagesRead(ticketId);
  await notify(ticket.userId, { type: "SUPPORT_REPLY", title: "O suporte respondeu seu chamado", body: body.slice(0, 120), href: `/suporte/${ticketId}`, dedupeKey: `suporte-resp:${msg.id}` });
  return msg;
}

export async function closeTicket(ticketId: string) {
  const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket || ticket.status === "CLOSED") return;
  await db.supportTicket.update({ where: { id: ticketId }, data: { status: "CLOSED", closedAt: new Date() } });
  await markUserMessagesRead(ticketId);
  await notify(ticket.userId, { type: "SUPPORT_REPLY", title: `Chamado finalizado: ${ticket.kind}`, body: "Se precisar de algo mais, é só abrir um novo chamado.", href: `/suporte/${ticketId}`, dedupeKey: `suporte-fim:${ticketId}` });
}

/** Caixa de entrada da equipe: abertos primeiro, depois os mais recentes. */
export async function staffTickets() {
  return db.supportTicket.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: 100,
    include: {
      user: { select: { id: true, name: true, handle: true, avatar: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { fromStaff: false, readAt: null } } } },
    },
  });
}

export async function supportUnreadForStaff() {
  return db.supportMessage.count({ where: { fromStaff: false, readAt: null, ticket: { status: "OPEN" } } });
}
