import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { missingProviders } from "@/lib/ai/providers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return db.user.findUnique({ where: { id: session.user.id } });
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Usuário logado (qualquer estado). */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

/**
 * Usuário com cadastro completo (CPF, telefone, @, termos e chave do Gemini).
 * Sem assinatura, o app funciona no plano Grátis (limitado; ver lib/billing.ts).
 */
export async function requireReadyUser() {
  const user = await requireUser();
  if (!user.handle || !user.termsAcceptedAt || !user.cpf || !user.phone) redirect("/boas-vindas");
  // o Eduvia roda com as IAs do próprio aluno: sem todas conectadas, só dá para conectar
  if ((await missingProviders(user)).length) redirect("/conectar-ia");
  return user;
}

/** Área administrativa: só contas marcadas como admin (npm run admin -- @usuario). */
export async function requireAdmin() {
  const user = await requireReadyUser();
  if (!user.isAdmin) redirect("/inicio");
  return user;
}
