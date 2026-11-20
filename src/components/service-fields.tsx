"use client";
import { useState } from "react";
import { CATEGORIES, CATEGORY_GROUPS, DIARIA_HOURS, UNIT_LABEL, category, hourFromDaily, parseBRL, unitsOf } from "@/lib/domain";
import { Input, Label, Select, Textarea } from "@/components/ui/form";

type Unit = keyof typeof UNIT_LABEL;

/** Campos de um serviço: tipo, preço, cobrança (diária/hora/serviço) e especificações. */
export function ServiceFields({ defaults, lockCategory, exclude = [] }: { defaults?: { category?: string; price?: string; unit?: Unit; description?: string; hourPrice?: string }; lockCategory?: boolean; exclude?: string[] }) {
  const [cat, setCat] = useState(defaults?.category ?? "");
  const [unit, setUnit] = useState<Unit>(defaults?.unit ?? "DIARIA");
  const [price, setPrice] = useState(defaults?.price ?? "");
  const [byHour, setByHour] = useState(!!defaults?.hourPrice);
  const daily = parseBRL(price);
  const suggest = daily && unit === "DIARIA" ? (hourFromDaily(daily) / 100).toFixed(2).replace(".", ",") : "";
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="sf-category">Serviço</Label>
        {lockCategory ? (
          <>
            <Input id="sf-category" value={`${category(cat)?.emoji ?? ""} ${category(cat)?.label ?? cat}`} readOnly />
            <input type="hidden" name="category" value={cat} />
          </>
        ) : (
          <Select
            id="sf-category"
            name="category"
            required
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              const c = category(e.target.value);
              if (c) setUnit(c.unit);
            }}
          >
            <option value="">Escolha…</option>
            {CATEGORY_GROUPS.map((g) => (
              <optgroup key={g} label={g}>
                {CATEGORIES.filter((c) => c.group === g && !exclude.includes(c.slug)).map((c) => (
                  <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sf-price">Seu valor (R$)</Label>
          <Input id="sf-price" name="price" inputMode="decimal" placeholder="150,00" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="sf-unit">Cobrança</Label>
          <Select id="sf-unit" name="unit" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            {(cat ? unitsOf(cat) : (Object.keys(UNIT_LABEL) as Unit[])).map((u) => (
              <option key={u} value={u}>/ {UNIT_LABEL[u].one}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="sf-desc">O que você faz (especificações)</Label>
        <Textarea id="sf-desc" name="description" rows={3} maxLength={600} defaultValue={defaults?.description} placeholder="Ex.: levo os meus produtos; faço limpeza pós-obra; atendo até 8 horas por diária." />
      </div>
      {unit === "DIARIA" && <p className="-mt-1 text-xs text-muted">A diária é de até {DIARIA_HOURS} horas de trabalho. O cliente pode contratar várias diárias seguidas (até 30), sempre pelo valor cheio.</p>}
      {unit !== "HORA" && (
        <div className="space-y-2 rounded-2xl border border-border bg-surface-2/50 p-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="byHour" checked={byHour} onChange={(e) => setByHour(e.target.checked)} className="h-5 w-5 accent-[var(--color-primary)]" />
            Também trabalho por hora
          </label>
          {byHour && (
            <div>
              <Label htmlFor="sf-hour">Valor da hora (R$)</Label>
              <Input id="sf-hour" name="hourPrice" inputMode="decimal" placeholder={suggest || "25,00"} defaultValue={defaults?.hourPrice} required />
              <p className="mt-1 text-xs text-muted">
                O cliente contrata de 1 a {DIARIA_HOURS} horas. A hora sai mais cara que a diária dividida por {DIARIA_HOURS}
                {suggest ? <> (sugestão: R$ {suggest})</> : null}. Também libera chamados por hora no Contrate rápido.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
