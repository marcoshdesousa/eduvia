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
