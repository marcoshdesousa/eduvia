"use client";
import { useState } from "react";
import { X } from "lucide-react";

type Item = { id: string; url: string; caption: string | null };

/** Portfólio: mostra 4 fotos e "Ver mais"; tocar abre a foto grande. */
export function Gallery({ items, preview = 4 }: { items: Item[]; preview?: number }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<Item | null>(null);
  const shown = all ? items : items.slice(0, preview);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {shown.map((p) => (
          <button key={p.id} type="button" onClick={() => setOpen(p)} className="overflow-hidden rounded-xl bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.caption ?? "Trabalho do prestador"} className="aspect-square w-full object-cover transition hover:scale-105" loading="lazy" />
          </button>
        ))}
      </div>
      {items.length > preview && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 w-full rounded-lg border border-border py-2 text-sm font-medium text-primary">
          {all ? "Ver menos" : `Ver mais (${items.length - preview})`}
        </button>
      )}
      {open && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          <button type="button" className="absolute right-4 top-4 text-white" aria-label="Fechar"><X size={28} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open.url} alt={open.caption ?? "Trabalho do prestador"} className="max-h-[80vh] max-w-full rounded-lg" />
          {open.caption && <p className="mt-3 text-center text-sm text-white">{open.caption}</p>}
        </div>
      )}
    </>
  );
}
