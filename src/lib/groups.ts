// Grupos de estudo: membros e papéis, convites por @, mural e compartilhamento de recursos.
import { db } from "@/lib/db";
import type { GroupRole, ShareType } from "@/generated/prisma/enums";
import { notify } from "@/lib/notifications";
import { checkAchievementsSafe } from "@/lib/achievements";
import { groupAccessError, groupCreateError } from "@/lib/billing";

export const MAX_MEMBERS = 50;

export class GroupError extends Error {}

export async function getMembership(groupId: string, userId: string) {
  return db.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
}

const canManage = (role: GroupRole) => role === "OWNER" || role === "ADMIN";

async function requireMember(groupId: string, userId: string) {
  const m = await getMembership(groupId, userId);
  if (!m) throw new GroupError("Você não participa deste grupo.");
  return m;
}

async function requireManager(groupId: string, userId: string) {
  const m = await requireMember(groupId, userId);
  if (!canManage(m.role)) throw new GroupError("Só o dono e os administradores podem fazer isso.");
  return m;
}

/** Código de 6 caracteres sem letras/números que confundem (0/O, 1/I). */
function newGroupCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function uniqueGroupCode() {
  for (let i = 0; i < 10; i++) {
    const code = newGroupCode();
    if (!(await db.group.findUnique({ where: { code } }))) return code;
  }
  throw new GroupError("Não foi possível gerar o código do grupo. Tente de novo.");
}

export async function createGroup(user: { id: string }, name: string, description?: string) {
  const clean = name.trim();
  if (clean.length < 3 || clean.length > 60) throw new GroupError("O nome do grupo precisa ter de 3 a 60 caracteres.");
  const blocked = await groupCreateError(user);
  if (blocked) throw new GroupError(blocked);
  const group = await db.group.create({
    data: { name: clean, code: await uniqueGroupCode(), description: description?.trim().slice(0, 300) || null, ownerId: user.id, members: { create: { userId: user.id, role: "OWNER" } } },
  });
  await checkAchievementsSafe(user.id);
  return group;
}

export async function inviteByHandle(groupId: string, inviterId: string, rawHandle: string) {
  await requireManager(groupId, inviterId);
  const handle = rawHandle.trim().replace(/^@/, "").toLowerCase();
  const invitee = await db.user.findUnique({ where: { handle } });
  if (!invitee || !invitee.cpf) throw new GroupError(`Não encontramos ninguém com o @${handle}.`);
  if (invitee.id === inviterId) throw new GroupError("Você já está no grupo.");
  if (await getMembership(groupId, invitee.id)) throw new GroupError(`@${handle} já participa do grupo.`);
  const pending = await db.groupInvite.findFirst({ where: { groupId, inviteeId: invitee.id, status: "PENDING" } });
  if (pending) throw new GroupError(`@${handle} já tem um convite pendente.`);
  const count = await db.groupMember.count({ where: { groupId } });
  if (count >= MAX_MEMBERS) throw new GroupError(`O grupo chegou ao limite de ${MAX_MEMBERS} pessoas.`);
  const [group, inviter] = await Promise.all([db.group.findUniqueOrThrow({ where: { id: groupId } }), db.user.findUniqueOrThrow({ where: { id: inviterId } })]);
  const invite = await db.groupInvite.create({ data: { groupId, inviterId, inviteeId: invitee.id } });
  await notify(invitee.id, {
    type: "GROUP_INVITE",
    title: `@${inviter.handle} convidou você para o grupo "${group.name}"`,
    body: "Toque para aceitar ou recusar.",
    href: "/grupos",
    dedupeKey: `convite:${invite.id}`,
  });
  return invite;
}

