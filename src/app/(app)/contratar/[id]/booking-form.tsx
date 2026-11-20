"use client";
import { startTransition, useActionState, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { ShoppingPhone } from "@/components/shopping-fields";
import { PendingContext, SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Input, Label, Textarea } from "@/components/ui/form";
import { DIARIA_HOURS, SHOPPING_SLUG, MAX_QTY, PAY_METHODS, UNIT_LABEL, formatBRL, isPayMethod, qtyLabel } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { createBookingAction } from "../../hire-actions";

type Service = { category: string; label: string; emoji: string; priceCents: number; unit: keyof typeof UNIT_LABEL; hourCents: number | null; description: string | null };

export function BookingForm({ proId, services, initial, agenda, saved, ufs, payMethods }: { proId: string; services: Service[]; initial: string; agenda: string[]; saved: SavedAddress[]; ufs: { uf: string; name: string }[]; payMethods: string[] }) {
  const [state, run, pending] = useActionState(createBookingAction, null);
  const [cat, setCat] = useState(services.find((s) => s.category === initial)?.category ?? services[0]?.category);
  const [qty, setQty] = useState(1);
  const [byHour, setByHour] = useState(false);
  const s = services.find((x) => x.category === cat)!;
  const hourly = byHour && !!s.hourCents && s.unit !== "HORA";
  const unit = hourly ? "HORA" : s.unit;
  const price = hourly ? s.hourCents! : s.priceCents;
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
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
      <input type="hidden" name="proId" value={proId} />
      <input type="hidden" name="category" value={cat} />
      <input type="hidden" name="quantity" value={qty} />
      <input type="hidden" name="unit" value={unit} />
      <Card className="space-y-3">
        <CardTitle>1. Serviço</CardTitle>
        <div className="space-y-2">
          {services.map((x) => (
            <button key={x.category} type="button" onClick={() => { setCat(x.category); setQty(1); setByHour(false); }} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left", cat === x.category ? "border-primary bg-primary/5" : "border-border")}>
              <span className="text-2xl">{x.emoji}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{x.label}</span>
                {x.description && <span className="block text-xs text-muted">{x.description}</span>}
              </span>
              <span className="text-right text-sm font-bold">
                {formatBRL(x.priceCents)}<span className="block text-[10px] font-normal text-muted">{UNIT_LABEL[x.unit].per}</span>
                {x.hourCents && x.unit !== "HORA" ? <span className="block text-[11px] font-semibold text-muted">{formatBRL(x.hourCents)} / hora</span> : null}
              </span>
            </button>
          ))}
        </div>
        {s.hourCents && s.unit !== "HORA" ? (
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1 text-sm font-semibold" role="radiogroup" aria-label="Diária ou por hora">
            {[false, true].map((h) => (
              <button key={String(h)} type="button" role="radio" aria-checked={byHour === h} onClick={() => { setByHour(h); setQty(1); }} className={cn("rounded-xl px-2 py-2.5", byHour === h ? "bg-surface text-primary shadow-sm" : "text-muted")}>
                {h ? "Por hora" : `Por ${UNIT_LABEL[s.unit].one}`}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Menos"><Minus size={16} /></button>
          <span className="min-w-28 text-center text-lg font-bold">{qtyLabel(unit, qty)}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY[unit], q + 1))} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Mais"><Plus size={16} /></button>
        </div>
        {unit === "DIARIA" && (
          <div className="flex flex-wrap justify-center gap-2">
            {[3, 5, 7, 15, 30].map((n) => (
              <button key={n} type="button" onClick={() => setQty(n)} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", qty === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>
                {n === 7 ? "1 semana" : `${n} dias`}
              </button>
            ))}
          </div>
        )}
        {unit !== "SERVICO" && <p className="text-center text-xs text-muted">{unit === "DIARIA" ? `Cada diária é de até ${DIARIA_HOURS} horas, pelo valor cheio.` : `De 1 a ${DIARIA_HOURS} horas.`}</p>}
      </Card>
      <Card className="space-y-3">
        <CardTitle>2. Quando começa</CardTitle>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" type="date" min={minDate} required />
          </div>
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input id="time" name="time" type="time" step={1800} required defaultValue="08:00" />
          </div>
        </div>
        {agenda.length > 0 && <p className="text-xs text-muted">Atende: {agenda.join(" · ")}</p>}
      </Card>
      <Card className="space-y-3">
        <CardTitle>3. Endereço</CardTitle>
        <AddressFields saved={saved} ufs={ufs} />
      </Card>
      <Card className="space-y-3">
        <CardTitle>4. Detalhes</CardTitle>
        {s.category === SHOPPING_SLUG ? (
          <>
            <Textarea name="notes" required minLength={15} maxLength={1000} rows={5} placeholder="Lista de compras completa: marca e quantidade de cada item." aria-label="Lista de compras completa" />
            <ShoppingPhone />
          </>
        ) : (
          <Textarea name="notes" maxLength={1000} placeholder="Conte o que precisa ser feito (opcional)." aria-label="Observações" />
        )}
        <fieldset className="flex flex-wrap items-center gap-4 text-sm">
          <legend className="mb-1 w-full text-sm font-medium">Como vai pagar (o prestador aceita)</legend>
          {(payMethods.length ? payMethods : ["PIX", "DINHEIRO"]).filter(isPayMethod).map((m, i) => (
            <label key={m} className="flex items-center gap-2"><input type="radio" name="payMethod" value={m} defaultChecked={i === 0} className="accent-[var(--primary)]" /> {PAY_METHODS[m]}</label>
          ))}
        </fieldset>
      </Card>
      <Card className="space-y-1 border-primary/40 bg-primary/5">
        <p className="text-sm text-muted">Valor estimado</p>
        <p className="text-3xl font-extrabold">{formatBRL(price * qty)}</p>
        <p className="text-xs text-muted">{formatBRL(price)} {UNIT_LABEL[unit].per} × {qtyLabel(unit, qty)}. Você paga direto ao prestador. O Diária Paga não cobra nada de você. Extras se combinam no chat.</p>
      </Card>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Enviando…">Enviar pedido</SubmitButton>
      </PendingContext.Provider>
    </form>
  );
}
