"use client";
import { useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { closeTicketAction } from "@/app/actions/support";
import { Button } from "@/components/ui/button";

export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => confirm("Finalizar este chamado? O aluno não poderá mais mandar mensagens nele.") && start(() => closeTicketAction(ticketId))}
    >
      <CheckCircle2 size={16} /> Finalizar chamado
    </Button>
  );
}
