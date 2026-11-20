"use client";
import { startTransition, useActionState, useMemo, useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { ShoppingPhone } from "@/components/shopping-fields";
import { PendingContext, SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Label, Textarea } from "@/components/ui/form";
import { CATEGORIES, DIARIA_HOURS, SHOPPING_SLUG, MAX_QTY, UNIT_LABEL, category, formatBRL, qtyLabel } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { createQuickAction } from "../hire-actions";

export function QuickForm({ saved, ufs, initialCategory, prices, hourPrices }: { saved: SavedAddress[]; ufs: { uf: string; name: string }[]; initialCategory: string; prices: Record<string, number>; hourPrices: Record<string, number> }) {
  const [state, run, pending] = useActionState(createQuickAction, null);
  const [cat, setCat] = useState(initialCategory);
  const [qty, setQty] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const c = category(cat);
  const shopping = cat === SHOPPING_SLUG;
  const [byHour, setByHour] = useState(false);
  const hourPrice = c ? hourPrices[c.slug] : undefined;
  const unit: keyof typeof UNIT_LABEL = byHour && hourPrice != null ? "HORA" : (c?.unit ?? "DIARIA");
  const unitPrice = c ? (unit === "HORA" && c.unit !== "HORA" ? hourPrice! : prices[c.slug]) : null;
  const quickCats = useMemo(() => CATEGORIES.filter((x) => x.slug in prices), [prices]);
  const list = useMemo(() => (showAll ? quickCats : quickCats.slice(0, 12)), [showAll, quickCats]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault(); // sem limpar o que foi digitado se der erro
        const data = new FormData(e.currentTarget);
        startTransition(() => run(data));
      }}
    >
      <PendingContext.Provider value={pending}>
      <input type="hidden" name="category" value={cat} />
      <input type="hidden" name="quantity" value={qty} />
      <input type="hidden" name="unit" value={unit} />

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
                setByHour(false);
              }}
              className={cn("flex flex-col items-center gap-1 rounded-xl border p-2 text-center text-xs font-medium transition", cat === x.slug ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}
            >
              <span className="text-2xl">{x.emoji}</span>
              <span className="leading-tight">{x.label}</span>
              <span className="text-[10px] font-semibold text-muted">{formatBRL(prices[x.slug])}</span>
            </button>
          ))}
        </div>
        {!showAll && quickCats.length > 12 && <button type="button" onClick={() => setShowAll(true)} className="w-full text-sm text-primary">Ver todos os serviços</button>}
        <p className="text-xs text-muted">Vidraceiro, serralheiro, frete, pintor e outros trabalhos que dependem de orçamento: escolha o prestador pela vitrine, no Início.</p>
      </Card>

      {c && (
        <>
          <Card className="space-y-3">
            <CardTitle>2. {hourPrice != null ? "Diária ou por hora?" : `Quantas ${UNIT_LABEL[unit].many}?`}</CardTitle>
            {hourPrice != null && (
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1 text-sm font-semibold" role="radiogroup" aria-label="Diária ou por hora">
                {[false, true].map((h) => (
                  <button key={String(h)} type="button" role="radio" aria-checked={byHour === h} onClick={() => { setByHour(h); setQty(1); }} className={cn("rounded-xl px-2 py-2.5", byHour === h ? "bg-surface text-primary shadow-sm" : "text-muted")}>
                    {h ? `Por hora · ${formatBRL(hourPrice)}` : `${UNIT_LABEL[c.unit].one[0].toUpperCase()}${UNIT_LABEL[c.unit].one.slice(1)} · ${formatBRL(prices[c.slug])}`}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Menos"><Minus size={18} /></button>
              <span className="min-w-28 text-center text-xl font-bold">{qtyLabel(unit, qty)}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY[unit], q + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Mais"><Plus size={18} /></button>
            </div>
            {unit === "DIARIA" && (
              <div className="flex flex-wrap justify-center gap-2">
                {[3, 5, 7, 15, 30].map((n) => (
                  <button key={n} type="button" onClick={() => setQty(n)} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", qty === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>
                    {n === 7 ? "1 semana" : n === 15 ? "15 dias" : n === 30 ? "30 dias" : `${n} dias`}
                  </button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-muted">
              {unit === "DIARIA" ? `Cada diária é de até ${DIARIA_HOURS} horas. Várias diárias saem pelo valor cheio de cada uma.` : unit === "HORA" ? `De 1 a ${DIARIA_HOURS} horas. Mais que isso, escolha diária.` : null}
            </p>
          </Card>

          <Card className="space-y-3">
            <CardTitle>3. Onde?</CardTitle>
            <AddressFields saved={saved} ufs={ufs} needPoint autoLocate />
          </Card>

          <Card className="space-y-3">
            <CardTitle>4. O que precisa ser feito?</CardTitle>
            <div>
              <Label htmlFor="notes">{shopping ? "Lista de compras completa (obrigatória)" : "Descrição do serviço (obrigatória)"}</Label>
              <Textarea id="notes" name="notes" required minLength={10} maxLength={1000} rows={4} placeholder={shopping ? "Ex.: 5 kg de arroz Tio João, 2 kg de feijão carioca, 1 dúzia de ovos, 2 L de leite integral, pão de forma, sabão em pó 1 kg…" : `Ex.: ${c.slug === "eletricista" ? "montar o painel de iluminação da sala e trocar 6 tomadas" : c.slug === "pedreiro" ? "levantar um muro de 6 metros no quintal, o material já está aqui" : "faxina completa em casa de 2 quartos, com geladeira e janelas"}.`} />
              <p className="mt-1 text-xs text-muted">O prestador lê isso antes de aceitar.{shopping ? " Coloque marca e quantidade de cada item." : ""}</p>
            </div>
            {shopping && <ShoppingPhone />}
          </Card>

          <Card className="space-y-3 border-primary/40">
            <CardTitle>5. Valor fixo</CardTitle>
            {unitPrice != null && (
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-xs text-muted">{formatBRL(unitPrice)} {UNIT_LABEL[unit].per} × {qtyLabel(unit, qty)}</p>
                <p className="text-3xl font-extrabold">{formatBRL(unitPrice * qty)}</p>
                <p className="text-xs text-muted">Preço fixo do Diária Paga para {c.label.toLowerCase()}{unit === "HORA" ? " por hora" : ""}, o mesmo para todos.{unit === "HORA" ? " Só tocamos para quem trabalha por hora." : ""} Você paga direto ao prestador, e ele recebe tudo: a plataforma não cobra nada sobre o serviço.</p>
              </div>
            )}
            <fieldset className="flex flex-wrap items-center gap-4 text-sm">
              <legend className="mb-1 w-full text-sm font-medium">Como vai pagar ao prestador</legend>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="PIX" defaultChecked className="accent-[var(--primary)]" /> Pix</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="DINHEIRO" className="accent-[var(--primary)]" /> Dinheiro</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="DEBITO" className="accent-[var(--primary)]" /> Débito</label>
              <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="CREDITO" className="accent-[var(--primary)]" /> Crédito</label>
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
      </PendingContext.Provider>
    </form>
  );
}
