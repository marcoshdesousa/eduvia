"use client";
import { useActionState, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddressFields, type SavedAddress } from "@/components/address-fields";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardTitle } from "@/components/ui/card";
import { FormError, Input, Label, Textarea } from "@/components/ui/form";
import { MAX_QTY, UNIT_LABEL, formatBRL, qtyLabel } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { createBookingAction } from "../../hire-actions";

type Service = { category: string; label: string; emoji: string; priceCents: number; unit: keyof typeof UNIT_LABEL; description: string | null };

export function BookingForm({ proId, services, initial, agenda, saved, ufs }: { proId: string; services: Service[]; initial: string; agenda: string[]; saved: SavedAddress[]; ufs: { uf: string; name: string }[] }) {
  const [state, run] = useActionState(createBookingAction, null);
  const [cat, setCat] = useState(services.find((s) => s.category === initial)?.category ?? services[0]?.category);
  const [qty, setQty] = useState(1);
  const s = services.find((x) => x.category === cat)!;
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  return (
    <form action={run} className="space-y-4">
      <input type="hidden" name="proId" value={proId} />
      <input type="hidden" name="category" value={cat} />
      <input type="hidden" name="quantity" value={qty} />
      <Card className="space-y-3">
        <CardTitle>1. Serviço</CardTitle>
        <div className="space-y-2">
          {services.map((x) => (
            <button key={x.category} type="button" onClick={() => { setCat(x.category); setQty(1); }} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left", cat === x.category ? "border-primary bg-primary/5" : "border-border")}>
              <span className="text-2xl">{x.emoji}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{x.label}</span>
                {x.description && <span className="block text-xs text-muted">{x.description}</span>}
              </span>
              <span className="text-sm font-bold">{formatBRL(x.priceCents)}<span className="block text-right text-[10px] font-normal text-muted">{UNIT_LABEL[x.unit].per}</span></span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Menos"><Minus size={16} /></button>
          <span className="min-w-28 text-center text-lg font-bold">{qtyLabel(s.unit, qty)}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY[s.unit], q + 1))} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Mais"><Plus size={16} /></button>
        </div>
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
        <Textarea name="notes" maxLength={1000} placeholder="Conte o que precisa ser feito (opcional)." aria-label="Observações" />
        <fieldset className="flex flex-wrap items-center gap-4 text-sm">
          <legend className="mb-1 w-full text-sm font-medium">Como vai pagar ao prestador</legend>
          <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="PIX" defaultChecked className="accent-[var(--primary)]" /> Pix</label>
          <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="DINHEIRO" className="accent-[var(--primary)]" /> Dinheiro</label>
          <label className="flex items-center gap-2"><input type="radio" name="payMethod" value="CARTAO" className="accent-[var(--primary)]" /> Cartão (se tiver maquininha)</label>
        </fieldset>
      </Card>
      <Card className="space-y-1 border-primary/40 bg-primary/5">
        <p className="text-sm text-muted">Valor estimado</p>
        <p className="text-3xl font-extrabold">{formatBRL(s.priceCents * qty)}</p>
        <p className="text-xs text-muted">{formatBRL(s.priceCents)} {UNIT_LABEL[s.unit].per} × {qtyLabel(s.unit, qty)}. Você paga direto ao prestador. O Diária Paga não cobra nada de você. Extras se combinam no chat.</p>
      </Card>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Enviando…">Enviar pedido</SubmitButton>
    </form>
  );
}
