import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { SUPPORT_KINDS, userTickets } from "@/lib/support";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { NewTicketForm } from "./new-ticket-form";

export const metadata = { title: "Suporte" };

export default async function Page() {
  const user = await requireReadyUser();
  const tickets = await userTickets(user.id);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><LifeBuoy className="text-primary" /> Suporte</h1>
        <p className="text-sm text-muted">Abra um chamado e converse com a equipe do Eduvia por aqui. Você recebe um aviso quando respondermos.</p>
      </div>
      <Card className="space-y-3">
        <CardTitle>Novo chamado</CardTitle>
        <NewTicketForm kinds={[...SUPPORT_KINDS]} />
      </Card>
      {tickets.length > 0 && (
        <Card>
          <CardTitle>Seus chamados</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {tickets.map((t) => (
              <li key={t.id}>
                <Link href={`/suporte/${t.id}`} className="flex items-center gap-3 py-3 hover:text-primary">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{t.kind}</p>
                    <p className="truncate text-muted">{t.messages[0]?.fromStaff ? "Equipe: " : ""}{t.messages[0]?.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatDay(t.updatedAt)}</span>
                  {t._count.messages > 0 && <span className="rounded-full bg-danger px-2 text-xs font-bold text-white">{t._count.messages}</span>}
                  <Badge tone={t.status === "OPEN" ? "success" : "neutral"}>{t.status === "OPEN" ? "Aberto" : "Finalizado"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
