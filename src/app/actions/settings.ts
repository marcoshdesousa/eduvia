"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { checkHandleAvailable } from "@/lib/handles";
import { deleteUserData } from "@/lib/cleanup";
import type { FormState } from "./account";

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Informe seu nome." };
  const handle = await checkHandleAvailable(String(formData.get("handle") ?? ""), user.id);
  if (!handle.ok) return { error: handle.reason };
  const visibility = formData.get("profileVisibility") === "PRIVATE" ? "PRIVATE" : "PUBLIC";
  const tz = String(formData.get("timezone") ?? user.timezone);
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: tz });
  } catch {
    return { error: "Fuso horário inválido." };
  }
  await db.user.update({ where: { id: user.id }, data: { name, handle: handle.handle, profileVisibility: visibility, timezone: tz } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Dados salvos." };
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireReadyUser({ allowWithoutAccess: true });
  const p = z
    .object({ currentPassword: z.string().min(1, "Informe a senha atual."), newPassword: z.string().min(8, "A nova senha precisa ter 8+ caracteres.") })
    .safeParse({ currentPassword: formData.get("currentPassword"), newPassword: formData.get("newPassword") });
  if (!p.success) return { error: p.error.issues[0].message };
  try {
    await auth.api.changePassword({ body: { ...p.data, revokeOtherSessions: true }, headers: await headers() });
  } catch {
    return { error: "Senha atual incorreta (ou sua conta usa login com Google)." };
  }
  return { ok: true, message: "Senha alterada." };
}

export async function deleteAccountAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  if (String(formData.get("confirm") ?? "").trim() !== `@${user.handle}`) return { error: `Digite @${user.handle} para confirmar.` };
  await auth.api.signOut({ headers: await headers() }).catch(() => {});
  await deleteUserData(user.id);
  redirect("/");
}
