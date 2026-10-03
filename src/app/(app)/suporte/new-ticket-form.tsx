"use client";
import { useActionState } from "react";
import { Send } from "lucide-react";
import { openTicketAction } from "@/app/actions/support";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Field, FormError, Select, Textarea } from "@/components/ui/form";

export function NewTicketForm({ kinds }: { kinds: string[] }) {
  const [state, action, pending] = useActionState(openTicketAction, undefined);
  return (
    <ActionForm action={action} className="space-y-3">
      <FormError message={state?.error} />
      <Field label="Tipo" htmlFor="kind">
        <Select id="kind" name="kind" defaultValue={kinds[0]}>
          {kinds.map((k) => <option key={k} value={k}>{k}</option>)}
        </Select>
      </Field>
      <Field label="Mensagem" htmlFor="ticket-body">
        <Textarea id="ticket-body" name="body" rows={4} required maxLength={2000} placeholder="Conte o que aconteceu ou qual é a sua dúvida..." />
      </Field>
      <Button disabled={pending}><Send size={16} /> {pending ? "Abrindo..." : "Abrir chamado"}</Button>
    </ActionForm>
  );
}
