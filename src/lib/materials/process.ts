// Pipeline de processamento de material (roda no worker).
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { deleteObject, readObject } from "@/lib/storage";
import { embed, toPgVector } from "@/lib/ai/embeddings";
import { analyzeSyllabus, extractOutline } from "@/lib/ai/tasks";
import { PROFILES } from "@/lib/core/profiles";
import { estimateMinutes } from "@/lib/core/planner";
import { cosine, loadChunkEmbeddings } from "@/lib/rag";
import { chunkPages, extractPages } from "./extract";
import { generatePlan } from "@/lib/plan";

export async function processMaterial(materialId: string) {
  const material = await db.material.findUnique({
    where: { id: materialId },
    include: { blob: true, preparation: true, subject: true },
  });
  if (!material?.blob) return;
  const step = (progressStep: string) =>
    db.material.update({ where: { id: materialId }, data: { status: "PROCESSING", progressStep } }).then(() => undefined);

  try {
    let blob = material.blob;
    if (!blob.processedAt) {
      await step("Lendo arquivo");
      const data = await readObject(blob.storageKey);
      const sha256 = createHash("sha256").update(data).digest("hex");

      // Mesmo arquivo já processado antes (por qualquer usuário): reaproveita tudo, custo zero.
      const existing = await db.materialBlob.findUnique({ where: { sha256 } });
      if (existing?.processedAt && existing.id !== blob.id) {
        await db.material.update({ where: { id: materialId }, data: { blobId: existing.id } });
        await db.materialBlob.delete({ where: { id: blob.id } }).catch(() => {});
        await deleteObject(blob.storageKey);
        blob = existing;
      } else {
        if (!existing) await db.materialBlob.update({ where: { id: blob.id }, data: { sha256 } });
        await step("Extraindo texto");
        const pages = await extractPages(material.kind, data, blob.mimeType, material.uploaderId, step);
        if (!pages.some((p) => p.text.trim().length > 30)) {
          throw new UserFacingError(
            "Não encontramos texto neste arquivo. Se for escaneado, confira se a IA está configurada (OCR) ou envie uma versão com melhor qualidade.",
          );
        }
        await db.materialPage.deleteMany({ where: { blobId: blob.id } });
        await db.materialPage.createMany({
          data: pages.map((p) => ({ blobId: blob.id, pageNumber: p.page, text: p.text, ocr: p.ocr })),
        });

        await step("Dividindo em trechos");
        const drafts = chunkPages(pages);
        await step(`Gerando índice de busca (${drafts.length} trechos)`);
        const vectors = await embed(drafts.map((c) => c.content), "document");
        await db.chunk.deleteMany({ where: { blobId: blob.id } });
        for (let i = 0; i < drafts.length; i++) {
          const c = drafts[i];
          await db.$executeRaw`INSERT INTO "Chunk" (id, "blobId", index, content, "pageStart", "pageEnd", "tokenCount", embedding)
            VALUES (${`${blob.id}_${c.index}`}, ${blob.id}, ${c.index}, ${c.content}, ${c.pageStart}, ${c.pageEnd}, ${c.tokenCount}, ${toPgVector(vectors[i])}::vector)`;
        }
        blob = await db.materialBlob.update({ where: { id: blob.id }, data: { pageCount: pages.length, processedAt: new Date() } });
      }
    }

    await step("Organizando assuntos");
    if (material.role === "CONTENT") await organizeContent(materialId);
    else await applySyllabus(materialId);

    // O plano é refeito antes de o material aparecer como pronto (o aluno já encontra as sessões novas).
    await step("Montando o plano");
    await generatePlan(material.preparationId);
    await db.material.update({ where: { id: materialId }, data: { status: "READY", progressStep: null, errorMessage: null } });
  } catch (err) {
    console.error(`[material ${materialId}]`, err);
    const message = err instanceof UserFacingError ? err.message : "Não foi possível processar este arquivo. Tente novamente.";
    await db.material.update({ where: { id: materialId }, data: { status: "ERROR", errorMessage: message, progressStep: null } });
    if (!(err instanceof UserFacingError)) throw err; // deixa a fila tentar de novo
  }
}

export class UserFacingError extends Error {}

