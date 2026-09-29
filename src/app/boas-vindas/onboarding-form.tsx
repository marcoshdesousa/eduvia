"use client";
import { useActionState } from "react";
import { completeOnboardingAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form";
import { ProfileFields } from "@/components/profile-fields";

export function OnboardingForm({ suggested, initialError }: { suggested: string; initialError?: string }) {
  const [state, action, pending] = useActionState(completeOnboardingAction, initialError ? { error: initialError } : undefined);
  return (
    <form action={action} className="space-y-4">
      <FormError message={state?.error} />
      <ProfileFields defaultHandle={suggested} />
      <Button className="w-full" disabled={pending}>{pending ? "Salvando..." : "Continuar"}</Button>
    </form>
  );
}
