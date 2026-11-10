import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { appUrl, trustedOrigins } from "@/lib/app-url";

/**
 * As contas da HoraLimp não usam e-mail: o login é por CPF e senha.
 * O Better Auth exige um e-mail; usamos um endereço técnico aleatório (não revela o CPF), nunca exibido nem usado para envio.
 */
export const auth = betterAuth({
  appName: "HoraLimp",
  baseURL: appUrl(),
  trustedOrigins: trustedOrigins(),
  database: prismaAdapter(db, { provider: "postgresql" }),
  // contas são criadas só pelo servidor (cadastro de cliente/profissional), nunca direto pela API de login
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 8, maxPasswordLength: 128 },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  user: {
    additionalFields: {
      role: { type: "string", input: false, required: false },
      cpfHash: { type: "string", input: false, required: false },
      cpfSealed: { type: "string", input: false, required: false },
    },
  },
  plugins: [nextCookies()],
});

export const internalEmail = () => `${randomUUID()}@conta.horalimp.invalid`;
