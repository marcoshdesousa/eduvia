import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { replyTicket } from "../actions";
import { TICKET_LABEL } from "@/lib/domain";

export const metadata: Metadata = { title: "Chamado" };

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/suporte/${id}`);
  const t = await db.supportTicket.findFirst({ where: { id, userId: user.id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  return (
    <div className="space-y-4">
      <Link href="/suporte" className="text-sm text-muted hover:text-foreground">← Suporte</Link>
      <PageTitle title={t.subject}>
        <Badge tone={TICKET_LABEL[t.status][1]}>{TICKET_LABEL[t.status][0]}</Badge>
      </PageTitle>
      {t.bookingId && <Link href={`/pedidos/${t.bookingId}`} className="text-sm text-primary hover:underline">Ver a contratação</Link>}
      <div className="space-y-2">
        {t.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.fromAdmin ? "justify-start" : "justify-end")}>
            <Card className={cn("max-w-[85%] py-2", m.fromAdmin ? "border-primary/40" : "bg-surface-2")}>
              <p className="text-xs font-medium text-muted">{m.fromAdmin ? "Suporte HoraLimp" : "Você"} · {m.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
              <p className="whitespace-pre-wrap text-sm">{m.text}</p>
            </Card>
          </div>
        ))}
      </div>
      {t.status !== "CLOSED" ? (
        <Card>
          <ActionForm action={replyTicket.bind(null, t.id)} className="space-y-3" resetOnOk>
            <Textarea name="text" required maxLength={3000} placeholder="Escreva aqui" />
            <SubmitButton pendingText="Enviando…">Responder</SubmitButton>
          </ActionForm>
        </Card>
      ) : (
        <p className="text-sm text-muted">Chamado encerrado.</p>
      )}
    </div>
  );
}