export async function respondInvite(inviteId: string, userId: string, accept: boolean) {
  const invite = await db.groupInvite.findFirst({ where: { id: inviteId, inviteeId: userId, status: "PENDING" }, include: { group: true, invitee: true } });
  if (!invite) throw new GroupError("Convite não encontrado.");
  if (accept) {
    const blocked = await groupAccessError(invite.invitee);
    if (blocked) throw new GroupError(blocked);
    const count = await db.groupMember.count({ where: { groupId: invite.groupId } });
    if (count >= MAX_MEMBERS) throw new GroupError("O grupo está cheio.");
    await db.$transaction([
      db.groupInvite.update({ where: { id: inviteId }, data: { status: "ACCEPTED", respondedAt: new Date() } }),
      db.groupMember.upsert({ where: { groupId_userId: { groupId: invite.groupId, userId } }, create: { groupId: invite.groupId, userId }, update: {} }),
    ]);
    await notify(invite.inviterId, {
      type: "INVITE_ACCEPTED",
      title: `@${invite.invitee.handle} entrou no grupo "${invite.group.name}"`,
      href: `/grupos/${invite.groupId}`,
      dedupeKey: `aceite:${invite.id}`,
    });
    await checkAchievementsSafe(userId);
  } else {
    await db.groupInvite.update({ where: { id: inviteId }, data: { status: "DECLINED", respondedAt: new Date() } });
  }
  return invite.groupId;
}

/** Entrar num grupo usando o código dele (ex.: K7M2QX). */
export async function joinByCode(user: { id: string; handle: string | null }, rawCode: string) {
  const code = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== 6) throw new GroupError("O código do grupo tem 6 letras/números.");
  const group = await db.group.findUnique({ where: { code } });
  if (!group) throw new GroupError("Não encontramos nenhum grupo com esse código.");
  if (await getMembership(group.id, user.id)) return group.id;
  const me = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const blocked = await groupAccessError(me);
  if (blocked) throw new GroupError(blocked);
  const count = await db.groupMember.count({ where: { groupId: group.id } });
  if (count >= MAX_MEMBERS) throw new GroupError("O grupo está cheio.");
  await db.groupMember.create({ data: { groupId: group.id, userId: user.id } });
  // convites pendentes para este grupo viram "aceitos"
  await db.groupInvite.updateMany({ where: { groupId: group.id, inviteeId: user.id, status: "PENDING" }, data: { status: "ACCEPTED", respondedAt: new Date() } });
  await notify(group.ownerId, { type: "INVITE_ACCEPTED", title: `@${user.handle} entrou no grupo "${group.name}" pelo código`, href: `/grupos/${group.id}`, dedupeKey: `codigo:${group.id}:${user.id}` });
  await checkAchievementsSafe(user.id);
  return group.id;
}

export async function cancelInvite(inviteId: string, actorId: string) {
  const invite = await db.groupInvite.findUnique({ where: { id: inviteId } });
  if (!invite || invite.status !== "PENDING") return;
  await requireManager(invite.groupId, actorId);
  await db.groupInvite.update({ where: { id: inviteId }, data: { status: "CANCELED", respondedAt: new Date() } });
}

export async function setRole(groupId: string, actorId: string, targetId: string, role: "ADMIN" | "MEMBER") {
  const actor = await requireMember(groupId, actorId);
  if (actor.role !== "OWNER") throw new GroupError("Só o dono muda os papéis.");
  const target = await requireMember(groupId, targetId);
  if (target.role === "OWNER") throw new GroupError("O dono não pode mudar o próprio papel.");
  await db.groupMember.update({ where: { groupId_userId: { groupId, userId: targetId } }, data: { role } });
}

export async function removeMember(groupId: string, actorId: string, targetId: string) {
  const actor = await requireManager(groupId, actorId);
  const target = await requireMember(groupId, targetId);
  if (target.role === "OWNER") throw new GroupError("O dono não pode ser removido.");
  if (target.role === "ADMIN" && actor.role !== "OWNER") throw new GroupError("Só o dono remove administradores.");
  await db.groupMember.delete({ where: { groupId_userId: { groupId, userId: targetId } } });
}

export async function leaveGroup(groupId: string, userId: string) {
  const m = await requireMember(groupId, userId);
  if (m.role === "OWNER") throw new GroupError("Passe a posse do grupo para outra pessoa (ou exclua o grupo) antes de sair.");
  await db.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });
}

export async function transferOwnership(groupId: string, ownerId: string, targetId: string) {
  const m = await requireMember(groupId, ownerId);
  if (m.role !== "OWNER") throw new GroupError("Só o dono pode passar a posse.");
  await requireMember(groupId, targetId);
  await db.$transaction([
    db.groupMember.update({ where: { groupId_userId: { groupId, userId: ownerId } }, data: { role: "ADMIN" } }),
    db.groupMember.update({ where: { groupId_userId: { groupId, userId: targetId } }, data: { role: "OWNER" } }),
    db.group.update({ where: { id: groupId }, data: { ownerId: targetId } }),
  ]);
}

