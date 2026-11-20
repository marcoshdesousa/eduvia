import { cache } from "react";
import { cookies, headers } from "next/headers";
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

/**
 * Área de trabalho. Sem conta de trabalhador → "Turbinar conta". Teste grátis ou plano vencido → tudo bloqueado,
 * só a tela do plano abre (`allowUnpaid`), até pagar.
 */
export async function requireProvider(opts: { allowUnpaid?: boolean } = {}) {
  const user = await requireUser("/painel");
  if (!user.provider) redirect("/seja-prestador");
  if (!opts.allowUnpaid && !(await workerPaid(user.provider.id))) redirect("/painel/plano?bloqueado=1");
  return user as typeof user & { provider: NonNullable<typeof user.provider> };
}

/** Plano (ou teste grátis) em dia? */
export async function workerPaid(proId: string) {
  const sub = await db.subscription.findUnique({ where: { proId }, select: { currentPeriodEnd: true } });
  return !!sub?.currentPeriodEnd && sub.currentPeriodEnd > new Date();
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect(homeOf(user));
  return user;
}

export type Mode = "cliente" | "trabalho";
export const MODE_COOKIE = "dp_modo";
/** Quem é prestador usa o app em dois modos: trabalho (padrão) ou cliente. Troca em Conta. */
export async function getMode(user: { provider?: unknown | null } | null): Promise<Mode> {
  if (!user?.provider) return "cliente";
  return (await cookies()).get(MODE_COOKIE)?.value === "cliente" ? "cliente" : "trabalho";
}
