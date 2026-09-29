import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** Usuário da requisição de API com cadastro completo. */
export async function apiUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) } as const;
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.handle || !user.cpf) return { error: NextResponse.json({ error: "Cadastro incompleto" }, { status: 403 }) } as const;
  return { user } as const;
}

export const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