export async function deleteGroup(groupId: string, ownerId: string) {
  const m = await requireMember(groupId, ownerId);
  if (m.role !== "OWNER") throw new GroupError("Só o dono pode excluir o grupo.");
  await db.group.delete({ where: { id: groupId } });
}

// ───────────── Mural ─────────────

export async function postMessage(groupId: string, userId: string, content: string) {
  await requireMember(groupId, userId);
  const text = content.trim();
  if (!text) throw new GroupError("Escreva uma mensagem.");
  if (text.length > 1000) throw new GroupError("Mensagem longa demais (máx. 1000 caracteres).");
  const recent = await db.groupMessage.count({ where: { authorId: userId, createdAt: { gt: new Date(Date.now() - 60_000) } } });
  if (recent >= 20) throw new GroupError("Calma! Muitas mensagens em pouco tempo.");
  return db.groupMessage.create({ data: { groupId, authorId: userId, content: text } });
}

export async function deleteMessage(messageId: string, actorId: string) {
  const msg = await db.groupMessage.findUnique({ where: { id: messageId } });
  if (!msg) return;
  const m = await requireMember(msg.groupId, actorId);
  if (msg.authorId !== actorId && !canManage(m.role)) throw new GroupError("Você não pode apagar esta mensagem.");
  await db.groupMessage.update({ where: { id: messageId }, data: { deletedAt: new Date() } });
}

// ───────────── Compartilhamento ─────────────

/** Confere que o recurso é do próprio usuário e devolve o título para exibir no grupo. */
async function ownedResourceTitle(userId: string, type: ShareType, resourceId: string): Promise<string | null> {
  switch (type) {
    case "MATERIAL": {
      const m = await db.material.findFirst({ where: { id: resourceId, preparation: { userId }, status: "READY", role: "CONTENT" } });
      return m?.title ?? null;
    }
    case "SUMMARY": {
      const t = await db.studyText.findFirst({ where: { id: resourceId, topic: { subject: { preparation: { userId } } } }, include: { topic: true } });
      return t ? `${t.topic.title}${t.partCount > 1 ? ` (parte ${t.part}/${t.partCount})` : ""}` : null;
    }
    case "QUESTION_SET": {
      const t = await db.topic.findFirst({ where: { id: resourceId, subject: { preparation: { userId } }, questions: { some: {} } } });
      return t ? `Questões: ${t.title}` : null;
    }
    case "EXAM": {
      const e = await db.exam.findFirst({ where: { id: resourceId, ownerId: userId } });
      return e?.title ?? null;
    }
  }
}

export async function shareResource(groupId: string, userId: string, type: ShareType, resourceId: string) {
  await requireMember(groupId, userId);
  const title = await ownedResourceTitle(userId, type, resourceId);
  if (!title) throw new GroupError("Você só pode compartilhar o que é seu (e o material precisa estar pronto).");
  const existing = await db.groupShare.findUnique({ where: { groupId_type_resourceId: { groupId, type, resourceId } } });
  if (existing) throw new GroupError("Isso já está compartilhado neste grupo.");
  const share = await db.groupShare.create({ data: { groupId, sharedById: userId, type, resourceId, title: title.slice(0, 200) } });
  const [group, author, members] = await Promise.all([
    db.group.findUniqueOrThrow({ where: { id: groupId } }),
    db.user.findUniqueOrThrow({ where: { id: userId } }),
    db.groupMember.findMany({ where: { groupId, userId: { not: userId } } }),
  ]);
  const what = { MATERIAL: "um material", SUMMARY: "um resumo", QUESTION_SET: "uma lista de questões", EXAM: "um simulado" }[type];
  for (const m of members) {
    await notify(m.userId, { type: "GROUP_SHARE", title: `@${author.handle} compartilhou ${what} em "${group.name}"`, body: title, href: `/grupos/${groupId}?aba=compartilhados`, dedupeKey: `share:${share.id}` }, { push: type === "EXAM" });
  }
  return share;
}

