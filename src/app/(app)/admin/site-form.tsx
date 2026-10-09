"use client";
import { useActionState } from "react";
import { saveSocialAction } from "@/app/actions/site";
import { ActionForm } from "@/components/action-form";
import { SocialIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/form";
import { SOCIALS, type SocialKey } from "@/lib/site-config";

export function SiteForm({ values }: { values: Partial<Record<SocialKey, string>> }) {
  const [state, action, pending] = useActionState(saveSocialAction, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      {state?.ok && <p className="text-sm text-success">{state.message}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {SOCIALS.map((s) => (
          <Field key={s.key} label={s.label} htmlFor={`social-${s.key}`}>
            <div className="flex items-center gap-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-muted"><SocialIcon name={s.key} /></span>
              <Input id={`social-${s.key}`} name={s.key} defaultValue={values[s.key] ?? ""} placeholder={s.placeholder} />
            </div>
          </Field>
        ))}
      </div>
      <p className="text-xs text-muted">Deixe em branco para esconder. Pode colar o link completo, o @ do perfil ou, no WhatsApp, só o número com DDD.</p>
      <Button disabled={pending}>{pending ? "Salvando..." : "Salvar redes sociais"}</Button>
    </ActionForm>
  );
}
