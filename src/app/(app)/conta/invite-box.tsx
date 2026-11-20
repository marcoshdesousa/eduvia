"use client";
import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InviteBox({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Seu link de convite" className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 text-xs" />
      <Button
        type="button"
        variant="secondary"
        onClick={async () => {
          const text = `Baixe o Diária Paga: contrate diaristas, pedreiros, eletricistas e muito mais perto de você. ${link}`;
          if (navigator.share) await navigator.share({ title: "Diária Paga", text, url: link }).catch(() => {});
          else {
            await navigator.clipboard.writeText(link).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        }}
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? "Copiado" : "Compartilhar"}
      </Button>
    </div>
  );
}
