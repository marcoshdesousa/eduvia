import { createHmac } from "node:crypto";
import { onlyDigits } from "@/lib/core/cpf";
import { openSecret, sealSecret } from "@/lib/secret-box";

/**
 * CPF nunca fica em texto puro no banco: guardamos um código (HMAC) para achar a conta no login e impedir CPF
 * repetido, e o CPF criptografado (para o admin conferir a identidade). Trocar o segredo invalida os logins.
 */
function key() {
  const secret = process.env.CPF_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("Defina BETTER_AUTH_SECRET.");
  return secret || "dev-secret";
}

export function cpfHash(cpf: string) {
  return createHmac("sha256", key()).update(`horalimp-cpf:${onlyDigits(cpf)}`).digest("hex");
}

export const sealCpf = (cpf: string) => sealSecret(onlyDigits(cpf));
export const openCpf = (sealed: string) => openSecret(sealed);
