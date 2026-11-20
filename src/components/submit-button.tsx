"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createContext, useContext, type ComponentProps } from "react";

/** Envio em andamento nos formulários que enviam pelo onSubmit (ActionForm). */
export const PendingContext = createContext(false);

/** Botão de enviar que mostra "carregando" e evita clique duplo. */
export function SubmitButton({ children, pendingText, ...props }: ComponentProps<typeof Button> & { pendingText?: string }) {
  const status = useFormStatus();
  const busy = useContext(PendingContext);
  const pending = status.pending || busy;
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}
