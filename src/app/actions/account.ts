"use server";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { checkHandleAvailable } from "@/lib/handles";
import { requireUser } from "@/lib/session";
import { ageOn, today } from "@/lib/core/dates";
import { trialEnd } from "@/lib/billing";
import { TERMS_VERSION } from "@/lib/terms";
import { Prisma } from "@/generated/prisma/client";

export type FormState = { error?: string; ok?: boolean; message?: string } | undefined;

const ProfileSchema = z.object({
  handle: z.string().min(1, "Escolha seu @."),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe sua data de nascimento."),
  terms: z.literal("on", { message: "É preciso aceitar os termos de uso e a política de privacidade." }),
  guardianName: z.string().optional(),
  guardianEmail: z.string().optional(),
});

async function applyProfile(userId: string, email: string, form: z.infer<typeof ProfileSchema>): Promise<string | null> {
  const handle = await checkHandleAvailable(form.handle, userId);
  if (!handle.ok) return handle.reason;
  const birth = new Date(`${form.birthDate}T00:00:00Z`);
  const age = ageOn(birth, today());
  if (age < 4 || age > 120) return "Confira a data de nascimento.";
  const minor = age < 18;

  let guardian: { name: string; email: string } | null = null;
  if (minor) {
    const g = z
      .object({ name: z.string().trim().min(3, "Informe o nome do responsável."), email: z.email("Informe o e-mail do responsável.") })
      .safeParse({ name: form.guardianName, email: form.guardianEmail?.trim().toLowerCase() });
    if (!g.success) return g.error.issues[0].message;
    if (g.data.email === email.toLowerCase()) return "O e-mail do responsável precisa ser diferente do seu.";
    guardian = g.data;
  }

  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        handle: handle.handle,
        birthDate: birth,
        termsAcceptedAt: new Date(),
        termsVersion: TERMS_VERSION,
        trialEndsAt: user.trialEndsAt ?? trialEnd(),
        guardianConsentStatus: minor ? (user.guardianConsentStatus === "GRANTED" ? "GRANTED" : "PENDING") : "NOT_REQUIRED",
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return "Esse @ acabou de ser escolhido por outra pessoa.";
    throw e;
  }
  if (guardian && user.guardianConsentStatus !== "GRANTED") await requestGuardianConsent(userId, user.name, guardian);
  return null;
}

async function requestGuardianConsent(userId: string, studentName: string, guardian: { name: string; email: string }) {
  const token = randomBytes(24).toString("base64url");
  await db.guardianConsent.create({ data: { userId, guardianName: guardian.name, guardianEmail: guardian.email, token } });
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/consentimento/${token}`;
  await sendMail({
    to: guardian.email,
    subject: `${studentName} quer usar o Eduvia — autorização do responsável`,
    text: `Olá, ${guardian.name}!\n\n${studentName} criou uma conta no Eduvia, uma plataforma de estudos com inteligência artificial.\nComo é menor de idade, a Lei Geral de Proteção de Dados (LGPD) exige a autorização de um dos pais ou responsável legal.\n\nPara ler como usamos os dados e autorizar, acesse:\n${url}\n\nSe você não reconhece este pedido, basta ignorar este e-mail.`,
  });
}

export async function signUpAction(_: FormState, formData: FormData): Promise<FormState> {
  const base = z
    .object({
      name: z.string().trim().min(2, "Informe seu nome."),
      email: z.email("E-mail inválido."),
      password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    })
    .safeParse({ name: formData.get("name"), email: String(formData.get("email") ?? "").trim().toLowerCase(), password: formData.get("password") });
  if (!base.success) return { error: base.error.issues[0].message };
  const profile = ProfileSchema.safeParse(Object.fromEntries(formData));
  if (!profile.success) return { error: profile.error.issues[0].message };

  const pre = await checkHandleAvailable(profile.data.handle);
  if (!pre.ok) return { error: pre.reason };

  let userId: string;
  try {
    const res = await auth.api.signUpEmail({ body: base.data, headers: await headers() });
    userId = res.user.id;
  } catch (e) {
    if (e instanceof APIError) {
      return { error: /exist/i.test(e.message) ? "Já existe uma conta com esse e-mail." : "Não foi possível criar a conta." };
    }
    throw e;
  }
  const err = await applyProfile(userId, base.data.email, profile.data);
  if (err) redirect("/boas-vindas?erro=" + encodeURIComponent(err));
  redirect("/inicio");
}

export async function completeOnboardingAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const profile = ProfileSchema.safeParse(Object.fromEntries(formData));
  if (!profile.success) return { error: profile.error.issues[0].message };
  const err = await applyProfile(user.id, user.email, profile.data);
  if (err) return { error: err };
  redirect("/inicio");
}

export async function resendGuardianAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  if (user.guardianConsentStatus !== "PENDING" && user.guardianConsentStatus !== "REVOKED") redirect("/inicio");
  const g = z
    .object({ name: z.string().trim().min(3, "Informe o nome do responsável."), email: z.email("E-mail do responsável inválido.") })
    .safeParse({ name: formData.get("guardianName"), email: String(formData.get("guardianEmail") ?? "").trim().toLowerCase() });
  if (!g.success) return { error: g.error.issues[0].message };
  if (g.data.email === user.email.toLowerCase()) return { error: "O e-mail do responsável precisa ser diferente do seu." };
  const recent = await db.guardianConsent.count({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } } });
  if (recent) return { error: "Aguarde um minuto para reenviar." };
  await db.user.update({ where: { id: user.id }, data: { guardianConsentStatus: "PENDING" } });
  await requestGuardianConsent(user.id, user.name, g.data);
  return { ok: true, message: `Enviamos o pedido para ${g.data.email}.` };
}

export async function grantConsentAction(token: string) {
  const consent = await db.guardianConsent.findUnique({ where: { token } });
  if (!consent || consent.revokedAt) return { error: "Link inválido ou expirado." };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  await db.$transaction([
    db.guardianConsent.update({ where: { id: consent.id }, data: { grantedAt: new Date(), grantedIp: ip } }),
    db.user.update({ where: { id: consent.userId }, data: { guardianConsentStatus: "GRANTED" } }),
  ]);
  return { ok: true };
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/entrar");
}
