"use server";
import { canUseAvatar, isAvatarId } from "@/lib/avatars";
import { getAccess } from "@/lib/billing";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { deleteUserData } from "@/lib/cleanup";
import { normalizePhone } from "@/lib/core/phone";
import type { FormState } from "./account";

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Informe seu nome." };
  const avatar = String(formData.get("avatar") ?? "");
  if (isAvatarId(avatar) && avatar !== user.avatar && !canUseAvatar(avatar, (await getAccess(user)).mode === "full")) {
    return { error: "Esse personagem é só para assinantes. Assine um plano para liberar todos." };
  }
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!phone) return { error: "Telefone inválido. Use DDD + número." };
  const visibility = formData.get("profileVisibility") === "PRIVATE" ? "PRIVATE" : "PUBLIC";
  const tz = String(formData.get("timezone") ?? user.timezone);
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: tz });
  } catch {
    return { error: "Fuso horário inválido." };
  }
  await db.user.update({ where: { id: user.id }, data: { name: name.slice(0, 80), phone, profileVisibility: visibility, timezone: tz, avatar: isAvatarId(avatar) ? avatar : null } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Dados salvos." };
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireReadyUser();
  const p = z
    .object({ currentPassword: z.string().min(1, "Informe a senha atual."), newPassword: z.string().min(8, "A nova senha precisa ter 8+ caracteres.") })
    .safeParse({ currentPassword: formData.get("currentPassword"), newPassword: formData.get("newPassword") });
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data.newPassword !== String(formData.get("newPasswordConfirm") ?? "")) return { error: "As senhas novas não são iguais." };
  try {
    await auth.api.changePassword({ body: { ...p.data, revokeOtherSessions: true }, headers: await headers() });
  } catch {
    return { error: "Senha atual incorreta." };
  }
  return { ok: true, message: "Senha alterada." };
}

export async function deleteAccountAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  if (String(formData.get("confirm") ?? "").trim() !== `@${user.handle}`) return { error: `Digite @${user.handle} para confirmar.` };
  await auth.api.signOut({ headers: await headers() }).catch(() => {});
  await deleteUserData(user.id);
  redirect("/");
}

export async function setRemindersAction(enabled: boolean) {
  const user = await requireReadyUser();
  await db.user.update({ where: { id: user.id }, data: { remindersEnabled: enabled } });
}