/** Material de conteúdo: liga ao programa (edital/ementa) se existir; senão, cria tópicos a partir do índice do próprio material. */
async function organizeContent(materialId: string) {
  const material = await db.material.findUniqueOrThrow({
    where: { id: materialId },
    include: { preparation: { include: { subjects: true } }, subject: true },
  });
  const prep = material.preparation;
  const hasSyllabus = await db.topic.count({ where: { subject: { preparationId: prep.id }, source: "EDITAL" } });

  // remove tópicos que vieram deste material (reprocessamento)
  await db.topic.deleteMany({ where: { materialId, source: "MATERIAL" } });

  if (hasSyllabus) {
    await linkChunksToSyllabus(prep.id, [material.blobId!]);
    return;
  }

  if (await copyTopicsFromTwin(material)) return;

  const pages = await db.materialPage.findMany({ where: { blobId: material.blobId! }, orderBy: { pageNumber: "asc" } });
  const outline = await extractOutline({
    userId: material.uploaderId,
    materialTitle: material.title,
    subjectHint: material.subject?.name ?? null,
    existingSubjects: prep.subjects.map((s) => s.name),
    pages: pages.map((p) => ({ page: p.pageNumber, text: p.text })),
  });

  const chunks = await db.chunk.findMany({ where: { blobId: material.blobId! }, select: { id: true, pageStart: true, pageEnd: true, tokenCount: true } });
  const pace = PROFILES[prep.studentType].paceFactor;
  const baseOrder = await db.topic.count({ where: { subject: { preparationId: prep.id } } });

  for (const [i, t] of outline.topics.entries()) {
    const subject = material.subject ?? (await upsertSubject(prep.id, t.subject || "Geral"));
    const linked = chunks.filter((c) => c.pageStart <= t.pageEnd && c.pageEnd >= t.pageStart);
    const tokens = linked.reduce((s, c) => s + c.tokenCount, 0);
    await db.topic.create({
      data: {
        subjectId: subject.id,
        title: t.title.slice(0, 200),
        description: t.description,
        order: baseOrder + i,
        difficulty: clampInt(t.difficulty, 1, 5),
        estimatedMinutes: estimateMinutes(tokens, pace),
        source: "MATERIAL",
        materialId,
        pageStart: t.pageStart,
        pageEnd: t.pageEnd,
        chunks: { create: linked.map((c) => ({ chunkId: c.id })) },
      },
    });
  }
}

/**
 * O mesmo arquivo já foi organizado em outra preparação (ex.: material compartilhado num grupo):
 * copia os assuntos em vez de chamar a IA de novo.
 */
async function copyTopicsFromTwin(material: { id: string; blobId: string | null; preparationId: string; subject: { id: string; name: string } | null; preparation: { studentType: import("@/generated/prisma/enums").StudentType } }) {
  const twins = await db.material.findMany({ where: { blobId: material.blobId, id: { not: material.id } }, select: { id: true } });
  if (!twins.length) return false;
  const source = await db.topic.findMany({
    where: { materialId: { in: twins.map((t) => t.id) }, source: "MATERIAL" },
    include: { subject: true },
    orderBy: { order: "asc" },
  });
  const fromOne = source.filter((t) => t.materialId === source[0]?.materialId);
  if (!fromOne.length) return false;
  const chunks = await db.chunk.findMany({ where: { blobId: material.blobId! }, select: { id: true, pageStart: true, pageEnd: true, tokenCount: true } });
  const pace = PROFILES[material.preparation.studentType].paceFactor;
  const baseOrder = await db.topic.count({ where: { subject: { preparationId: material.preparationId } } });
  for (const [i, t] of fromOne.entries()) {
    const subject = material.subject ?? (await upsertSubject(material.preparationId, t.subject.name));
    const linked = chunks.filter((c) => t.pageStart != null && t.pageEnd != null && c.pageStart <= t.pageEnd && c.pageEnd >= t.pageStart);
    const tokens = linked.reduce((sum, c) => sum + c.tokenCount, 0);
    await db.topic.create({
      data: {
        subjectId: subject.id,
        title: t.title,
        description: t.description,
        order: baseOrder + i,
        difficulty: t.difficulty,
        estimatedMinutes: tokens ? estimateMinutes(tokens, pace) : t.estimatedMinutes,
        source: "MATERIAL",
        materialId: material.id,
        pageStart: t.pageStart,
        pageEnd: t.pageEnd,
        chunks: { create: linked.map((c) => ({ chunkId: c.id })) },
      },
    });
  }
  return true;
}

