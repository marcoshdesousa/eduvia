"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Manda o erro do leitor para o log do servidor (para descobrir o motivo em aparelhos específicos). */
function reportViewerError(e: unknown) {
  try {
    const body = JSON.stringify({ where: "pdf-viewer", message: String((e as Error)?.message ?? e).slice(0, 500), ua: navigator.userAgent.slice(0, 200) });
    navigator.sendBeacon?.("/api/client-error", body) || fetch("/api/client-error", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
}

/** Busca com novas tentativas (o servidor pode estar ocupado por alguns segundos). */
async function fetchRetry(url: string, retryOn: (status: number) => boolean, tries = 3): Promise<Response> {
  let last: Response | null = null;
  for (let i = 0; i < tries; i++) {
    try {
      last = await fetch(url);
      if (last.ok || !retryOn(last.status)) return last;
    } catch (e) {
      if (i === tries - 1) throw e;
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  return last!;
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

type PageItem = { s: string; x: number; y: number; w: number; h: number };
type PageInfo = { total: number; width: number; height: number; items: PageItem[] };

/** Linhas de pontinhos de sumário ("Capítulo ........ 12") viram reticências: não estouram a tela. */
const tidy = (t: string) => t.replace(/[.·…_]{4,}/g, " … ");

/**
 * Uma página do PDF no app, com o trecho grifado em amarelo. A página vem pronta do servidor como
 * imagem (abre em qualquer celular, inclusive iPhone); se não der, mostra o texto da página.
 */
export function PdfPageViewer({ materialId, page: initialPage, quote }: { materialId: string; page: number; quote?: string | null }) {
  const [page, setPage] = useState(initialPage);
  const [info, setInfo] = useState<PageInfo | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textPage, setTextPage] = useState<{ text: string; total: number } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setInfo(null);
    setLoaded(false);
    fetchRetry(`/api/materials/${materialId}/view?p=${page}`, (st) => st !== 404)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`view ${r.status}`))))
      .then((j: PageInfo) => alive && setInfo(j))
      .catch((e) => {
        if (!alive) return;
        if (!/view 404/.test(String(e))) reportViewerError(e); // 404 = não é PDF (DOCX, texto): mostra o texto
        setError("texto");
      });
    return () => {
      alive = false;
    };
  }, [materialId, page, attempt]);

  const marks = useMemo(() => {
    if (!info || !quote || page !== initialPage) return [];
    const hit = new Set(findQuoteItems(info.items.map((it) => it.s), quote));
    return info.items.filter((_, i) => hit.has(i));
  }, [info, quote, page, initialPage]);

  useEffect(() => {
    if (loaded && marks.length) markRef.current?.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  }, [loaded, marks]);

  useEffect(() => {
    if (error !== "texto") return;
    fetchRetry(`/api/materials/${materialId}/page?p=${page}`, () => true)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { text: string; total: number }) => setTextPage(j))
      .catch(() => setError("Não foi possível abrir o material agora."));
  }, [error, materialId, page, attempt]);

  const total = info?.total ?? textPage?.total;
  const nav = (
    <div className="flex items-center justify-center gap-2 text-sm">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((n) => n - 1)} aria-label="Página anterior"><ChevronLeft size={16} /></Button>
      <span className="tabular-nums">Página {page}{total ? ` de ${total}` : ""}</span>
      <Button size="sm" variant="outline" disabled={!total || page >= total} onClick={() => setPage((n) => n + 1)} aria-label="Próxima página"><ChevronRight size={16} /></Button>
    </div>
  );

  if (error === "texto") {
    return (
      <div className="min-w-0 space-y-3">
        {nav}
        <div className="mx-auto max-w-3xl whitespace-pre-wrap break-words rounded-lg bg-surface p-4 text-sm leading-relaxed [overflow-wrap:anywhere]">
          {!textPage ? <Loader2 className="mx-auto animate-spin text-primary" /> : <HighlightedText text={tidy(textPage.text)} quote={page === initialPage ? quote : null} />}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-3 p-6 text-center">
        <p className="text-sm text-danger">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null);
            setTextPage(null);
            setAttempt((n) => n + 1);
          }}
        >
          Tentar de novo
        </Button>
      </div>
    );
  }
  return (
    <div className="min-w-0 space-y-3">
      {nav}
      {quote && page === initialPage && loaded && (
        <p className="text-center text-xs text-muted">{marks.length ? "O trecho usado na sua aula está grifado em amarelo." : "Esta é a página usada na sua aula."}</p>
      )}
      <div
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow"
        style={{ aspectRatio: info ? `${info.width} / ${info.height}` : "3 / 4" }}
      >
        {(!info || !loaded) && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/70"><Loader2 className="animate-spin text-primary" /></div>
        )}
        {info && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/materials/${materialId}/view?p=${page}&img=1`}
            alt={`Página ${page} do material`}
            className="block h-auto w-full"
            onLoad={() => setLoaded(true)}
            onError={() => setError("texto")}
          />
        )}
        {loaded &&
          marks.map((m, i) => (
            <div
              key={i}
              ref={i === 0 ? markRef : undefined}
              className="pointer-events-none absolute rounded-sm bg-yellow-300/50 mix-blend-multiply"
              style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, width: `${m.w * 100}%`, height: `${m.h * 100}%` }}
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
      <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
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
