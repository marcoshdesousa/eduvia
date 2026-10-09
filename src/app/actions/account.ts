"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth, internalEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkHandleAvailable } from "@/lib/handles";
import { requireUser } from "@/lib/session";
import { ensureReferralCode, findReferrer, recordReferral } from "@/lib/referral";
import { TERMS_VERSION } from "@/lib/terms";
import { isValidCpf, onlyDigits } from "@/lib/core/cpf";
import { normalizePhone } from "@/lib/core/phone";
import { allowAttempt, clearAttempts } from "@/lib/rate-limit";
import { Prisma } from "@/generated/prisma/client";

export type FormState = { error?: string; ok?: boolean; message?: string } | undefined;

const field = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function clientIp() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Valida CPF, telefone, @ e aceite dos termos (comum ao cadastro e ao completar cadastro). */
async function validateProfile(f: FormData, userId?: string) {
  const cpf = onlyDigits(field(f, "cpf"));
  if (!isValidCpf(cpf)) return { error: "CPF inválido." } as const;
  const taken = await db.user.findUnique({ where: { cpf }, select: { id: true } });
  if (taken && taken.id !== userId) return { error: "Já existe uma conta com esse CPF. Use \"Esqueci a senha\" para recuperar." } as const;
  const phone = normalizePhone(field(f, "phone"));
  if (!phone) return { error: "Telefone inválido. Use DDD + número, ex.: (11) 98765-4321." } as const;
  const handle = await checkHandleAvailable(field(f, "handle"), userId);
  if (!handle.ok) return { error: handle.reason } as const;
  if (f.get("terms") !== "on") return { error: "É preciso aceitar os termos de uso e a política de privacidade." } as const;
  return { cpf, phone, handle: handle.handle } as const;
}

export async function signUpAction(_: FormState, f: FormData): Promise<FormState> {
  const name = field(f, "name");
  if (name.length < 2) return { error: "Informe seu nome." };
  const password = String(f.get("password") ?? "");
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== String(f.get("passwordConfirm") ?? "")) return { error: "As senhas não são iguais. Digite a mesma senha nos dois campos." };
  if (!(await allowAttempt(`signup:${await clientIp()}`, 10, 60))) return { error: "Muitas tentativas. Tente de novo mais tarde." };
  const p = await validateProfile(f);
  if ("error" in p) return { error: p.error };
  // código de indicação (cupom) de quem convidou: opcional, mas se for digitado precisa existir
  const coupon = field(f, "coupon").replace(/\D/g, "");
  const referrer = coupon ? await findReferrer(coupon) : null;
  if (coupon && !referrer) return { error: "Código de indicação não encontrado. Confira os 6 números ou deixe em branco." };

  // a primeira conta de um banco vazio vira administradora (depois: npm run admin -- @usuario)
  const firstAccount = (await db.user.count({ where: { cpf: { not: null } } })) === 0;
  let userId: string;
  try {
    const res = await auth.api.signUpEmail({ body: { name, email: internalEmail(p.cpf), password }, headers: await headers() });
    userId = res.user.id;
  } catch (e) {
    if (e instanceof APIError) return { error: "Já existe uma conta com esse CPF." };
    throw e;
  }
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        cpf: p.cpf,
        phone: p.phone,
        handle: p.handle,
        termsAcceptedAt: new Date(),
        termsVersion: TERMS_VERSION,
        isAdmin: firstAccount,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      await db.user.delete({ where: { id: userId } });
      return { error: "Esse @ ou CPF acabou de ser usado por outra pessoa. Tente outro @." };
    }
    throw e;
  }
  await ensureReferralCode(userId).catch((e) => console.error("[indicação] código", e));
  if (referrer) await recordReferral(referrer.id, { id: userId, cpf: p.cpf }).catch((e) => console.error("[indicação] registrar", e));
  // passo 2: conectar a IA (a conta já está salva; se sair no meio, continua de onde parou)
  redirect("/conectar-ia");
}

/** Login com CPF ou @ + senha. */
export async function signInAction(_: FormState, f: FormData): Promise<FormState> {
  const identifier = field(f, "identifier");
  const password = String(f.get("password") ?? "");
  if (!identifier || !password) return { error: "Informe seu CPF (ou @) e a senha." };
  const digits = onlyDigits(identifier);
  const byCpf = digits.length === 11 && !identifier.includes("@") && /^[\d.\-\s]+$/.test(identifier);
  const key = byCpf ? digits : identifier.replace(/^@/, "").toLowerCase();
  if (!(await allowAttempt(`login:${key}`, 10, 15))) return { error: "Muitas tentativas. Aguarde 15 minutos ou redefina a senha." };

  const user = await db.user.findUnique({ where: byCpf ? { cpf: digits } : { handle: key }, select: { id: true, email: true } });
  const fail = { error: "CPF/@ ou senha incorretos." };
  if (!user) return fail;
  try {
    await auth.api.signInEmail({ body: { email: user.email, password }, headers: await headers() });
  } catch (e) {
    if (e instanceof APIError) return fail;
    throw e;
  }
  await clearAttempts(`login:${key}`);
  redirect("/inicio");
}

/**
 * Nova senha pelo CPF. Por segurança também pedimos o telefone cadastrado:
 * CPF sozinho é um dado fácil de achar e permitiria tomar a conta de outra pessoa.
 */
export async function resetPasswordAction(_: FormState, f: FormData): Promise<FormState> {
  const cpf = onlyDigits(field(f, "cpf"));
  const phone = normalizePhone(field(f, "phone"));
  const password = String(f.get("password") ?? "");
  if (!isValidCpf(cpf)) return { error: "CPF inválido." };
  if (password.length < 8) return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (password !== String(f.get("passwordConfirm") ?? "")) return { error: "As senhas não são iguais. Digite a mesma senha nos dois campos." };
  if (!(await allowAttempt(`reset:${cpf}`, 5, 30)) || !(await allowAttempt(`reset-ip:${await clientIp()}`, 20, 30))) {
    return { error: "Muitas tentativas. Aguarde 30 minutos." };
  }
  const user = await db.user.findUnique({ where: { cpf } });
  if (!user || !phone || user.phone !== phone) return { error: "CPF e telefone não conferem com nenhuma conta." };

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);
  const updated = await db.account.updateMany({ where: { userId: user.id, providerId: "credential" }, data: { password: hash } });
  if (!updated.count) return { error: "Não foi possível redefinir a senha desta conta." };
  await db.session.deleteMany({ where: { userId: user.id } });
  await clearAttempts(`reset:${cpf}`);
  await clearAttempts(`login:${cpf}`);
  return { ok: true, message: "Senha alterada! Entre com seu CPF e a nova senha." };
}

/** Contas antigas ou incompletas: pede CPF, telefone, @ e aceite dos termos. */
export async function completeProfileAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const p = await validateProfile(f, user.id);
  if ("error" in p) return { error: p.error };
  try {
    await db.user.update({
      where: { id: user.id },
      data: { cpf: p.cpf, phone: p.phone, handle: p.handle, termsAcceptedAt: new Date(), termsVersion: TERMS_VERSION },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "Esse @ ou CPF já está em uso." };
    throw e;
  }
  redirect("/inicio");
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/entrar");
}
