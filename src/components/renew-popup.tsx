"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, X } from "lucide-react";
import { PixCheckout } from "@/components/pix-checkout";
import { buttonClass } from "@/components/ui/button";

/**
 * Janela "seu plano vence": aparece toda vez que o aluno abre o Eduvia, nos 2 dias antes de vencer.
 * Dá para pagar o Pix ali mesmo. Fechou: não aparece de novo até a próxima vez que abrir o site.
 */
export function RenewPopup({ planSlug, planName, due, pix, stateKey }: { planSlug: string; planName: string; due: string; pix: boolean; stateKey: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const key = `eduvia-renovar:${stateKey}`;
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {}
    if (!seen && !path.startsWith("/assinatura")) setOpen(true);
  }, [key, path]);
  if (!open) return null;
  const close = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
    setOpen(false);
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Renovar plano" className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-5 text-center shadow-xl">
        <div className="flex justify-end">
          <button type="button" onClick={close} aria-label="Fechar" className="rounded-md p-1 text-muted hover:bg-surface-2"><X size={18} /></button>
        </div>
        <CalendarClock size={44} className="mx-auto text-warning" />
        <div className="space-y-1">
          <p className="text-lg font-semibold">Seu plano {planName} {due}</p>
          <p className="text-sm text-muted">Pague o próximo mês agora e continue estudando sem parar. Os 30 dias novos somam ao final do plano atual: você não perde nenhum dia.</p>
        </div>
        <div className="grid gap-2">
          {pix ? (
            <PixCheckout planSlug={planSlug} label={`Renovar ${planName} com Pix`} />
          ) : (
            <Link href="/assinatura" onClick={close} className={buttonClass("primary", "md", "w-full")}>Renovar agora</Link>
          )}
          <button type="button" onClick={close} className={buttonClass("ghost", "md", "w-full")}>Lembrar depois</button>
        </div>
      </div>
    </div>
  );
}
