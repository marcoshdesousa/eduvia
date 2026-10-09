"use client";
import { useActionState } from "react";
import { updatePlanAction } from "@/app/actions/billing";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FormError, Input } from "@/components/ui/form";
import { LIMIT_FIELDS, type PlanLimits } from "@/lib/plans";

type Plan = { slug: string; name: string; priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number; limits: PlanLimits; subscribers: number; active: boolean };

const money = (c: number) => (c / 100).toFixed(2).replace(".", ",");

export function PlanEditor({ plan }: { plan: Plan }) {
  const [state, action, pending] = useActionState(updatePlanAction.bind(null, plan.slug), undefined);
  const isFree = plan.slug === "gratis";
  return (
    <Card>
      <ActionForm action={action} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">{plan.name} <span className="text-xs font-normal text-muted">({plan.subscribers} assinante(s) ativo(s))</span></h2>
          <Button size="sm" disabled={pending}>{pending ? "Salvando..." : "Salvar"}</Button>
        </div>
        <FormError message={state?.error} />
        {state?.message && <p className="text-sm text-success">{state.message}</p>}
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Nome" htmlFor={`${plan.slug}-name`}><Input id={`${plan.slug}-name`} name="name" defaultValue={plan.name} /></Field>
          {!isFree && (
            <>
              <input type="hidden" name="priceWeek" value={money(plan.priceWeekCents)} />
              <input type="hidden" name="priceFortnight" value={money(plan.priceFortnightCents)} />
              <Field label={plan.slug === "indicacao" ? "Preço 30 dias a partir da 2ª vez (R$)" : "Preço 30 dias (R$)"} htmlFor={`${plan.slug}-m`}>
                <Input id={`${plan.slug}-m`} name="priceMonth" inputMode="decimal" defaultValue={money(plan.priceMonthCents)} />
              </Field>
            </>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIMIT_FIELDS.map((f) =>
            f.kind === "boolean" ? (
              <label key={f.key} className="flex items-center gap-2 self-end pb-2 text-sm">
                <input type="checkbox" name={f.key} defaultChecked={plan.limits[f.key] as boolean} className="accent-[var(--primary)]" />
                {f.label}
              </label>
            ) : (
              <Field key={f.key} label={f.label} htmlFor={`${plan.slug}-${f.key}`}>
                <Input id={`${plan.slug}-${f.key}`} name={f.key} defaultValue={String(plan.limits[f.key])} inputMode="numeric" />
              </Field>
            ),
          )}
        </div>
        {!isFree && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={plan.active} className="accent-[var(--primary)]" />
            Mostrar este plano na página de assinatura
          </label>
        )}
        <p className="text-xs text-muted">
          Use -1 para ilimitado (nos limites por dia e por mês vale o que acabar primeiro). As mudanças valem na hora para todos os alunos deste plano.
          {plan.slug === "completo" && " Promoção: R$ 14,90 nos 3 primeiros meses de cada CPF."}
          {plan.slug === "indicacao" && " A primeira vez (com 3 indicações) custa R$ 7,90."}
        </p>
      </ActionForm>
    </Card>
  );
}