/** Edital/ementa: cria disciplinas e assuntos com pesos e liga os materiais já enviados. */
async function applySyllabus(materialId: string) {
  const material = await db.material.findUniqueOrThrow({ where: { id: materialId }, include: { preparation: true } });
  const prep = material.preparation;
  const pages = await db.materialPage.findMany({ where: { blobId: material.blobId! }, orderBy: { pageNumber: "asc" } });
  const syllabus = await analyzeSyllabus({
    userId: material.uploaderId,
    role: material.role === "EDITAL" ? "EDITAL" : "EMENTA",
    studentTypeLabel: PROFILES[prep.studentType].label,
    text: pages.map((p) => p.text).join("\n\n"),
  });

  await db.editalAnalysis.upsert({
    where: { preparationId: prep.id },
    create: { preparationId: prep.id, banca: syllabus.banca, cargo: syllabus.cargo, questionStyle: syllabus.questionStyle, raw: syllabus },
    update: { banca: syllabus.banca, cargo: syllabus.cargo, questionStyle: syllabus.questionStyle, raw: syllabus },
  });
  if (!prep.examDate && syllabus.examDate && /^\d{4}-\d{2}-\d{2}$/.test(syllabus.examDate)) {
    await db.preparation.update({ where: { id: prep.id }, data: { examDate: new Date(`${syllabus.examDate}T00:00:00Z`) } });
  }

  // O programa passa a ser a espinha do plano: substitui tópicos do edital anterior e os criados a partir de materiais.
  await db.topic.deleteMany({ where: { subject: { preparationId: prep.id }, source: { in: ["EDITAL", "MATERIAL"] } } });
  const maxWeight = Math.max(1, ...syllabus.subjects.map((s) => s.weight));
  let order = 0;
  for (const [i, s] of syllabus.subjects.entries()) {
    const subject = await upsertSubject(prep.id, s.name, (s.weight / maxWeight) * 3, i);
    for (const t of s.topics) {
      await db.topic.create({
        data: { subjectId: subject.id, title: t.title.slice(0, 200), order: order++, difficulty: clampInt(t.difficulty, 1, 5), weight: 1, source: "EDITAL" },
      });
    }
  }
  const contentBlobs = await db.material.findMany({
    where: { preparationId: prep.id, role: "CONTENT", status: "READY", blobId: { not: null } },
    select: { blobId: true },
  });
  await linkChunksToSyllabus(prep.id, contentBlobs.map((m) => m.blobId!));
}

/** Liga cada trecho ao assunto do programa mais parecido (similaridade de embeddings, sem IA generativa). */
async function linkChunksToSyllabus(preparationId: string, blobIds: string[]) {
  const topics = await db.topic.findMany({
    where: { subject: { preparationId }, source: "EDITAL" },
    include: { subject: true },
  });
  if (!topics.length) return;
  const prep = await db.preparation.findUniqueOrThrow({ where: { id: preparationId } });
  const topicVecs = await embed(topics.map((t) => `${t.subject.name}: ${t.title}`), "query");
  const chunks = await loadChunkEmbeddings(blobIds);
  const links: { topicId: string; chunkId: string; score: number }[] = [];
  for (const c of chunks) {
    let best = -1;
    let bestScore = -Infinity;
    topicVecs.forEach((v, i) => {
      const s = cosine(v, c.embedding);
      if (s > bestScore) {
        bestScore = s;
        best = i;
      }
    });
    if (best >= 0 && bestScore > 0.05) links.push({ topicId: topics[best].id, chunkId: c.id, score: bestScore });
  }
  if (links.length) await db.topicChunk.createMany({ data: links, skipDuplicates: true });

  // tempo estimado de cada assunto conforme o volume de material ligado a ele
  const pace = PROFILES[prep.studentType].paceFactor;
  const tokens = await db.$queryRaw<{ topicId: string; tokens: bigint }[]>`
    SELECT tc."topicId", SUM(c."tokenCount")::bigint AS tokens
      FROM "TopicChunk" tc JOIN "Chunk" c ON c.id = tc."chunkId"
      JOIN "Topic" t ON t.id = tc."topicId" JOIN "Subject" s ON s.id = t."subjectId"
     WHERE s."preparationId" = ${preparationId}
     GROUP BY tc."topicId"`;
  const byTopic = new Map(tokens.map((r) => [r.topicId, Number(r.tokens)]));
  for (const t of topics) {
    const tk = byTopic.get(t.id);
    await db.topic.update({ where: { id: t.id }, data: { estimatedMinutes: tk ? estimateMinutes(tk, pace) : 20 } });
  }
}

async function upsertSubject(preparationId: string, name: string, weight?: number, order?: number) {
  const clean = name.trim().slice(0, 120) || "Geral";
  return db.subject.upsert({
    where: { preparationId_name: { preparationId, name: clean } },
    create: { preparationId, name: clean, weight: weight ?? 1, order: order ?? 0 },
    update: weight !== undefined ? { weight, order } : {},
  });
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n || 3)));
}
