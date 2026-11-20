"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function changePassword(_: ActionResult, d: FormData): Promise<ActionResult> {
  await requireUser();
  const current = String(d.get("current") ?? "");
  const next = String(d.get("password") ?? "");
  if (next.length < 8) return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (next !== String(d.get("passwordConfirm") ?? "")) return { error: "As senhas não são iguais." };
  try {
    await auth.api.changePassword({ body: { currentPassword: current, newPassword: next, revokeOtherSessions: true }, headers: await headers() });
  } catch {
    return { error: "Senha atual incorreta." };
  }
  return { ok: "Senha alterada. Os outros aparelhos foram desconectados." };
}

export async function deleteAddress(id: string) {
  const user = await requireUser();
  await db.address.deleteMany({ where: { id, clientId: user.id } });
  revalidatePath("/conta");
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}

/**
 * A pessoa apaga a própria conta. O CPF continua guardado (sem nome) na lista de CPFs para não ganhar
 * outro teste grátis e não escapar de penalidade criando a conta de novo.
 */
export async function deleteAccount(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (user.role === "ADMIN") return { error: "A conta de administração não pode ser apagada por aqui." };
  if (String(d.get("confirm") ?? "").trim().toUpperCase() !== "APAGAR") return { error: "Digite APAGAR para confirmar." };
  const { signInWithCpf } = await import("@/lib/accounts");
  const { openCpf } = await import("@/lib/cpf");
  const cpf = openCpf(user.cpfSealed);
  try {
    if (!cpf) throw new Error();
    await signInWithCpf(cpf, String(d.get("password") ?? ""));
  } catch {
    return { error: "Senha incorreta." };
  }
  const { ACTIVE_STATUSES } = await import("@/lib/domain");
  const busy = await db.booking.count({
    where: { status: { in: ["SEARCHING", "WAITING_PRO", ...ACTIVE_STATUSES, "IN_REVIEW"] }, OR: [{ clientId: user.id }, ...(user.provider ? [{ proId: user.provider.id }] : [])] },
  });
  if (busy) return { error: "Você tem pedidos em aberto ou em andamento. Conclua ou cancele antes de apagar a conta." };
  const { deleteObject } = await import("@/lib/storage");
  const files = user.provider ? [user.provider.photoKey, ...(await db.post.findMany({ where: { proId: user.provider.id }, select: { imageKey: true } })).map((p) => p.imageKey)] : [];
  // prestadores que esta pessoa avaliou: a nota deles é recalculada sem as avaliações dela
  const reviewed = await db.review.findMany({ where: { authorId: user.id, booking: { proId: { not: null } } }, select: { booking: { select: { proId: true } } } });
  await db.cpfLedger.upsert({ where: { cpfHash: user.cpfHash }, create: { cpfHash: user.cpfHash }, update: {} });
  await db.user.delete({ where: { id: user.id } });
  for (const proId of new Set(reviewed.map((r) => r.booking.proId!))) {
    const pro = await db.providerProfile.findUnique({ where: { id: proId }, select: { userId: true } });
    if (!pro) continue;
    const agg = await db.review.aggregate({ where: { targetId: pro.userId, booking: { proId } }, _sum: { stars: true }, _count: true });
    await db.providerProfile.update({ where: { id: proId }, data: { ratingSum: agg._sum.stars ?? 0, ratingCount: agg._count } });
  }
  for (const k of files) if (k) await deleteObject(k).catch(() => {});
  redirect("/?conta=apagada");
}

/** Troca entre o modo cliente (contratar) e o modo trabalho. */
export async function setModeAction(mode: "cliente" | "trabalho") {
  const user = await requireUser();
  const { MODE_COOKIE } = await import("@/lib/session");
  const { cookies } = await import("next/headers");
  if (mode === "trabalho" && !user.provider) redirect("/seja-prestador");
  (await cookies()).set(MODE_COOKIE, mode, { path: "/", maxAge: 365 * 86_400, sameSite: "lax" });
  redirect(mode === "trabalho" ? "/painel" : "/inicio");
}
