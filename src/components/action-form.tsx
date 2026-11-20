"use client";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormError } from "@/components/ui/form";
import { PendingContext } from "@/components/submit-button";

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
  const [state, run, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnOk) ref.current?.reset();
  }, [state, resetOnOk]);
  return (
    <form
      ref={ref}
      className={className}
      onSubmit={(e) => {
        // envia sem o React limpar o formulário (assim nada do que foi digitado some se der erro)
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        const data = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => run(data));
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
      <div className="mt-3 empty:hidden">
        <FormError message={state?.error} />
        {state?.ok && <div role="status" className="rounded-2xl border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">{state.ok}</div>}
      </div>
    </form>
  );
}
