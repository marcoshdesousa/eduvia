import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, jsonError } from "@/lib/api";
import { uploadLimitError } from "@/lib/billing";
import { db } from "@/lib/db";
import { getOwnedPreparation } from "@/lib/authz";
import { writeObject } from "@/lib/storage";
import { enqueue } from "@/lib/queue";

const Body = z.object({
  preparationId: z.string(),
  title: z.string().trim().min(1).max(200),
  text: z.string().trim().min(50, "Cole pelo menos um parágrafo.").max(2_000_000),
  role: z.enum(["CONTENT", "EDITAL", "EMENTA"]).default("CONTENT"),
  subjectId: z.string().nullish(),
});

/** Texto colado pelo aluno vira um material como outro qualquer. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const limit = await uploadLimitError(user);
  if (limit) return jsonError(limit, 402);
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);
  const b = parsed.data;
  const prep = await getOwnedPreparation(b.preparationId, user.id);
  if (!prep) return jsonError("Preparação não encontrada", 404);

  const data = Buffer.from(b.text, "utf8");
  const storageKey = `materials/${user.id}/${randomUUID()}/texto.txt`;
  await writeObject(storageKey, data, "text/plain; charset=utf-8");
  const material = await db.material.create({
    data: {
      preparation: { connect: { id: prep.id } },
      subject: b.subjectId ? { connect: { id: b.subjectId } } : undefined,
      uploader: { connect: { id: user.id } },
      title: b.title,
      kind: "TEXT",
      role: b.role,
      status: "QUEUED",
      progressStep: "Na fila",
      blob: { create: { storageKey, mimeType: "text/plain", sizeBytes: data.length } },
    },
  });
  await enqueue("material.process", { materialId: material.id }, { singletonKey: material.id });
  return NextResponse.json({ materialId: material.id });
}
