import Link from "next/link";
import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { openConversation } from "../../actions";

export const metadata: Metadata = { title: "Conversa (admin)" };

/** O admin só vê a conversa depois de registrar a justificativa (vale 30 minutos). */
export default async function AdminConversation({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const allowed = await db.auditLog.findFirst({ where: { adminId: admin.id, action: "chat.open", targetId: id, createdAt: { gt: new Date(Date.now() - 30 * 60_000) } } });
  const b = await db.booking.findUnique({ where: { id }, include: { client: { select: { id: true, name: true } }, pro: { include: { user: { select: { name: true } } } } } });
  if (!b) return <p>Contratação não encontrada.</p>;
  if (!allowed) {
    return (
      <div className="space-y-4">
        <PageTitle title="Abrir conversa" subtitle="A conversa é privada. Só abra com motivo (denúncia, chamado de suporte, investigação)." />
        <Card>
          <ActionForm action={openConversation.bind(null, id)} className="space-y-3">
            <Input name="reason" required minLength={5} maxLength={300} placeholder="Justificativa (fica na auditoria)" />
            <SubmitButton pendingText="…">Abrir conversa</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    );
  }
  const msgs = await db.message.findMany({ where: { bookingId: id }, orderBy: { createdAt: "asc" } });
  return (
    <div className="space-y-4">
      <Link href={`/pedidos/${id}`} className="text-sm text-muted hover:text-foreground">← Contratação</Link>
      <PageTitle title="Conversa" subtitle={`${b.client.name} (cliente) e ${b.pro.user.name} (profissional)`} />
      <div className="space-y-2">
        {msgs.map((m) => {
          const fromClient = m.senderId === b.client.id;
          return (
            <div key={m.id} className={cn("flex", fromClient ? "justify-start" : "justify-end")}>
              <Card className="max-w-[85%] py-2 text-sm">
                <p className="text-xs text-muted">{fromClient ? "Cliente" : "Profissional"} · {m.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
                {m.kind === "TEXT" && <p className="whitespace-pre-wrap">{m.text}</p>}
                {m.kind === "IMAGE" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/mensagens/${m.id}/arquivo`} alt="Foto do chat" className="max-h-60 rounded" />
                )}
                {m.kind === "AUDIO" && <audio controls src={`/api/mensagens/${m.id}/arquivo`} className="h-9" />}
              </Card>
            </div>
          );
        })}
        {!msgs.length && <p className="text-sm text-muted">Sem mensagens.</p>}
      </div>
    </div>
  );
}
