"use client";
import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Código de indicação com os botões de compartilhar (WhatsApp, Instagram...) e copiar. */
export function ReferralShare({ code, link }: { code: string; link: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const text = `Estou estudando para o ENEM no Eduvia: aulas, questões reais e simulados. Crie sua conta grátis com o meu código ${code}: ${link}`;
  const copy = async (what: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(what === "code" ? code : link);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Eduvia", text, url: link });
        return;
      } catch {
        return; // a pessoa fechou o compartilhar
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-primary/60 bg-primary/5 px-3 py-2">
        <div>
          <p className="text-xs text-muted">Seu código</p>
          <p className="font-mono text-2xl font-bold tracking-[0.3em]" aria-label="Seu código de indicação">{code}</p>
        </div>
        <button type="button" onClick={() => copy("code")} className="text-muted hover:text-foreground" aria-label="Copiar código">
          {copied === "code" ? <Check size={18} className="text-success" /> : <Copy size={18} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" size="sm" onClick={share}><Share2 size={14} /> Compartilhar</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => copy("link")}>
          {copied === "link" ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar link</>}
        </Button>
      </div>
    </div>
  );
}

/** Tracinhos das indicações: cada pessoa que criou a conta com o código preenche um. */
export function ReferralBars({ count, needed }: { count: number; needed: number }) {
  return (
    <div className="space-y-1" aria-label={`${count} de ${needed} indicações`}>
      <div className="flex gap-1.5">
        {Array.from({ length: needed }, (_, i) => (
          <span key={i} className={cn("h-2 flex-1 rounded-full", i < count ? "bg-success" : "bg-surface-2")} />
        ))}
      </div>
      <p className="text-xs text-muted">{count} de {needed} {needed === 1 ? "indicação" : "indicações"}</p>
    </div>
  );
}
