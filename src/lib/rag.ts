import { db } from "@/lib/db";
import { embed, toPgVector } from "@/lib/ai/embeddings";

export type ChunkHit = {
  id: string;
  content: string;
  pageStart: number;
  pageEnd: number;
  materialId: string;
  materialTitle: string;
  distance: number;
};

/** Busca semântica nos materiais de conteúdo prontos de uma preparação. */
export async function searchChunks(preparationId: string, query: string, k = 8): Promise<ChunkHit[]> {
  const [vec] = await embed([query], "query");
  return db.$queryRawUnsafe<ChunkHit[]>(
    `SELECT c.id, c.content, c."pageStart", c."pageEnd", m.id AS "materialId", m.title AS "materialTitle",
            (c.embedding <=> $2::vector) AS distance
       FROM "Chunk" c
       JOIN "Material" m ON m."blobId" = c."blobId"
      WHERE m."preparationId" = $1 AND m.status = 'READY' AND m.role = 'CONTENT' AND c.embedding IS NOT NULL
      ORDER BY c.embedding <=> $2::vector
      LIMIT $3`,
    preparationId,
    toPgVector(vec),
    k,
  );
}

/** Lê embeddings guardados (para ligar trechos a tópicos sem nova chamada de IA). */
export async function loadChunkEmbeddings(blobIds: string[]): Promise<{ id: string; embedding: number[]; tokenCount: number }[]> {
  if (!blobIds.length) return [];
  const rows = await db.$queryRawUnsafe<{ id: string; embedding: string; tokenCount: number }[]>(
    `SELECT id, embedding::text AS embedding, "tokenCount" FROM "Chunk" WHERE "blobId" = ANY($1::text[]) AND embedding IS NOT NULL`,
    blobIds,
  );
  return rows.map((r) => ({ id: r.id, tokenCount: r.tokenCount, embedding: JSON.parse(r.embedding) as number[] }));
}

export function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
