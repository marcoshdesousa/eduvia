"use client";
import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { FormError, Textarea } from "@/components/ui/form";
import type { FormState } from "@/app/actions/account";
import { cn } from "@/lib/utils";

export type ChatMessage = { id: string; body: string; mine: boolean; author: string; at: string };

/** Conversa de suporte (usada pelo aluno em /suporte e pela equipe no /admin). */
export function SupportChat({
  messages,
  action,
  placeholder,
  empty,
}: {
  messages: ChatMessage[];
  action: (state: FormState, f: FormData) => Promise<FormState>;
  placeholder: string;
  empty: string;
}) {
  const [state, send, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);
  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [messages.length]);
  return (
    <div className="space-y-4">
      <div className="max-h-[55vh] space-y-3 overflow-y-auto rounded-xl border border-border bg-surface p-4">
        {!messages.length && <p className="py-6 text-center text-sm text-muted">{empty}</p>}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-2 text-sm", m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-surface-2")}>
              <p className={cn("mb-0.5 text-[11px] font-semibold", m.mine ? "text-primary-foreground/80" : "text-muted")}>{m.author} · {m.at}</p>
              <p className="whitespace-pre-wrap break-words">{m.body}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <ActionForm ref={formRef} action={send} className="space-y-2">
        <FormError message={state?.error} />
        {state?.ok && <p className="text-sm text-success">{state.message}</p>}
        <Textarea name="body" rows={3} placeholder={placeholder} aria-label="Mensagem" required maxLength={2000} />
        <Button disabled={pending}><Send size={16} /> {pending ? "Enviando..." : "Enviar"}</Button>
      </ActionForm>
    </div>
  );
}
