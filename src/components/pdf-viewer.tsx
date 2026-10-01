"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PdfDoc = { numPages: number; getPage(n: number): Promise<PdfPage>; destroy(): Promise<void> };
type PdfPage = {
  getViewport(o: { scale: number }): { width: number; height: number; transform: number[] };
  render(o: { canvas: HTMLCanvasElement; canvasContext: CanvasRenderingContext2D; viewport: unknown; transform?: number[] }): { promise: Promise<void> };
  getTextContent(): Promise<{ items: { str?: string; transform?: number[]; width?: number; height?: number }[] }>;
};
type PdfJs = {
  getDocument(src: { url: string; withCredentials?: boolean }): { promise: Promise<PdfDoc> };
  GlobalWorkerOptions: { workerSrc: string };
  Util: { transform(a: number[], b: number[]): number[] };
};

let pdfjsPromise: Promise<PdfJs> | null = null;
function loadPdfJs() {
  pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((m) => {
    const lib = m as unknown as PdfJs;
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    return lib;
  });
  return pdfjsPromise;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Acha no texto da página os itens que formam o trecho citado (ignora acentos e pontuação).
 * Tenta o começo do trecho com 8, 6 e 4 palavras; grifa do ponto encontrado até o tamanho do trecho.
 */
export function findQuoteItems(items: string[], quote: string): number[] {
  const words = norm(quote).split(" ").filter(Boolean);
  if (!words.length) return [];
  let full = "";
  const owner: number[] = [];
  items.forEach((t, i) => {
    const n = norm(t);
    if (!n) return;
    if (full) {
      full += " ";
      owner.push(i);
    }
    for (let k = 0; k < n.length; k++) owner.push(i);
    full += n;
  });
  for (const size of [8, 6, 4]) {
    if (words.length < Math.min(size, 4)) continue;
    const probe = words.slice(0, Math.min(size, words.length)).join(" ");
    const at = full.indexOf(probe);
    if (at === -1) continue;
    const end = Math.min(full.length, at + Math.max(probe.length, words.join(" ").length));
    return [...new Set(owner.slice(at, end))];
  }
  return [];
}

/** Uma página do PDF desenhada no app, com o trecho grifado em amarelo. */
export function PdfPageViewer({ materialId, page: initialPage, quote }: { materialId: string; page: number; quote?: string | null }) {
  const [doc, setDoc] = useState<PdfDoc | null>(null);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);
  const [marks, setMarks] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const [textPage, setTextPage] = useState<{ text: string; total: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let loaded: PdfDoc | null = null;
    loadPdfJs()
      .then((lib) => lib.getDocument({ url: `/api/materials/${materialId}/pdf`, withCredentials: true }).promise)
      .then((d) => {
        loaded = d;
        if (alive) setDoc(d);
        else d.destroy();
      })
      // sem PDF (DOCX, texto) ou o aparelho não abriu: mostra o texto da página
      .catch(() => {
        if (alive) setError("texto");
      });
    return () => {
      alive = false;
      loaded?.destroy().catch(() => {});
    };
  }, [materialId]);

  const draw = useCallback(async () => {
    if (!doc || !canvasRef.current || !boxRef.current) return;
    setRendering(true);
    const lib = await loadPdfJs();
    const p = await doc.getPage(Math.min(Math.max(1, page), doc.numPages));
    const base = p.getViewport({ scale: 1 });
    const scale = Math.min(2.5, boxRef.current.clientWidth / base.width);
    const viewport = p.getViewport({ scale });
    const ratio = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    const ctx = canvas.getContext("2d")!;
    await p.render({ canvas, canvasContext: ctx, viewport, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined }).promise;
    // grifo: só na página citada
    if (quote && page === initialPage) {
      const { items } = await p.getTextContent();
      const hit = new Set(findQuoteItems(items.map((it) => it.str ?? ""), quote));
      setMarks(
        items.flatMap((it, i) => {
          if (!hit.has(i) || !it.transform) return [];
          const t = lib.Util.transform(viewport.transform, it.transform);
          const h = Math.hypot(t[2], t[3]);
          return [{ x: t[4], y: t[5] - h, w: (it.width ?? 0) * scale, h: h * 1.15 }];
        }),
      );
    } else setMarks([]);
    setRendering(false);
  }, [doc, page, quote, initialPage]);

  useEffect(() => {
    draw().catch((e) => {
      console.error("[pdf]", e);
      setError("Não foi possível mostrar esta página.");
    });
  }, [draw]);

  useEffect(() => {
    if (marks.length) markRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [marks]);

  useEffect(() => {
    if (error !== "texto") return;
    fetch(`/api/materials/${materialId}/page?p=${page}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { text: string; total: number }) => setTextPage(j))
      .catch(() => setError("Não foi possível abrir o material agora. Tente de novo em instantes."));
  }, [error, materialId, page]);

  if (error === "texto") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((n) => n - 1)} aria-label="Página anterior"><ChevronLeft size={16} /></Button>
          <span className="tabular-nums">Página {page}{textPage ? ` de ${textPage.total}` : ""}</span>
          <Button size="sm" variant="outline" disabled={!textPage || page >= textPage.total} onClick={() => setPage((n) => n + 1)} aria-label="Próxima página"><ChevronRight size={16} /></Button>
        </div>
        <div className="mx-auto max-w-3xl whitespace-pre-wrap rounded-lg bg-surface p-4 text-sm leading-relaxed">
          {!textPage ? <Loader2 className="mx-auto animate-spin text-primary" /> : <HighlightedText text={textPage.text} quote={page === initialPage ? quote : null} />}
        </div>
      </div>
    );
  }
  if (error) return <p className="p-6 text-center text-sm text-danger">{error}</p>;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-sm">
        <Button size="sm" variant="outline" disabled={!doc || page <= 1} onClick={() => setPage((n) => n - 1)} aria-label="Página anterior"><ChevronLeft size={16} /></Button>
        <span className="tabular-nums">Página {page}{doc ? ` de ${doc.numPages}` : ""}</span>
        <Button size="sm" variant="outline" disabled={!doc || page >= doc.numPages} onClick={() => setPage((n) => n + 1)} aria-label="Próxima página"><ChevronRight size={16} /></Button>
      </div>
      {quote && page === initialPage && !rendering && (
        <p className="text-center text-xs text-muted">{marks.length ? "O trecho usado na sua aula está grifado em amarelo." : "Esta é a página usada na sua aula."}</p>
      )}
      <div ref={boxRef} className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow">
        {(!doc || rendering) && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/70"><Loader2 className="animate-spin text-primary" /></div>
        )}
        <canvas ref={canvasRef} className="block" />
        {marks.map((m, i) => (
          <div
            key={i}
            ref={i === 0 ? markRef : undefined}
            className="pointer-events-none absolute rounded-sm bg-yellow-300/50 mix-blend-multiply"
            style={{ left: m.x, top: m.y, width: m.w, height: m.h }}
          />
        ))}
      </div>
    </div>
  );
}

type Open = { materialId: string; page: number; quote: string | null; title: string };

/**
 * Leitor de fontes: qualquer link /fonte/... no app abre o PDF numa janela por cima da aula,
 * sem sair da tela nem abrir outro site.
 */
export function PdfViewerHost() {
  const [open, setOpen] = useState<Open | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href?.startsWith("/fonte/")) return;
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      setOpen({
        materialId: url.pathname.split("/")[2],
        page: Number(url.searchParams.get("p")) || 1,
        quote: url.searchParams.get("q"),
        title: a.getAttribute("data-title") || "Fonte no seu material",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="truncate text-sm font-semibold">{open.title}</p>
        <Button size="sm" variant="ghost" onClick={() => setOpen(null)} aria-label="Fechar"><X size={18} /> Fechar</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <PdfPageViewer key={`${open.materialId}:${open.page}:${open.quote}`} materialId={open.materialId} page={open.page} quote={open.quote} />
      </div>
    </div>
  );
}

function HighlightedText({ text, quote }: { text: string; quote?: string | null }) {
  if (!quote) return <>{text}</>;
  const probe = quote.replace(/\s+/g, " ").trim().slice(0, 60);
  const flat = text.replace(/\s+/g, " ");
  const at = flat.toLowerCase().indexOf(probe.toLowerCase());
  if (at === -1) return <>{text}</>;
  const end = Math.min(flat.length, at + quote.length);
  return (
    <>
      {flat.slice(0, at)}
      <mark className="rounded bg-yellow-300/60 text-foreground">{flat.slice(at, end)}</mark>
      {flat.slice(end)}
    </>
  );
}
