"use client";
import { ActionForm } from "@/components/action-form";
import { useActionState, useTransition } from "react";
import { deletePreparationAction, setPreparationStatusAction, updateAgendaAction } from "@/app/actions/preparations";
import { AgendaFields } from "@/components/agenda-fields";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, FormError, Input } from "@/components/ui/form";

type Props = {
  prep: { id: string; title: string; status: string; dailyMinutes: number; studyDays: number[]; studyTime: string; examDate: string; reviewIntervals: string; includeEssay: boolean };
};

export function PrepSettings({ prep }: Props) {
  const [state, action, pending] = useActionState(updateAgendaAction, undefined);
  const [busy, start] = useTransition();
  return (
    <div className="space-y-4">
      <Card>
        <ActionForm action={action} className="space-y-5">
          <input type="hidden" name="preparationId" value={prep.id} />
          <FormError message={state?.error} />
          {state?.message && <p className="text-sm text-success">{state.message}</p>}
          <Field label="Nome" htmlFor="title"><Input id="title" name="title" defaultValue={prep.title} /></Field>
          <AgendaFields defaults={prep} essayDefault={prep.includeEssay} />
          <Field label="Intervalos das revisões (dias)" htmlFor="reviewIntervals" hint="R1, R2, R3, R4... contados a partir da conclusão do assunto.">
            <Input id="reviewIntervals" name="reviewIntervals" defaultValue={prep.reviewIntervals} />
          </Field>
          <Button disabled={pending}>{pending ? "Salvando..." : "Salvar e refazer plano"}</Button>
        </ActionForm>
      </Card>
      <Card className="space-y-3">
        <CardTitle>Outras ações</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={busy} onClick={() => start(() => setPreparationStatusAction(prep.id, prep.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE"))}>
            {prep.status === "ACTIVE" ? "Arquivar preparação" : "Reativar preparação"}
          </Button>
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => confirm("Excluir a preparação, seus materiais e todo o histórico? Não dá para desfazer.") && start(() => deletePreparationAction(prep.id))}
          >
            Excluir preparação
          </Button>
        </div>
      </Card>
    </div>
  );
}
