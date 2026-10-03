// Pipeline de processamento de material (roda no worker).
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { deleteObject, readObject } from "@/lib/storage";
import { embed, toPgVector } from "@/lib/ai/embeddings";
import { analyzeSyllabus, extractOutline } from "@/lib/ai/tasks";
import { PROFILES } from "@/lib/core/profiles";
import { estimateMinutes } from "@/lib/core/planner";
import { cosine, loadChunkEmbeddings } from "@/lib/rag";
import { chunkPages, countPages, extractPages } from "./extract";
import { pageQuotaError, scannedQuotaError } from "@/lib/billing";
import { AiQuotaError, AiUnavailableError, AiUserError } from "@/lib/ai/client";
import { enqueue } from "@/lib/queue";
import { generatePlan } from "@/lib/plan";
import { coverAllPages } from "@/lib/core/coverage";

export async function processMaterial(materialId: string) {
  const material = await db.material.findUnique({
    where: { id: materialId },
    include: { blob: true, preparation: true, subject: true },
  });
  if (!material?.blob) return;
  // etapa + porcentagem (a tela conta de 1 em 1 até ela); a leitura de páginas escaneadas vai de 8% a 35%
  const step = (progressStep: string, pct?: number) => {
    const ocr = progressStep.match(/\((\d+)\/(\d+)\)/);
    const progress = pct ?? (ocr ? Math.round(8 + (27 * Number(ocr[1])) / Math.max(1, Number(ocr[2]))) : undefined);
    return db.material
      .update({ where: { id: materialId }, data: { status: "PROCESSING", progressStep, ...(progress !== undefined ? { progress } : {}) } })
      .then(() => undefined);
  };

  try {
    let blob = material.blob;
    if (blob.processedAt && blob.pageCount) {
      const quota = await pageQuotaError(material.uploaderId, materialId, blob.pageCount);
      if (quota) throw new UserFacingError(quota);
    }
    if (!blob.processedAt) {
      await step("Lendo arquivo", 3);
      const data = await readObject(blob.storageKey);
      const sha256 = createHash("sha256").update(data).digest("hex");

      // Mesmo arquivo já processado antes (por qualquer usuário): reaproveita tudo, custo zero.
      const existing = await db.materialBlob.findUnique({ where: { sha256 } });
      // limite de páginas do mês: checado antes de gastar qualquer IA
      const pages = existing?.processedAt && existing.pageCount ? existing.pageCount : await countPages(material.kind, data);
      const quota = await pageQuotaError(material.uploaderId, materialId, pages);
      if (quota) throw new UserFacingError(quota);
      if (existing?.processedAt && existing.id !== blob.id) {
        await db.material.update({ where: { id: materialId }, data: { blobId: existing.id } });
        await db.materialBlob.delete({ where: { id: blob.id } }).catch(() => {});
        await deleteObject(blob.storageKey);
        blob = existing;
      } else {
        if (!existing) await db.materialBlob.update({ where: { id: blob.id }, data: { sha256 } });
        await step("Extraindo texto", 8);
        const blobId = blob.id;
        const pages = await extractPages(
          material.kind,
          data,
          blob.mimeType,
          material.uploaderId,
          step,
          async (scanned) => {
            const quota = await scannedQuotaError(material.uploaderId, materialId, scanned);
            if (quota) throw new UserFacingError(quota);
          },
          {
            load: async () => new Map((await db.materialPage.findMany({ where: { blobId, ocr: true } })).map((p) => [p.pageNumber, p.text])),
            save: async (done) => {
              for (const p of done) {
                await db.materialPage.upsert({
                  where: { blobId_pageNumber: { blobId, pageNumber: p.page } },
                  create: { blobId, pageNumber: p.page, text: p.text, ocr: true },
                  update: { text: p.text, ocr: true },
                });
              }
            },
          },
        );
        if (!pages.some((p) => p.text.trim().length > 30)) {
          // último caso: nem o texto do arquivo nem a leitura por IA acharam conteúdo
          throw new UserFacingError("Não lemos esse tipo de arquivo. Tente enviar em PDF com texto, DOCX ou uma foto mais nítida.");
        }
        await db.materialPage.deleteMany({ where: { blobId: blob.id } });
        await db.materialPage.createMany({
          data: pages.map((p) => ({ blobId: blob.id, pageNumber: p.page, text: p.text, ocr: p.ocr })),
        });

        await step("Dividindo em trechos", 36);
        const drafts = chunkPages(pages);
        await step(`Gerando índice de busca (${drafts.length} trechos)`, 40);
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

    // Pronto: o arquivo já foi lido. As aulas (assuntos + plano) são geradas pelo botão "Gerar aulas",
    // depois que todos os arquivos estiverem prontos (veja lessons.ts).
    await db.material.update({
      where: { id: materialId },
      data: { status: "READY", progress: 100, progressStep: null, errorMessage: null, autoRetries: 0, organizedAt: null },
    });
  } catch (err) {
    console.error(`[material ${materialId}]`, err);
    // Cota da chave acabou ou o Google oscilou: o arquivo volta para a fila sozinho, sem mostrar erro.
    const retry = retryPlan(err, material.autoRetries);
    if (retry) {
      await db.material.update({
        where: { id: materialId },
        data: { status: "QUEUED", errorMessage: null, progressStep: retry.message, progress: 0, autoRetries: { increment: 1 } },
      });
      await enqueue("material.process", { materialId }, { startAfter: retry.afterSeconds, singletonKey: `material:${materialId}:${material.autoRetries + 1}` });
      return;
    }
    const userFacing = err instanceof UserFacingError || err instanceof AiUserError;
    const message = userFacing ? err.message : "Não foi possível processar este arquivo. Toque em tentar de novo.";
    await db.material.update({ where: { id: materialId }, data: { status: "ERROR", errorMessage: message, progressStep: null, autoRetries: 0 } });
  }
}

/** Tentativas automáticas: cota (espera a cota voltar), Google fora do ar e falhas inesperadas (espera crescente). */
const MAX_QUOTA_RETRIES = 12;
const MAX_TRANSIENT_RETRIES = 8;

export function retryPlan(err: unknown, tries: number): { afterSeconds: number; message: string } | null {
  if (err instanceof AiQuotaError) {
    if (tries >= MAX_QUOTA_RETRIES) return null;
    const wait = Math.max(60, Math.ceil((err.retryAt.getTime() - Date.now()) / 1000) + 30);
    const at = new Date(Date.now() + wait * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    return { afterSeconds: wait, message: `Na fila: a IA do Google pediu uma pausa. Continuamos sozinhos por volta das ${at}; pode sair da tela.` };
  }
  const userFacing = (err instanceof UserFacingError || err instanceof AiUserError) && !(err instanceof AiUnavailableError);
  if (userFacing || tries >= MAX_TRANSIENT_RETRIES) return null;
  // espera curta (20 s, 40 s, 80 s... até 10 min): o Google costuma voltar logo
  return { afterSeconds: Math.min(600, 20 * 2 ** tries), message: "Na fila: o Google demorou a responder, tentamos de novo sozinhos em instantes. Pode sair da tela." };
}

export class UserFacingError extends Error {}

/** Material de conteúdo: liga ao programa (edital/ementa) se existir; senão, cria tópicos a partir do índice do próprio material. */
export async function organizeContent(materialId: string) {
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
  // as IAs do aluno montam o índice; se todas estiverem fora, divide pelo próprio texto (nunca trava)
  const outline = await extractOutline({
    userId: material.uploaderId,
    materialTitle: material.title,
    subjectHint: material.subject?.name ?? null,
    existingSubjects: prep.subjects.map((s) => s.name),
    pages: pages.map((p) => ({ page: p.pageNumber, text: p.text })),
  }).catch((e) => {
    if (e instanceof AiUserError && !(e instanceof AiQuotaError || e instanceof AiUnavailableError)) throw e;
    console.error(`[material ${materialId}] índice sem IA:`, (e as Error).message);
    return simpleOutline(material.title, material.subject?.name ?? null, pages);
  });

  const chunks = await db.chunk.findMany({ where: { blobId: material.blobId! }, select: { id: true, pageStart: true, pageEnd: true, tokenCount: true } });
  const pace = PROFILES[prep.studentType].paceFactor;
  const baseOrder = await db.topic.count({ where: { subject: { preparationId: prep.id } } });

  // nada do material fica de fora: os assuntos cobrem todas as páginas, sem buracos
  const lastPage = pages.length ? pages[pages.length - 1].pageNumber : 1;
  for (const [i, t] of coverAllPages(outline.topics, lastPage).entries()) {
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
  await saveBooks(prep.id, material.subject, outline.books);
}

export type Book = { title: string; author: string };

/** Guarda os livros recomendados por disciplina (vêm junto com o índice, sem chamada extra de IA). */
async function saveBooks(preparationId: string, fixed: { id: string } | null, books: { subject: string; title: string; author: string }[]) {
  const bySubject = new Map<string, Book[]>();
  for (const b of books) {
    if (!b.title?.trim()) continue;
    const key = fixed ? "" : b.subject || "Geral";
    bySubject.set(key, [...(bySubject.get(key) ?? []), { title: b.title.trim().slice(0, 160), author: (b.author ?? "").trim().slice(0, 120) }]);
  }
  for (const [name, list] of bySubject) {
    const subject = fixed ?? (await upsertSubject(preparationId, name));
    const current = await db.subject.findUnique({ where: { id: subject.id }, select: { books: true } });
    const merged = [...((current?.books as Book[] | null) ?? []), ...list];
    const unique = merged.filter((b, i) => merged.findIndex((x) => x.title.toLowerCase() === b.title.toLowerCase()) === i).slice(0, 4);
    await db.subject.update({ where: { id: subject.id }, data: { books: unique } });
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
  // livros recomendados das disciplinas de origem
  const seen = new Set<string>();
  const books = fromOne.flatMap((t) => {
    if (seen.has(t.subject.id)) return [];
    seen.add(t.subject.id);
    return ((t.subject.books as Book[] | null) ?? []).map((b) => ({ ...b, subject: t.subject.name }));
  });
  if (books.length) await saveBooks(material.preparationId, material.subject, books);
  return true;
}

/** Edital/ementa: cria disciplinas e assuntos com pesos e liga os materiais já enviados. */
export async function applySyllabus(materialId: string) {
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

/**
 * Índice sem IA (reserva): divide o material em partes de ~12 páginas, na ordem, cobrindo tudo.
 * O título de cada parte é o primeiro título que aparece nela (linha curta, em maiúsculas ou numerada).
 */
export function simpleOutline(title: string, subject: string | null, pages: { pageNumber: number; text: string }[]) {
  const SIZE = 12;
  const heading = (text: string) =>
    text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length >= 4 && l.length <= 90 && /[A-Za-zÀ-ú]/.test(l) && (/^(cap[íi]tulo|aula|unidade|m[óo]dulo|se[çc][ãa]o|parte)\b/i.test(l) || /^\d+(\.\d+)*[.)]?\s+\S/.test(l) || (l === l.toUpperCase() && /[A-ZÀ-Ú]{4}/.test(l))));
  const topics: { title: string; description: string; subject: string; pageStart: number; pageEnd: number; difficulty: number }[] = [];
  for (let i = 0; i < pages.length; i += SIZE) {
    const part = pages.slice(i, i + SIZE);
    const found = part.map((p) => heading(p.text)).find(Boolean);
    const n = topics.length + 1;
    topics.push({
      title: (found ?? `${title} — parte ${n}`).slice(0, 120),
      description: "",
      subject: subject ?? "Geral",
      pageStart: part[0].pageNumber,
      pageEnd: part[part.length - 1].pageNumber,
      difficulty: 3,
    });
  }
  return { topics, books: [] as { subject: string; title: string; author: string }[] };
}
