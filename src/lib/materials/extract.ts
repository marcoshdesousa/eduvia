// Extração de texto por página: PDF (com OCR das páginas escaneadas), DOCX, imagem e texto.
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { ocrImage, ocrPdfPages } from "@/lib/ai/tasks";
import type { MaterialKind } from "@/generated/prisma/enums";

export type ExtractedPage = { page: number; text: string; ocr: boolean };

const OCR_MIN_CHARS = 40;
const OCR_BATCH = 10;

export async function extractPages(
  kind: MaterialKind,
  data: Buffer,
  mimeType: string,
  userId: string,
  onProgress: (msg: string) => Promise<void>,
  /** Chamado antes do OCR com o nº de páginas escaneadas (pode lançar erro de limite). */
  beforeOcr: (pages: number) => Promise<void> = async () => {},
): Promise<ExtractedPage[]> {
  switch (kind) {
    case "PDF":
      return extractPdf(data, userId, onProgress, beforeOcr);
    case "DOCX": {
      const { value } = await mammoth.extractRawText({ buffer: data });
      return pseudoPages(value);
    }
    case "IMAGE": {
      await beforeOcr(1);
      await onProgress("Lendo texto da imagem (OCR)");
      const mediaType = (["image/png", "image/jpeg", "image/webp"].includes(mimeType) ? mimeType : "image/jpeg") as
        | "image/png"
        | "image/jpeg"
        | "image/webp";
      const text = await ocrImage({ userId, base64: data.toString("base64"), mediaType });
      return [{ page: 1, text, ocr: true }];
    }
    case "TEXT":
      return pseudoPages(data.toString("utf8"));
  }
}

/** Conta páginas sem usar IA (para aplicar o limite mensal antes de processar). */
export async function countPages(kind: MaterialKind, data: Buffer): Promise<number> {
  switch (kind) {
    case "PDF":
      return (await PDFDocument.load(data, { ignoreEncryption: true, updateMetadata: false })).getPageCount();
    case "IMAGE":
      return 1;
    case "DOCX": {
      const { value } = await mammoth.extractRawText({ buffer: data });
      return Math.max(1, pseudoPages(value).length);
    }
    case "TEXT":
      return Math.max(1, pseudoPages(data.toString("utf8")).length);
  }
}

async function extractPdf(data: Buffer, userId: string, onProgress: (msg: string) => Promise<void>, beforeOcr: (pages: number) => Promise<void>) {
  const pdf = await getDocumentProxy(new Uint8Array(data));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages: ExtractedPage[] = text.map((t, i) => ({ page: i + 1, text: cleanText(t), ocr: false }));

  const scanned = pages.filter((p) => p.text.length < OCR_MIN_CHARS).map((p) => p.page);
  if (scanned.length) {
    await beforeOcr(scanned.length);
    const source = await PDFDocument.load(data, { ignoreEncryption: true });
    for (let i = 0; i < scanned.length; i += OCR_BATCH) {
      const batch = scanned.slice(i, i + OCR_BATCH);
      await onProgress(`OCR das páginas escaneadas (${Math.min(i + OCR_BATCH, scanned.length)}/${scanned.length})`);
      const doc = await PDFDocument.create();
      const copied = await doc.copyPages(source, batch.map((p) => p - 1));
      copied.forEach((p) => doc.addPage(p));
      const base64 = Buffer.from(await doc.save()).toString("base64");
      const result = await ocrPdfPages({ userId, pdfBase64: base64, pageNumbers: batch });
      for (const r of result) {
        const page = pages[r.page - 1];
        if (page && r.text.trim()) {
          page.text = cleanText(r.text);
          page.ocr = true;
        }
      }
    }
  }
  return pages;
}

/** Documentos sem páginas (DOCX, texto colado) viram "páginas" de ~3000 caracteres. */
export function pseudoPages(text: string, size = 3000): ExtractedPage[] {
  const paragraphs = cleanText(text).split(/\n{2,}/);
  const pages: ExtractedPage[] = [];
  let current = "";
  for (const p of paragraphs) {
    if (current.length + p.length > size && current) {
      pages.push({ page: pages.length + 1, text: current.trim(), ocr: false });
      current = "";
    }
    current += p + "\n\n";
  }
  if (current.trim()) pages.push({ page: pages.length + 1, text: current.trim(), ocr: false });
  return pages;
}

function cleanText(t: string) {
  return t.replace(/\u0000/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export type ChunkDraft = { index: number; content: string; pageStart: number; pageEnd: number; tokenCount: number };

/** Divide o texto em trechos de ~800 tokens com sobreposição, guardando as páginas de origem. */
export function chunkPages(pages: { page: number; text: string }[], target = 3200, overlap = 400): ChunkDraft[] {
  const chunks: ChunkDraft[] = [];
  let buf = "";
  let start = 0;
  let end = 0;
  const flush = () => {
    const content = buf.trim();
    if (content.length > 50) {
      chunks.push({ index: chunks.length, content, pageStart: start, pageEnd: end, tokenCount: Math.ceil(content.length / 4) });
    }
  };
  for (const p of pages) {
    if (!p.text) continue;
    const sentences = p.text.split(/(?<=[.!?:;])\s+|\n+/);
    for (const s of sentences) {
      if (!buf) start = p.page;
      buf += (buf ? " " : "") + s;
      end = p.page;
      if (buf.length >= target) {
        flush();
        const tail = buf.slice(-overlap);
        buf = tail.slice(tail.indexOf(" ") + 1);
        start = p.page;
      }
    }
  }
  if (buf.length > overlap || chunks.length === 0) flush();
  return chunks;
}
