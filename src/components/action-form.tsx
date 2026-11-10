"use client";
import { useActionState, useEffect, useRef } from "react";
import { FormError } from "@/components/ui/form";

export type ActionResult = { error?: string; ok?: string } | null;

/**
 * Formulário ligado a uma server action que devolve { error } ou { ok }: mostra a mensagem
 * e mantém o que a pessoa digitou se der erro.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnOk,
  confirm,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  resetOnOk?: boolean;
  confirm?: string;
}) {
  const [state, run] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnOk) ref.current?.reset();
  }, [state, resetOnOk]);
  return (
    <form
      ref={ref}
      action={run}
      className={className}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      <div className="mt-3 empty:hidden">
        <FormError message={state?.error} />
        {state?.ok && <div role="status" className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.ok}</div>}
      </div>
    </form>
  );
}
