"use client";
import { useActionState, useState } from "react";
import { CreditCard, QrCode } from "lucide-react";
import { checkoutAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Plan = { slug: string; name: string; price: string; period: string; note?: string };

function maskDoc(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}

export function CheckoutForm({ plans, defaultName, isMinor, startsLater }: { plans: Plan[]; defaultName: string; isMinor: boolean; startsLater: string | null }) {
  const [state, action, pending] = useActionState(checkoutAction, undefined);
  const [plan, setPlan] = useState(plans[plans.length - 1].slug);
  const [method, setMethod] = useState<"PIX" | "CREDIT_CARD">("PIX");
  const [doc, setDoc] = useState("");
  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />
      <input type="hidden" name="planSlug" value={plan} />
      <input type="hidden" name="billingType" value={method} />
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => (
          <button
            type="button"
            key={p.slug}
            onClick={() => setPlan(p.slug)}
            aria-pressed={plan === p.slug}
            className={cn("rounded-xl border p-4 text-left transition-colors", plan === p.slug ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2")}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{p.name}</span>
              {p.note && <span className="text-xs text-primary">{p.note}</span>}
            </div>
            <div className="mt-1 text-2xl font-bold">
              {p.price}
              <span className="text-sm font-normal text-muted">/{p.period}</span>
            </div>
          </button>
        ))}
      </div>
      <div>
        <div className="mb-1.5 text-sm font-medium">Forma de pagamento</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "PIX" as const, label: "Pix", icon: QrCode, hint: "Um Pix a cada renovação" },
            { key: "CREDIT_CARD" as const, label: "Cartão de crédito", icon: CreditCard, hint: "Renova automaticamente" },
          ].map((m) => (
            <button
              type="button"
              key={m.key}
              onClick={() => setMethod(m.key)}
              aria-pressed={method === m.key}
              className={cn("flex items-center gap-3 rounded-xl border p-3 text-left", method === m.key ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2")}
            >
              <m.icon size={20} className="shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-medium">{m.label}</span>
                <span className="block text-xs text-muted">{m.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {isMinor && <p className="rounded-lg bg-warning/10 p-3 text-sm">Como você é menor de idade, use o nome e o CPF do seu responsável.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome de quem paga" htmlFor="payerName">
          <Input id="payerName" name="payerName" defaultValue={isMinor ? "" : defaultName} required />
        </Field>
        <Field label="CPF ou CNPJ" htmlFor="cpfCnpj" hint="Exigido pelo Banco Central para emitir a cobrança.">
          <Input id="cpfCnpj" name="cpfCnpj" inputMode="numeric" value={doc} onChange={(e) => setDoc(maskDoc(e.target.value))} required />
        </Field>
      </div>
      {startsLater && <p className="text-sm text-muted">A primeira cobrança do novo plano vence em {startsLater}, quando termina o período que você já pagou.</p>}
      <Button className="w-full sm:w-auto" size="lg" disabled={pending}>{pending ? "Gerando cobrança..." : method === "PIX" ? "Gerar Pix" : "Ir para o pagamento"}</Button>
      <p className="text-xs text-muted">Pagamento processado pelo Asaas. Cancele quando quiser: o acesso continua até o fim do período pago.</p>
    </form>
  );
}
