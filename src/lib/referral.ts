// Plano por indicação: cada conta tem um código de 6 números. Quem cria a conta com o código conta como indicação.
// Primeira vez: com 3 indicações, a pessoa paga o plano (tudo liberado, igual ao Completo) por R$ 7,90.
// Depois de usar: precisa de 1 indicação nova (feita depois do último pagamento) e paga R$ 9,90. Não acumula.
// Cada CPF indicado conta uma vez só, para sempre (apagar a conta e criar de novo não conta de novo).
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { cpfKey } from "@/lib/cpf-key";
import { REFERRAL_FIRST_CENTS, REFERRALS_FIRST, REFERRALS_NEXT } from "@/lib/plans";
import { Prisma } from "@/generated/prisma/client";

export const REFERRAL_PLAN = "indicacao";
export const isReferralCode = (s: string) => /^\d{6}$/.test(s);

/** Código da pessoa (cria na primeira vez: 6 números que ninguém mais tem). */
export async function ensureReferralCode(userId: string): Promise<string> {
  const row = await db.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (row?.referralCode) return row.referralCode;
  for (let i = 0; i < 20; i++) {
    const code = String(randomInt(100000, 1000000));
    try {
      await db.user.updateMany({ where: { id: userId, referralCode: null }, data: { referralCode: code } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue; // código já existe: sorteia outro
      throw e;
    }
    const again = await db.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
    if (again?.referralCode) return again.referralCode;
  }
  throw new Error("Não foi possível criar o código de indicação.");
}

export const referralLink = (code: string) => `${appUrl()}/cadastro?cupom=${code}`;

/** Dono do código (para o cadastro). */
export async function findReferrer(code: string) {
  if (!isReferralCode(code)) return null;
  return db.user.findUnique({ where: { referralCode: code }, select: { id: true, name: true, cpf: true } });
}

/** Conta a indicação (se o CPF nunca foi indicado antes e não é da própria pessoa). */
export async function recordReferral(referrerId: string, referred: { id: string; cpf: string }) {
  const referrer = await db.user.findUnique({ where: { id: referrerId }, select: { cpf: true } });
  if (!referrer || referrer.cpf === referred.cpf) return false;
  await db.user.update({ where: { id: referred.id }, data: { referredById: referrerId } });
  try {
    await db.referralUse.create({ data: { cpfHash: cpfKey(referred.cpf), referrerId, referredUserId: referred.id } });
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return false; // esse CPF já foi indicado
    throw e;
  }
}

export type ReferralStatus = {
  code: string;
  link: string;
  /** ainda não usou o desconto de indicação (o primeiro precisa de 3 e custa R$ 7,90) */
  firstTime: boolean;
  needed: number;
  /** indicações que valem agora (desde o último pagamento por indicação) */
  count: number;
  unlocked: boolean;
  priceCents: number;
};

/** Situação da indicação da pessoa: quantas indicações valem agora, quantas faltam e o preço. */
export async function referralStatus(user: { id: string; cpf: string | null; createdAt?: Date }, nextPriceCents: number): Promise<ReferralStatus> {
  const code = await ensureReferralCode(user.id);
  const [lastPaid, used] = await Promise.all([
    db.payment.findFirst({ where: { referral: true, status: "PAID", subscription: { userId: user.id } }, orderBy: { paidAt: "desc" }, select: { paidAt: true } }),
    user.cpf ? db.promoUse.findUnique({ where: { cpfHash_planSlug: { cpfHash: cpfKey(user.cpf), planSlug: REFERRAL_PLAN } } }) : null,
  ]);
  const firstTime = !lastPaid && !(used && used.uses > 0);
  // depois de usar, só valem as indicações feitas depois do último pagamento (conta recriada: desde o cadastro)
  let since: Date | null = null;
  if (!firstTime) {
    since = lastPaid?.paidAt ?? user.createdAt ?? (await db.user.findUnique({ where: { id: user.id }, select: { createdAt: true } }))?.createdAt ?? new Date();
  }
  const count = await db.referralUse.count({ where: { referrerId: user.id, ...(since ? { createdAt: { gt: since } } : {}) } });
  const needed = firstTime ? REFERRALS_FIRST : REFERRALS_NEXT;
  return { code, link: referralLink(code), firstTime, needed, count: Math.min(count, needed), unlocked: count >= needed, priceCents: firstTime ? REFERRAL_FIRST_CENTS : nextPriceCents };
}
