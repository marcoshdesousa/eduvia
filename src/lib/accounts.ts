// Criação de contas e login por CPF + senha.
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { hashPassword } from "better-auth/crypto";
import { Prisma } from "@/generated/prisma/client";
import type { Role } from "@/generated/prisma/enums";
import { auth, internalEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import { cpfHash, sealCpf } from "@/lib/cpf";
import { isValidCpf, onlyDigits } from "@/lib/core/cpf";
import { clearAttempts, recordFailure, tooManyFailures } from "@/lib/rate-limit";

export class AccountError extends Error {}

export function checkPassword(password: string, confirm: string) {
  if (password.length < 8) throw new AccountError("A senha precisa ter pelo menos 8 caracteres.");
  if (password.length > 128) throw new AccountError("Senha longa demais.");
  if (password !== confirm) throw new AccountError("As senhas não são iguais.");
}

export function checkName(name: string) {
  const n = name.replace(/\s+/g, " ").trim();
  if (n.length < 5 || !n.includes(" ")) throw new AccountError("Informe o nome completo (nome e sobrenome).");
  if (n.length > 120) throw new AccountError("Nome longo demais.");
  return n;
}

export function checkCpf(raw: string) {
  const cpf = onlyDigits(raw);
  if (!isValidCpf(cpf)) throw new AccountError("CPF inválido. Confira os números.");
  return cpf;
}

/** CPF do dono (variável ADMIN_CPF no Render): a conta de cliente com este CPF vira administradora. */
export const isAdminCpf = (cpf: string) => !!process.env.ADMIN_CPF && onlyDigits(process.env.ADMIN_CPF) === onlyDigits(cpf);

/** Cria a conta (usuário + senha) numa transação; `extra` cria o perfil do profissional junto. */
export async function createAccount(
  input: { name: string; cpf: string; password: string; role: Role },
  extra?: (tx: Prisma.TransactionClient, userId: string) => Promise<unknown>,
) {
  const hash = cpfHash(input.cpf);
  if (await db.user.findUnique({ where: { cpfHash: hash }, select: { id: true } })) throw new AccountError("Já existe uma conta com este CPF. Entre com a sua senha.");
  const id = randomUUID();
  const password = await hashPassword(input.password);
  try {
    await db.$transaction(async (tx) => {
      const role = input.role === "CLIENT" && isAdminCpf(input.cpf) ? "ADMIN" : input.role;
      await tx.user.create({ data: { id, name: input.name, email: internalEmail(), role, cpfHash: hash, cpfSealed: sealCpf(input.cpf) } });
      await tx.account.create({ data: { id: randomUUID(), userId: id, providerId: "credential", accountId: id, password } });
      if (extra) await extra(tx, id);
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new AccountError("Já existe uma conta com este CPF. Entre com a sua senha.");
    throw e;
  }
  return id;
}

/** Entra com CPF e senha (com limite de tentativas). Devolve o usuário ou lança AccountError. */
export async function signInWithCpf(rawCpf: string, password: string) {
  const cpf = onlyDigits(rawCpf);
  if (!isValidCpf(cpf)) throw new AccountError("CPF inválido. Confira os números.");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const hash = cpfHash(cpf);
  // só as tentativas erradas contam (8 por CPF e 30 por aparelho/rede a cada 15 minutos)
  if ((await tooManyFailures(`login:${hash}`, 8, 15)) || (await tooManyFailures(`login-ip:${ip}`, 30, 15))) {
    throw new AccountError("Muitas tentativas erradas. Espere 15 minutos e tente de novo.");
  }
  const fail = async () => {
    await recordFailure(`login:${hash}`, 15);
    await recordFailure(`login-ip:${ip}`, 15);
    return new AccountError("CPF ou senha incorretos.");
  };
  const user = await db.user.findUnique({ where: { cpfHash: hash } });
  if (!user) throw await fail();
  if (user.blockedAt) throw new AccountError("Esta conta está bloqueada. Fale com o suporte.");
  try {
    await auth.api.signInEmail({ body: { email: user.email, password }, headers: h });
  } catch {
    throw await fail();
  }
  await clearAttempts(`login:${hash}`);
  if (user.role === "CLIENT" && isAdminCpf(cpf)) return db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  return user;
}
