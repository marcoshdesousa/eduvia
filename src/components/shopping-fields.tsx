import { ShoppingCart } from "lucide-react";
import { Input, Label } from "@/components/ui/form";
import { SHOPPING_RULE } from "@/lib/domain";

/** Compras no supermercado: telefone do cliente para o Pix das compras + a regra da notinha. */
export function ShoppingPhone({ id = "contactPhone" }: { id?: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-primary/30 bg-primary/5 p-3">
      <p className="flex items-center gap-2 text-sm font-semibold"><ShoppingCart size={16} className="text-primary" /> Compras no supermercado</p>
      <div>
        <Label htmlFor={id}>Seu telefone (para o Pix das compras)</Label>
        <Input id={id} name="contactPhone" inputMode="tel" autoComplete="tel" placeholder="(11) 98888-7777" maxLength={20} required />
      </div>
      <p className="text-xs text-muted">{SHOPPING_RULE}</p>
    </div>
  );
}
