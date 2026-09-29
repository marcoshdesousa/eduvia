"use client";
import { useActionState } from "react";
import { updatePlanAction } from "@/app/actions/billing";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FormError, Input } from "@/components/ui/form";
import { LIMIT_FIELDS, type PlanLimits } from "@/lib/plans";

type Plan = { slug: string; name: string; priceWeekCents: number; priceMonthCents: number; limits: PlanLimits; subscribers: number };

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
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Nome" htmlFor={`${plan.slug}-name`}><Input id={`${plan.slug}-name`} name="name" defaultValue={plan.name} /></Field>
          {!isFree && (
            <>
              <Field label="Preço 7 dias (R$)" htmlFor={`${plan.slug}-w`}><Input id={`${plan.slug}-w`} name="priceWeek" inputMode="decimal" defaultValue={money(plan.priceWeekCents)} /></Field>
              <Field label="Preço 30 dias (R$)" htmlFor={`${plan.slug}-m`}><Input id={`${plan.slug}-m`} name="priceMonth" inputMode="decimal" defaultValue={money(plan.priceMonthCents)} /></Field>
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
        <p className="text-xs text-muted">Use -1 para ilimitado. As mudanças valem na hora para todos os alunos deste plano.</p>
      </ActionForm>
    </Card>
  );
}
