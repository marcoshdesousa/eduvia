// Página do PDF desenhada no servidor como imagem (PNG): abre em qualquer celular, inclusive iPhone,
// sem o navegador precisar baixar e desenhar o PDF inteiro. Fica guardada: abrir de novo é instantâneo.
import { getDocumentProxy, getResolvedPDFJS, renderPageAsImage } from "unpdf";
import { readObject, writeObject } from "@/lib/storage";

/** Largura da imagem da página (boa leitura no celular e no computador). */
const WIDTH = 1100;

/** Pedaço de texto da página com a posição em fração da página (0 a 1), para grifar o trecho citado. */
export type PageItem = { s: string; x: number; y: number; w: number; h: number };
export type PageInfo = { total: number; width: number; height: number; items: PageItem[] };

const keys = (materialId: string, page: number) => ({
  png: `pages/${materialId}/${page}-w${WIDTH}.png`,
  info: `pages/${materialId}/${page}-w${WIDTH}.json`,
});

const inflight = new Map<string, Promise<{ png: Buffer; info: PageInfo }>>();

/** Imagem e textos de uma página (gera e guarda na primeira vez). */
export function renderedPage(materialId: string, storageKey: string, page: number) {
  const k = keys(materialId, page);
  let job = inflight.get(k.png);
  if (!job) {
    job = load(k, storageKey, page).finally(() => inflight.delete(k.png));
    inflight.set(k.png, job);
  }
  return job;
}

async function load(k: { png: string; info: string }, storageKey: string, page: number) {
  try {
    const [png, info] = await Promise.all([readObject(k.png), readObject(k.info).then((b) => JSON.parse(b.toString()) as PageInfo)]);
    return { png, info };
  } catch {}
  const doc = await getDocumentProxy(new Uint8Array(await readObject(storageKey)));
  try {
    const n = Math.min(Math.max(1, page), doc.numPages);
    const p = await doc.getPage(n);
    const base = p.getViewport({ scale: 1 });
    const scale = WIDTH / base.width;
    const viewport = p.getViewport({ scale });
    const pdfjs = await getResolvedPDFJS();
    const { items } = await p.getTextContent();
    const out: PageItem[] = [];
    for (const it of items) {
      if (!("str" in it) || !it.str || !it.transform) continue;
      const t = pdfjs.Util.transform(viewport.transform, it.transform);
      const h = Math.hypot(t[2], t[3]);
      out.push({
        s: it.str,
        x: t[4] / viewport.width,
        y: (t[5] - h) / viewport.height,
        w: (it.width * scale) / viewport.width,
        h: (h * 1.15) / viewport.height,
      });
    }
    const png = Buffer.from(await renderPageAsImage(doc, n, { canvasImport: () => import("@napi-rs/canvas"), width: WIDTH }));
    const info: PageInfo = { total: doc.numPages, width: Math.round(viewport.width), height: Math.round(viewport.height), items: out };
    await writeObject(k.png, png, "image/png").catch(() => {});
    await writeObject(k.info, Buffer.from(JSON.stringify(info)), "application/json").catch(() => {});
    return { png, info };
  } finally {
    await doc.cleanup().catch(() => {});
    await (doc as unknown as { loadingTask?: { destroy(): Promise<void> } }).loadingTask?.destroy().catch(() => {});
  }
}
