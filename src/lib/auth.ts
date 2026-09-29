import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : undefined;

export const googleEnabled = !!google;

export const auth = betterAuth({
  appName: "Eduvia",
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Redefinir sua senha do Eduvia",
        text: `Olá, ${user.name}!\n\nPara criar uma nova senha, acesse:\n${url}\n\nSe não foi você, ignore este e-mail.`,
      });
    },
  },
  socialProviders: google,
  account: { accountLinking: { enabled: true, trustedProviders: ["google"] } },
  plugins: [nextCookies()],
});
