import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, jsonError } from "@/lib/api";
import { uploadLimitError } from "@/lib/billing";
import { db } from "@/lib/db";
import { getOwnedPreparation } from "@/lib/authz";
import { MAX_UPLOAD_BYTES, uploadUrl } from "@/lib/storage";
import { kindFor, mimeFor } from "@/lib/materials/kinds";

const Body = z.object({
  preparationId: z.string(),
  filename: z.string().min(1).max(300),
  size: z.number().int().positive(),
  type: z.string().default(""),
  role: z.enum(["CONTENT", "EDITAL", "EMENTA"]).default("CONTENT"),
  subjectId: z.string().nullish(),
});

/** Inicia um envio: cria o material e devolve a URL para o navegador enviar o arquivo direto ao armazenamento. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const limit = await uploadLimitError(user);
  if (limit) return jsonError(limit, 402);
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return jsonError("Dados inválidos");
  const b = parsed.data;

  const prep = await getOwnedPreparation(b.preparationId, user.id);
  if (!prep) return jsonError("Preparação não encontrada", 404);
  if (b.size > MAX_UPLOAD_BYTES) return jsonError(`Arquivo maior que ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB. Divida o PDF em partes.`, 413);
  const kind = kindFor(b.filename, b.type);
  if (!kind) return jsonError("Formato não suportado. Envie PDF, DOCX, imagem ou texto.", 415);
  if (b.subjectId && !(await db.subject.findFirst({ where: { id: b.subjectId, preparationId: prep.id } }))) return jsonError("Disciplina inválida");

  const safeName = b.filename.replace(/[^\w.\-]+/g, "_").slice(-120);
  const storageKey = `materials/${user.id}/${randomUUID()}/${safeName}`;
  const mimeType = mimeFor(kind, b.type);
  const material = await db.material.create({
    data: {
      preparation: { connect: { id: prep.id } },
      subject: b.subjectId ? { connect: { id: b.subjectId } } : undefined,
      uploader: { connect: { id: user.id } },
      title: b.filename.replace(/\.[a-z0-9]+$/i, "").slice(0, 200),
      kind,
      role: b.role,
      status: "UPLOADING",
      blob: { create: { storageKey, mimeType, sizeBytes: b.size } },
    },
  });
  return NextResponse.json({ materialId: material.id, uploadUrl: await uploadUrl(storageKey, mimeType), contentType: mimeType });
}
