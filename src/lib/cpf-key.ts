import { createHash } from "node:crypto";

/** CPF guardado como código (promoção e indicação): não dá para voltar ao CPF, mas o mesmo CPF sempre dá o mesmo código. */
export function cpfKey(cpf: string) {
  return createHash("sha256").update(`eduvia-promo:${cpf.replace(/\D/g, "")}`).digest("hex");
}
