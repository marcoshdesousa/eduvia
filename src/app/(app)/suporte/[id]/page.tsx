import Link from "next/link";
import { notFound } from "next/navigation";
import { requireReadyUser } from "@/lib/session";
import { markStaffRepliesRead, ticketFor } from "@/lib/support";
import { sendSupportAction } from "@/app/actions/support";
import { SupportChat } from "@/components/support-chat";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Chamado" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  const ticket = await ticketFor((await params).id, user.id);
  if (!ticket) notFound();
  await markStaffRepliesRead(ticket.id);
  const at = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: user.timezone });
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/suporte" className="text-sm text-muted hover:text-foreground">← Chamados</Link>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">{ticket.kind}</h1>
        <Badge tone={ticket.status === "OPEN" ? "success" : "neutral"}>{ticket.status === "OPEN" ? "Aberto" : "Finalizado"}</Badge>
      </div>
      <SupportChat
        messages={ticket.messages.map((m) => ({ id: m.id, body: m.body, mine: !m.fromStaff, author: m.fromStaff ? "Equipe Eduvia" : "Você", at: at(m.createdAt) }))}
        action={sendSupportAction.bind(null, ticket.id)}
        placeholder="Escreva sua mensagem..."
        empty="Sem mensagens."
        closed={ticket.status === "CLOSED" ? "Este chamado foi finalizado pela equipe. Para outro assunto, abra um novo chamado." : null}
      />
    </div>
  );
}
