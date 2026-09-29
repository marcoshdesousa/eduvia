import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasAccess } from "@/lib/billing";

/** Usuário da requisição de API (com cadastro completo). Responde 401/403 quando não pode usar. */
export async function apiUser(opts: { requireAccess?: boolean } = { requireAccess: true }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) } as const;
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.handle || user.guardianConsentStatus === "PENDING" || user.guardianConsentStatus === "REVOKED") {
    return { error: NextResponse.json({ error: "Cadastro incompleto" }, { status: 403 }) } as const;
  }
  if (opts.requireAccess !== false && !(await hasAccess(user))) {
    return { error: NextResponse.json({ error: "Seu teste grátis terminou. Assine para continuar." }, { status: 402 }) } as const;
  }
  return { user } as const;
}

export const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
