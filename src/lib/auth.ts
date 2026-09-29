import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

/**
 * Contas do Eduvia não usam e-mail: o login é por CPF (ou @) e senha.
 * O Better Auth exige um e-mail interno; usamos um endereço técnico derivado do CPF, nunca exibido nem usado para envio.
 */
export const auth = betterAuth({
  appName: "Eduvia",
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  plugins: [nextCookies()],
});

export const internalEmail = (cpf: string) => `${cpf}@cpf.eduvia.invalid`;
