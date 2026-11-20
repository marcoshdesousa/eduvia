import { createHash, randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";

const sha = (t: string) => createHash("sha256").update(t).digest("hex");
export const RESET_HOURS = 24;

/** Link de troca de senha (uso único, vale 24 h). Só o admin gera, depois de confirmar a identidade no suporte. */
export async function createResetLink(userId: string, adminId: string) {
  const token = randomBytes(24).toString("base64url");
  await db.passwordReset.create({ data: { userId, tokenHash: sha(token), expiresAt: new Date(Date.now() + RESET_HOURS * 3_600_000), createdBy: adminId } });
  return `${appUrl()}/trocar-senha/${token}`;
}

export async function findReset(token: string) {
  const r = await db.passwordReset.findUnique({ where: { tokenHash: sha(token) }, include: { user: { select: { name: true } } } });
  return r && !r.usedAt && r.expiresAt > new Date() ? r : null;
}

/** Troca a senha, invalida o link e desconecta os aparelhos. */
export async function consumeReset(token: string, password: string) {
  const r = await findReset(token);
  if (!r) return false;
  const hash = await hashPassword(password);
  await db.$transaction([
    db.passwordReset.update({ where: { id: r.id }, data: { usedAt: new Date() } }),
    db.account.updateMany({ where: { userId: r.userId, providerId: "credential" }, data: { password: hash } }),
    db.session.deleteMany({ where: { userId: r.userId } }),
  ]);
  return true;
}
