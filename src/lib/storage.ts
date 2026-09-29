// Armazenamento de arquivos: S3-compatível (S3, Cloudflare R2, MinIO) ou disco local (desenvolvimento).
import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const driver = () => (process.env.STORAGE_DRIVER === "s3" ? "s3" : "local");
const localDir = () => path.resolve(/*turbopackIgnore: true*/ process.env.STORAGE_LOCAL_DIR || ".data/uploads");
const secret = () => process.env.BETTER_AUTH_SECRET || "dev-secret";
const appUrl = () => process.env.APP_URL || "http://localhost:3000";

let s3: S3Client | null = null;
function s3Client() {
  s3 ??= new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.S3_FORCE_PATH_STYLE,
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
  });
  return s3;
}
const bucket = () => process.env.S3_BUCKET!;

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 100) * 1024 * 1024;

function sign(key: string, action: "put" | "get", expires: number) {
  return createHmac("sha256", secret()).update(`${action}:${key}:${expires}`).digest("hex");
}

export function verifyLocalSignature(key: string, action: "put" | "get", expires: number, sig: string) {
  if (Date.now() / 1000 > expires) return false;
  const expected = Buffer.from(sign(key, action, expires));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** URL para o navegador enviar o arquivo direto (sem passar pelo limite de corpo do servidor). */
export async function uploadUrl(key: string, contentType: string): Promise<string> {
  if (driver() === "s3") {
    return getSignedUrl(s3Client(), new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }), { expiresIn: 3600 });
  }
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${appUrl()}/api/storage/${encodeURIComponent(key)}?exp=${exp}&sig=${sign(key, "put", exp)}`;
}

/** URL temporária para abrir o arquivo (gerada só depois de checar permissão). */
export async function downloadUrl(key: string, filename: string, expiresIn = 600): Promise<string> {
  if (driver() === "s3") {
    return getSignedUrl(
      s3Client(),
      new GetObjectCommand({ Bucket: bucket(), Key: key, ResponseContentDisposition: `inline; filename="${encodeURIComponent(filename)}"` }),
      { expiresIn },
    );
  }
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  return `${appUrl()}/api/storage/${encodeURIComponent(key)}?exp=${exp}&sig=${sign(key, "get", exp)}`;
}

export async function readObject(key: string): Promise<Buffer> {
  if (driver() === "s3") {
    const res = await s3Client().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    return Buffer.from(await res.Body!.transformToByteArray());
  }
  return readFile(/*turbopackIgnore: true*/ localPath(key));
}

export async function writeObject(key: string, data: Buffer, contentType: string) {
  if (driver() === "s3") {
    await s3Client().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: data, ContentType: contentType }));
    return;
  }
  const file = localPath(key);
  await mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
  await writeFile(/*turbopackIgnore: true*/ file, data);
}

export async function deleteObject(key: string) {
  if (driver() === "s3") {
    await s3Client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    return;
  }
  await unlink(/*turbopackIgnore: true*/ localPath(key)).catch(() => {});
}

function localPath(key: string) {
  const file = path.resolve(localDir(), key);
  if (!file.startsWith(localDir() + path.sep)) throw new Error("Chave de arquivo inválida");
  return file;
}
