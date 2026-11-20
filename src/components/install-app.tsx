"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "dp:install-dismissed";

/** Registra o service worker (notificações e "baixar o app") uma vez por página. */
export function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
}

export const isStandalone = () =>
  typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true);

/** Faixa que convida a baixar o app (para receber as notificações e os chamados). Some quando o app já está instalado. */
export function InstallBanner({ provider }: { provider: boolean }) {
  useServiceWorker();
  const [show, setShow] = useState(false);
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    if (isStandalone()) return;
    try {
      const at = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - at < (provider ? 1 : 3) * 86_400_000) return;
    } catch {}
    setShow(true);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [provider]);
  if (!show) return null;
  return (
    <div className="border-b border-primary/20 bg-primary/10">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        <Download size={18} className="shrink-0 text-primary" />
        <p className="flex-1">{provider ? <><strong>Baixe o app</strong> para receber os chamados do Contrate rápido na hora, com vibração, mesmo com o celular bloqueado.</> : <><strong>Baixe o app</strong> para receber os avisos dos seus pedidos na hora.</>}</p>
        {evt ? (
          <Button size="sm" onClick={async () => { await evt.prompt(); await evt.userChoice; setShow(false); }}>Baixar</Button>
        ) : (
          <Link href="/baixar" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Como baixar</Link>
        )}
        <button type="button" aria-label="Fechar" className="rounded p-1 text-muted hover:text-foreground" onClick={() => { try { localStorage.setItem(KEY, String(Date.now())); } catch {} setShow(false); }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
