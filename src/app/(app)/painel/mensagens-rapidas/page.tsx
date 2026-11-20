import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { Empty, PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireProvider } from "@/lib/session";
import { BackLink } from "../back-link";
import { addQuickReplyAction, deleteQuickReplyAction } from "../actions";

export const metadata: Metadata = { title: "Mensagens rápidas" };

export default async function QuickRepliesPage() {
  const user = await requireProvider();
  const list = await db.quickReply.findMany({ where: { proId: user.provider.id }, orderBy: { createdAt: "asc" } });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <BackLink />
      <PageTitle title="Mensagens rápidas" subtitle="Frases prontas para mandar com um toque na conversa (botão dos 4 quadradinhos)." />
      <Card>
        <ActionForm action={addQuickReplyAction} resetOnOk className="flex gap-2">
          <Input name="text" maxLength={300} placeholder="Ex.: Chego em 20 minutos" aria-label="Nova mensagem rápida" required />
          <SubmitButton pendingText="…">Salvar</SubmitButton>
        </ActionForm>
      </Card>
      {list.length ? (
        <ul className="space-y-2">
          {list.map((q) => (
            <li key={q.id}>
              <Card className="flex items-center gap-2 p-3 text-sm">
                <span className="flex-1">{q.text}</span>
                <ActionButton action={deleteQuickReplyAction.bind(null, q.id)} variant="ghost" size="sm" aria-label="Apagar" quiet><Trash2 size={14} /></ActionButton>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="Nenhuma mensagem rápida">Crie as frases que você mais usa.</Empty>
      )}
    </div>
  );
}