export async function unshare(shareId: string, actorId: string) {
  const share = await db.groupShare.findUnique({ where: { id: shareId } });
  if (!share) return;
  const m = await requireMember(share.groupId, actorId);
  if (share.sharedById !== actorId && !canManage(m.role)) throw new GroupError("Só quem compartilhou ou um administrador pode remover.");
  await db.groupShare.delete({ where: { id: shareId } });
}

/** Ids dos recursos de um tipo compartilhados em algum grupo do usuário. */
async function sharedWith(userId: string, type: ShareType, resourceId: string) {
  return !!(await db.groupShare.findFirst({ where: { type, resourceId, group: { members: { some: { userId } } } }, select: { id: true } }));
}

// ───────────── Acesso (dono ou membro de grupo onde foi compartilhado) ─────────────

export async function canAccessMaterial(userId: string, materialId: string) {
  const own = await db.material.findFirst({ where: { id: materialId, preparation: { userId } }, select: { id: true } });
  return !!own || sharedWith(userId, "MATERIAL", materialId);
}

export async function canAccessExam(userId: string, examId: string) {
  const own = await db.exam.findFirst({ where: { id: examId, ownerId: userId }, select: { id: true } });
  return !!own || sharedWith(userId, "EXAM", examId);
}

export async function canAccessStudyText(userId: string, studyTextId: string) {
  const own = await db.studyText.findFirst({ where: { id: studyTextId, topic: { subject: { preparation: { userId } } } }, select: { id: true } });
  return !!own || sharedWith(userId, "SUMMARY", studyTextId);
}

/** Questão: da própria preparação, de uma lista de questões compartilhada ou de um simulado compartilhado. */
export async function canAccessQuestion(userId: string, question: { id: string; topicId: string; topic: { subject: { preparation: { userId: string } } } }) {
  if (question.topic.subject.preparation.userId === userId) return true;
  if (await sharedWith(userId, "QUESTION_SET", question.topicId)) return true;
  const exam = await db.exam.findFirst({
    where: { questionIds: { has: question.id }, OR: [{ ownerId: userId }, { id: { in: await sharedExamIds(userId) } }] },
    select: { id: true },
  });
  return !!exam;
}

async function sharedExamIds(userId: string) {
  const shares = await db.groupShare.findMany({ where: { type: "EXAM", group: { members: { some: { userId } } } }, select: { resourceId: true } });
  return shares.map((s) => s.resourceId);
}

/** Ranking de um simulado entre os membros do grupo: melhor tentativa de cada um (nota, depois tempo). */
export async function examRanking(examId: string, groupId: string) {
  const members = await db.groupMember.findMany({ where: { groupId }, include: { user: { select: { id: true, name: true, handle: true } } } });
  const attempts = await db.examAttempt.findMany({ where: { examId, finishedAt: { not: null }, userId: { in: members.map((m) => m.userId) } } });
  const best = new Map<string, (typeof attempts)[number]>();
  for (const a of attempts) {
    const cur = best.get(a.userId);
    if (!cur || a.score! > cur.score! || (a.score === cur.score && (a.timeSpentSec ?? 0) < (cur.timeSpentSec ?? 0))) best.set(a.userId, a);
  }
  return members
    .flatMap((m) => {
      const a = best.get(m.userId);
      return a ? [{ user: m.user, score: a.score!, correct: a.correct!, total: a.total!, timeSpentSec: a.timeSpentSec ?? 0 }] : [];
    })
    .sort((x, y) => y.score - x.score || x.timeSpentSec - y.timeSpentSec);
}

/** XP de cada membro nos últimos 7 dias. */
export async function weeklyXpRanking(groupId: string) {
  const members = await db.groupMember.findMany({ where: { groupId }, include: { user: { select: { id: true, name: true, handle: true, xp: true } } } });
  const since = new Date(Date.now() - 7 * 86_400_000);
  const sums = await db.xpEvent.groupBy({ by: ["userId"], where: { userId: { in: members.map((m) => m.userId) }, createdAt: { gte: since } }, _sum: { amount: true } });
  const by = new Map(sums.map((s) => [s.userId, s._sum.amount ?? 0]));
  return members.map((m) => ({ user: m.user, role: m.role, weekXp: by.get(m.userId) ?? 0 })).sort((a, b) => b.weekXp - a.weekXp || b.user.xp - a.user.xp);
}
