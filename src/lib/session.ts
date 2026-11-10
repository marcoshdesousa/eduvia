import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.user.id }, include: { pro: true } });
  if (!user || user.blockedAt) return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Página inicial de cada tipo de conta. */
export const homeOf = (u: { role: string }) => (u.role === "ADMIN" ? "/admin" : u.role === "PRO" ? "/painel" : "/buscar");

export async function requireUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/entrar?voltar=${encodeURIComponent(next)}` : "/entrar");
  return user;
}

export async function requireClient(next?: string) {
  const user = await requireUser(next);
  if (user.role !== "CLIENT") redirect(homeOf(user));
  return user;
}

export async function requirePro() {
  const user = await requireUser();
  if (user.role !== "PRO" || !user.pro) redirect(homeOf(user));
  return user as typeof user & { pro: NonNullable<typeof user.pro> };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect(homeOf(user));
  return user;
}
