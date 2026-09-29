"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState } from "react";
import { completeProfileAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";
import { ProfileFields } from "@/components/profile-fields";

export function OnboardingForm({ suggested, phone }: { suggested: string; phone: string }) {
  const [state, action, pending] = useActionState(completeProfileAction, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <FormError message={state?.error} />
      <ProfileFields defaultHandle={suggested} defaultPhone={phone} />
      <Button className="w-full" disabled={pending}>{pending ? "Salvando..." : "Continuar"}</Button>
    </ActionForm>
  );
}
