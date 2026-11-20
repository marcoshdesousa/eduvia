"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Input, Label, Textarea } from "@/components/ui/form";
import { CATEGORIES, MAX_QTY, UNIT_LABEL, category, formatBRL, parseBRL, qtyLabel } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { createQuickAction } from "../hire-actions";

export function QuickForm({ saved, ufs, initialCategory }: { saved: SavedAddress[]; ufs: { uf: string; name: string }[]; initialCategory: string }) {
  const [state, run] = useActionState(createQuickAction, null);
  const [cat, setCat] = useState(initialCategory);
  const [qty, setQty] = useState(1);
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [low, setLow] = useState<{ unitCents: number | null; nearby: boolean } | null>(null);
  const [max, setMax] = useState("");
  const [touched, setTouched] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const c = category(cat);
  const unit = c?.unit ?? "DIARIA";
  const minCents = low?.unitCents != null ? low.unitCents * qty : null;

  useEffect(() => {
    if (!cat) return;
    let live = true;
    const q = new URLSearchParams({ servico: cat, ...(point ? { lat: String(point.lat), lng: String(point.lng) } : {}) });
    void fetch(`/api/rapido/minimo?${q}`).then((r) => r.json()).then((r) => live && setLow(r)).catch(() => {});
    return () => {
      live = false;
    };
  }, [cat, point?.lat, point?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // o máximo começa um pouco acima do mínimo (o cliente pode subir para alcançar mais gente)
  useEffect(() => {
    if (minCents != null && !touched) setMax((Math.ceil((minCents * 1.2) / 100)).toFixed(2).replace(".", ","));
  }, [minCents, touched]);

  const maxCents = parseBRL(max);
  const list = useMemo(() => (showAll ? CATEGORIES : CATEGORIES.slice(0, 12)), [showAll]);

  return (
    <form action={run} className="space-y-4">
      <input type="hidden" name="category" value={cat} />
      <input type="hidden" name="quantity" value={qty} />
      <input type="hidden" name="minCents" value={minCents ?? ""} />

      <Card className="space-y-3">
        <CardTitle>1. Do que você precisa agora?</CardTitle>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {list.map((x) => (
            <button
              key={x.slug}
              type="button"
              onClick={() => {
                setCat(x.slug);
                setQty(1);
                setTouched(false);
              }}
              className={cn("flex flex-col items-center gap-1 rounded-xl border p-2 text-center text-xs font-medium transition", cat === x.slug ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}
            >
              <span className="text-2xl">{x.emoji}</span>
              <span className="leading-tight">{x.label}</span>
            </button>
          ))}
        </div>
        {!showAll && <button type="button" onClick={() => setShowAll(true)} className="w-full text-sm text-primary">Ver todos os serviços</button>}
      </Card>

      {c && (
        <>
          <Card className="space-y-3">
            <CardTitle>2. Quantas {UNIT_LABEL[unit].many}?</CardTitle>
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Menos"><Minus size={18} /></button>
              <span className="min-w-28 text-center text-xl font-bold">{qtyLabel(unit, qty)}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY[unit], q + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Mais"><Plus size={18} /></button>
            </div>
          </Card>

          <Card className="space-y-3">
            <CardTitle>3. Onde?</CardTitle>
            <AddressFields saved={saved} ufs={ufs} needPoint autoLocate onPoint={setPoint} />
          </Card>

          <Card className="space-y-3 border-primary/40">
            <CardTitle>4. Quanto você paga?</CardTitle>
            {minCents != null ? (
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-xs text-muted">Valor mínimo {low?.nearby ? "perto de você" : "na plataforma"} ({qtyLabel(unit, qty)})</p>
                <p className="text-2xl font-extrabold">{formatBRL(minCents)}</p>
                <p className="text-xs text-muted">É o menor preço cobrado hoje por este serviço. Não dá para pedir menos.</p>
              </div>
            ) : (
              <p className="rounded-xl bg-warning/10 p-3 text-sm">Ainda não há prestadores deste serviço na plataforma. Você pode tentar mesmo assim, ou escolher outro serviço.</p>
            )}
            <div>
              <Label htmlFor="max">Pago no máximo (R$)</Label>
              <Input id="max" name="max" inputMode="decimal" required value={max} onChange={(e) => { setMax(e.target.value); setTouched(true); }} />
              <p className="mt-1 text-xs text-muted">Quanto maior o máximo, mais prestadores (inclusive mais longe) podem receber o chamado. Você paga o preço do prestador que aceitar, nunca mais que isso.</p>
              {minCents != null && maxCents != null && maxCents < minCents && <p className="mt-1 text-xs text-danger">O máximo precisa ser pelo menos {formatBRL(minCents)}.</p>}
            </div>
            <fieldset className="flex flex-wrap items-center gap-4 text-sm">
              <legend className="mb-1 w-full text-sm font-medium">Como vai pagar ao prestador</legend>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="PIX" defaultChecked className="accent-[var(--primary)]" /> Pix</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="DINHEIRO" className="accent-[var(--primary)]" /> Dinheiro</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="CARTAO" className="accent-[var(--primary)]" /> Cartão (se tiver maquininha)</label>
            </fieldset>
            <Textarea name="notes" maxLength={1000} placeholder="Detalhes para o prestador (opcional). Ex.: apartamento de 2 quartos; preciso de alguém até as 14h." aria-label="Observações" />
          </Card>

          <Card className="space-y-1 bg-brand-ink text-white">
            <p className="flex items-center gap-2 font-semibold"><Zap size={18} className="text-amber-300" /> Como funciona</p>
            <ul className="list-inside list-disc text-sm text-white/85">
              <li>Tocamos no celular dos prestadores mais perto e disponíveis.</li>
              <li>O primeiro que aceitar leva e tem até 2 horas para chegar.</li>
              <li>Ele só vê seu endereço depois de aceitar. Vocês conversam pelo chat.</li>
              <li>Se você não estiver no local, fica 30 dias sem contratar (ou paga R$ 2,85 para liberar).</li>
            </ul>
          </Card>

          <FormError message={state?.error} />
          <SubmitButton size="lg" className="dp-ring w-full" pendingText="Chamando…">
            <Zap size={18} /> Chamar agora
          </SubmitButton>
        </>
      )}
    </form>
  );
}
