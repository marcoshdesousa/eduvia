"use client";
import { useActionState, useMemo, useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Label, Textarea } from "@/components/ui/form";
import { CATEGORIES, MAX_QTY, UNIT_LABEL, category, formatBRL, qtyLabel } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { createQuickAction } from "../hire-actions";

export function QuickForm({ saved, ufs, initialCategory, prices }: { saved: SavedAddress[]; ufs: { uf: string; name: string }[]; initialCategory: string; prices: Record<string, number> }) {
  const [state, run] = useActionState(createQuickAction, null);
  const [cat, setCat] = useState(initialCategory);
  const [qty, setQty] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const c = category(cat);
  const unit = c?.unit ?? "DIARIA";
  const unitPrice = c ? prices[c.slug] : null;
  const list = useMemo(() => (showAll ? CATEGORIES : CATEGORIES.slice(0, 12)), [showAll]);

  return (
    <form action={run} className="space-y-4">
      <input type="hidden" name="category" value={cat} />
      <input type="hidden" name="quantity" value={qty} />

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
              }}
              className={cn("flex flex-col items-center gap-1 rounded-xl border p-2 text-center text-xs font-medium transition", cat === x.slug ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}
            >
              <span className="text-2xl">{x.emoji}</span>
              <span className="leading-tight">{x.label}</span>
              <span className="text-[10px] font-semibold text-muted">{formatBRL(prices[x.slug])}</span>
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
            <AddressFields saved={saved} ufs={ufs} needPoint autoLocate />
          </Card>

          <Card className="space-y-3">
            <CardTitle>4. O que precisa ser feito?</CardTitle>
            <div>
              <Label htmlFor="notes">Descrição do serviço (obrigatória)</Label>
              <Textarea id="notes" name="notes" required minLength={10} maxLength={1000} rows={4} placeholder={`Ex.: ${c.slug === "eletricista" ? "montar o painel de iluminação da sala e trocar 6 tomadas" : c.slug === "pedreiro" ? "levantar um muro de 6 metros no quintal, o material já está aqui" : "faxina completa em casa de 2 quartos, com geladeira e janelas"}.`} />
              <p className="mt-1 text-xs text-muted">O prestador lê isso antes de aceitar. Não coloque telefone.</p>
            </div>
          </Card>

          <Card className="space-y-3 border-primary/40">
            <CardTitle>5. Valor fixo</CardTitle>
            {unitPrice != null && (
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-xs text-muted">{formatBRL(unitPrice)} {UNIT_LABEL[unit].per} × {qtyLabel(unit, qty)}</p>
                <p className="text-3xl font-extrabold">{formatBRL(unitPrice * qty)}</p>
                <p className="text-xs text-muted">Preço fixo do Diária Paga para {c.label.toLowerCase()}, o mesmo para todos. Você paga direto ao prestador, e ele recebe tudo: a plataforma não cobra nada sobre o serviço.</p>
              </div>
            )}
            <fieldset className="flex flex-wrap items-center gap-4 text-sm">
              <legend className="mb-1 w-full text-sm font-medium">Como vai pagar ao prestador</legend>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="PIX" defaultChecked className="accent-[var(--primary)]" /> Pix</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="DINHEIRO" className="accent-[var(--primary)]" /> Dinheiro</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="CARTAO" className="accent-[var(--primary)]" /> Cartão (se tiver maquininha)</label>
            </fieldset>
          </Card>

          <Card className="space-y-1 bg-brand-ink text-white">
            <p className="flex items-center gap-2 font-semibold"><Zap size={18} className="text-amber-300" /> Como funciona</p>
            <ul className="list-inside list-disc text-sm text-white/85">
              <li>Tocamos no celular dos prestadores do plano Completo que estão disponíveis, perto e que mais aceitam chamados.</li>
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
