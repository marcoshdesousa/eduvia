import { createHash } from "node:crypto";

export const EMBEDDING_DIM = 1024;
const VOYAGE_MODEL = process.env.VOYAGE_MODEL || "voyage-3.5";
const BATCH = 64;

export function usingLocalEmbeddings() {
  // chaves da Voyage começam com "pa-"; qualquer outro valor é tratado como ausente
  return !process.env.VOYAGE_API_KEY?.trim().startsWith("pa-");
}

/**
 * Embeddings dos trechos (documentos) ou da consulta.
 * Com VOYAGE_API_KEY usa a Voyage AI; sem ela, um vetor local por hashing de palavras
 * (serve para desenvolvimento: capta sobreposição de vocabulário, não significado).
 */
export async function embed(texts: string[], inputType: "document" | "query"): Promise<number[][]> {
  if (usingLocalEmbeddings()) return texts.map(localEmbedding);
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.VOYAGE_API_KEY}` },
      body: JSON.stringify({ input: batch, model: VOYAGE_MODEL, input_type: inputType, output_dimension: EMBEDDING_DIM }),
    });
    if (!res.ok) throw new Error(`Voyage AI ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
    json.data.sort((a, b) => a.index - b.index).forEach((d) => out.push(d.embedding));
  }
  return out;
}

const STOP = new Set("a o e é de da do das dos em no na nos nas um uma para por com que se ao aos as os ou como mais".split(" "));

export function localEmbedding(text: string): number[] {
  const v = new Array<number>(EMBEDDING_DIM).fill(0);
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  for (const w of words) {
    const h = createHash("md5").update(w).digest();
    const idx = h.readUInt16LE(0) % EMBEDDING_DIM;
    v[idx] += h[2] & 1 ? 1 : -1;
  }
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
}

export function toPgVector(v: number[]): string {
  return `[${v.map((x) => (Number.isFinite(x) ? x.toFixed(6) : "0")).join(",")}]`;
}
