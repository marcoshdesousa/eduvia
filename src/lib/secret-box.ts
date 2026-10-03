// Criptografia simétrica (AES-256-GCM) para guardar a chave de IA do aluno no banco.
// A chave de criptografia vem de AI_KEY_SECRET (ou BETTER_AUTH_SECRET). Trocar esse segredo
// invalida as chaves guardadas: os alunos precisarão conectar a IA de novo.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function masterKey() {
  const secret = process.env.AI_KEY_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Defina AI_KEY_SECRET ou BETTER_AUTH_SECRET para guardar as chaves de IA.");
  return createHash("sha256").update(`eduvia-ai-key:${secret}`).digest();
}

export function sealSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), data.toString("base64")].join(":");
}

/** Devolve null se o valor não puder ser aberto (segredo trocado ou dado corrompido). */
export function openSecret(sealed: string): string | null {
  const [v, iv, tag, data] = sealed.split(":");
  if (v !== "v1" || !iv || !tag || !data) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", masterKey(), Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
