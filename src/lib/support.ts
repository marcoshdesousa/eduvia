// Canal de suporte: cada aluno tem uma conversa com a equipe; os admins respondem no /admin (aba Suporte).
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";

export const SUPPORT_MAX_CHARS = 2000;

export async function supportThread(userId: string) {
  return db.supportMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 200 });
}

/** O aluno abriu a conversa: marca as respostas da equipe como lidas. */
export async function markStaffRepliesRead(userId: string) {
  await db.supportMessage.updateMany({ where: { userId, fromStaff: true, readAt: null }, data: { readAt: new Date() } });
}

/** A equipe abriu a conversa: marca as mensagens do aluno como lidas. */
export async function markUserMessagesRead(userId: string) {
  await db.supportMessage.updateMany({ where: { userId, fromStaff: false, readAt: null }, data: { readAt: new Date() } });
}

export async function sendSupportMessage(user: { id: string; name: string; handle: string | null }, body: string) {
  const msg = await db.supportMessage.create({ data: { userId: user.id, body } });
  // avisa os admins (uma notificação por conversa até alguém responder)
  const admins = await db.user.findMany({ where: { isAdmin: true, id: { not: user.id } }, select: { id: true } });
  for (const a of admins) {
    await notify(a.id, {
      type: "SUPPORT_MESSAGE",
      title: `Suporte: nova mensagem de @${user.handle}`,
      body: body.slice(0, 120),
      href: `/admin?aba=suporte&aluno=${user.id}`,
      dedupeKey: `suporte:${user.id}:${msg.id}`,
    });
  }
  return msg;
}

export async function replySupport(userId: string, body: string) {
  const msg = await db.supportMessage.create({ data: { userId, body, fromStaff: true } });
  await markUserMessagesRead(userId);
  await notify(userId, { type: "SUPPORT_REPLY", title: "O suporte respondeu sua mensagem", body: body.slice(0, 120), href: "/suporte", dedupeKey: `suporte-resp:${msg.id}` });
  return msg;
}

/** Caixa de entrada da equipe: conversas mais recentes primeiro, com nº de mensagens não lidas. */
export async function supportInbox() {
  const latest = await db.supportMessage.groupBy({ by: ["userId"], _max: { createdAt: true }, orderBy: { _max: { createdAt: "desc" } }, take: 50 });
  const [users, unread] = await Promise.all([
    db.user.findMany({ where: { id: { in: latest.map((l) => l.userId) } }, select: { id: true, name: true, handle: true, avatar: true } }),
    db.supportMessage.groupBy({ by: ["userId"], where: { fromStaff: false, readAt: null }, _count: true }),
  ]);
  const lastMsgs = await Promise.all(latest.map((l) => db.supportMessage.findFirst({ where: { userId: l.userId }, orderBy: { createdAt: "desc" } })));
  return latest.map((l, i) => ({
    user: users.find((u) => u.id === l.userId)!,
    last: lastMsgs[i]!,
    unread: unread.find((u) => u.userId === l.userId)?._count ?? 0,
  })).filter((c) => c.user);
}

export async function supportUnreadForStaff() {
  return db.supportMessage.count({ where: { fromStaff: false, readAt: null } });
}
