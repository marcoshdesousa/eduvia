"use server";
import { allowAttempt } from "@/lib/rate-limit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { uploadLimitError } from "@/lib/billing";
import { enqueue } from "@/lib/queue";
import {
  cancelInvite,
  createGroup,
  createTournament,
  endTournament,
  deleteGroup,
  deleteMessage,
  getMembership,
  GroupError,
  inviteByHandle,
  leaveGroup,
  postMessage,
  removeMember,
  respondInvite,
  joinByCode,
  setRole,
  shareResource,
  transferOwnership,
  unshare,
} from "@/lib/groups";
import type { ShareType } from "@/generated/prisma/enums";
import type { FormState } from "./account";

type Result = { ok?: boolean; error?: string; message?: string };

async function run(fn: () => Promise<unknown>, path?: string): Promise<Result> {
  try {
    await fn();
    if (path) revalidatePath(path);
    return { ok: true };
  } catch (e) {
    if (e instanceof GroupError) return { error: e.message };
    throw e;
  }
}

export async function createGroupAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  let id: string;
  try {
    id = (await createGroup(user, String(f.get("name") ?? ""), String(f.get("description") ?? ""))).id;
  } catch (e) {
    if (e instanceof GroupError) return { error: e.message };
    throw e;
  }
  redirect(`/grupos/${id}?aba=membros`);
}

export async function joinByCodeAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  if (!(await allowAttempt(`join:${user.id}`, 20, 10))) return { error: "Muitas tentativas. Aguarde alguns minutos." };
  let id: string;
  try {
    id = await joinByCode(user, String(f.get("code") ?? ""));
  } catch (e) {
    if (e instanceof GroupError) return { error: e.message };
    throw e;
  }
  redirect(`/grupos/${id}`);
}

export async function inviteAction(groupId: string, handle: string): Promise<Result> {
  const user = await requireReadyUser();
  const r = await run(() => inviteByHandle(groupId, user.id, handle), `/grupos/${groupId}`);
  return r.ok ? { ok: true, message: `Convite enviado para @${handle.replace(/^@/, "")}.` } : r;
}

export async function respondInviteAction(inviteId: string, accept: boolean): Promise<Result> {
  const user = await requireReadyUser();
  let groupId: string | undefined;
  const r = await run(async () => {
    groupId = await respondInvite(inviteId, user.id, accept);
  }, "/grupos");
  if (r.ok && accept && groupId) redirect(`/grupos/${groupId}`);
  return r;
}

export async function cancelInviteAction(inviteId: string, groupId: string) {
  const user = await requireReadyUser();
  return run(() => cancelInvite(inviteId, user.id), `/grupos/${groupId}`);
}

export async function setRoleAction(groupId: string, targetId: string, role: "ADMIN" | "MEMBER") {
  const user = await requireReadyUser();
  return run(() => setRole(groupId, user.id, targetId, role), `/grupos/${groupId}`);
}

export async function removeMemberAction(groupId: string, targetId: string) {
  const user = await requireReadyUser();
  return run(() => removeMember(groupId, user.id, targetId), `/grupos/${groupId}`);
}

export async function transferAction(groupId: string, targetId: string) {
  const user = await requireReadyUser();
  return run(() => transferOwnership(groupId, user.id, targetId), `/grupos/${groupId}`);
}

export async function leaveGroupAction(groupId: string): Promise<Result> {
  const user = await requireReadyUser();
  const r = await run(() => leaveGroup(groupId, user.id));
  if (r.ok) redirect("/grupos");
  return r;
}

export async function deleteGroupAction(groupId: string): Promise<Result> {
  const user = await requireReadyUser();
  const r = await run(() => deleteGroup(groupId, user.id));
  if (r.ok) redirect("/grupos");
  return r;
}

export async function postMessageAction(groupId: string, content: string) {
  const user = await requireReadyUser();
  return run(() => postMessage(groupId, user.id, content));
}

export async function deleteMessageAction(messageId: string) {
  const user = await requireReadyUser();
  return run(() => deleteMessage(messageId, user.id));
}

export async function shareAction(groupId: string, type: ShareType, resourceId: string): Promise<Result> {
  const user = await requireReadyUser();
  const r = await run(() => shareResource(groupId, user.id, type, resourceId), `/grupos/${groupId}`);
  return r.ok ? { ok: true, message: "Compartilhado com o grupo!" } : r;
}

export async function unshareAction(shareId: string, groupId: string) {
  const user = await requireReadyUser();
  return run(() => unshare(shareId, user.id), `/grupos/${groupId}`);
}

/** Adiciona um material compartilhado à preparação do aluno (sem reprocessar o arquivo). */
export async function importMaterialAction(shareId: string, preparationId: string): Promise<Result> {
  const user = await requireReadyUser();
  const limit = await uploadLimitError(user);
  if (limit) return { error: limit };
  const share = await db.groupShare.findUnique({ where: { id: shareId } });
  if (!share || share.type !== "MATERIAL" || !(await getMembership(share.groupId, user.id))) return { error: "Material não encontrado." };
  const [source, prep] = await Promise.all([
    db.material.findUnique({ where: { id: share.resourceId } }),
    db.preparation.findFirst({ where: { id: preparationId, userId: user.id } }),
  ]);
  if (!source?.blobId || !prep) return { error: "Escolha uma das suas preparações." };
  const dup = await db.material.findFirst({ where: { preparationId: prep.id, blobId: source.blobId } });
  if (dup) return { error: "Esse material já está nessa preparação." };
  const m = await db.material.create({
    data: { preparationId: prep.id, uploaderId: user.id, blobId: source.blobId, title: source.title, kind: source.kind, role: "CONTENT", status: "QUEUED", progressStep: "Na fila" },
  });
  await enqueue("material.process", { materialId: m.id }, { singletonKey: m.id });
  return { ok: true, message: `Adicionado a "${prep.title}". Os assuntos aparecem em instantes.` };
}

export async function createTournamentAction(groupId: string, name: string, days: number): Promise<Result> {
  const user = await requireReadyUser();
  return run(() => createTournament(groupId, user.id, name, days), `/grupos/${groupId}`);
}

export async function endTournamentAction(tournamentId: string, groupId: string): Promise<Result> {
  const user = await requireReadyUser();
  return run(() => endTournament(tournamentId, user.id), `/grupos/${groupId}`);
}
