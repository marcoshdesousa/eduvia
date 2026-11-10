import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/** Usuário da requisição de API (ou a resposta de erro pronta). */
export async function apiUser() {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Entre na sua conta." }, { status: 401 }) } as const;
  return { user } as const;
}

export const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
