import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.user.id }, include: { provider: true } });
  if (!user || user.blockedAt) return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Tela inicial de cada conta. */
export const homeOf = (u: { role: string }) => (u.role === "ADMIN" ? "/admin" : "/inicio");

export async function requireUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/entrar?voltar=${encodeURIComponent(next)}` : "/entrar");
  return user;
}

/** Quem oferece serviço (tem perfil de prestador). Sem perfil, vai para "Seja prestador". */
export async function requireProvider() {
  const user = await requireUser("/painel");
  if (!user.provider) redirect("/seja-prestador");
  return user as typeof user & { provider: NonNullable<typeof user.provider> };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect(homeOf(user));
  return user;
}
