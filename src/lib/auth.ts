import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { appUrl, trustedOrigins } from "@/lib/app-url";

/**
 * Contas do Eduvia não usam e-mail: o login é por CPF (ou @) e senha.
 * O Better Auth exige um e-mail interno; usamos um endereço técnico derivado do CPF, nunca exibido nem usado para envio.
 */
export const auth = betterAuth({
  appName: "Eduvia",
  baseURL: appUrl(),
  trustedOrigins: trustedOrigins(),
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  plugins: [nextCookies()],
  // Login único: entrar em um aparelho desconecta os outros.
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          await db.session.deleteMany({ where: { userId: session.userId, id: { not: session.id } } });
        },
      },
    },
  },
});

export const internalEmail = (cpf: string) => `${cpf}@cpf.eduvia.invalid`;
