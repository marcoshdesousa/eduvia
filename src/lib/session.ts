import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasAccess } from "@/lib/billing";

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

/** Usuário com cadastro completo, consentimento (se menor) e acesso (teste grátis ou assinatura). */
export async function requireReadyUser(opts: { allowWithoutAccess?: boolean } = {}) {
  const user = await requireUser();
  if (!user.handle || !user.termsAcceptedAt || !user.birthDate) redirect("/boas-vindas");
  if (user.guardianConsentStatus === "PENDING" || user.guardianConsentStatus === "REVOKED") redirect("/aguardando-responsavel");
  if (!opts.allowWithoutAccess && !(await hasAccess(user))) redirect("/assinatura");
  return user;
}
