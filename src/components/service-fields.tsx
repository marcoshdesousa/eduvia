"use client";
import { useState } from "react";
import { CATEGORIES, CATEGORY_GROUPS, UNIT_LABEL, category } from "@/lib/domain";
import { Input, Label, Select, Textarea } from "@/components/ui/form";

type Unit = keyof typeof UNIT_LABEL;

/** Campos de um serviço: tipo, preço, cobrança (diária/hora/serviço) e especificações. */
export function ServiceFields({ defaults, lockCategory, exclude = [] }: { defaults?: { category?: string; price?: string; unit?: Unit; description?: string }; lockCategory?: boolean; exclude?: string[] }) {
  const [cat, setCat] = useState(defaults?.category ?? "");
  const [unit, setUnit] = useState<Unit>(defaults?.unit ?? "DIARIA");
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
          <Input id="sf-price" name="price" inputMode="decimal" placeholder="150,00" defaultValue={defaults?.price} required />
        </div>
        <div>
          <Label htmlFor="sf-unit">Cobrado</Label>
          <Select id="sf-unit" name="unit" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            {(Object.keys(UNIT_LABEL) as Unit[]).map((u) => (
              <option key={u} value={u}>{UNIT_LABEL[u].per}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="sf-desc">Especificações (opcional)</Label>
        <Textarea id="sf-desc" name="description" rows={3} maxLength={600} defaultValue={defaults?.description} placeholder="Ex.: levo os meus produtos; faço limpeza pós-obra; atendo até 8 horas por diária." />
        <p className="mt-1 text-xs text-muted">Não coloque telefone nem WhatsApp: todo contato é pelo chat do app.</p>
      </div>
    </div>
  );
}
