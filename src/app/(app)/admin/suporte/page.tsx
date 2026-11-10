import Link from "next/link";
import type { Metadata } from "next";
import { Empty, PageTitle } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { TICKET_LABEL } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Suporte (admin)" };

export default async function AdminSupport() {
  await requireAdmin();
  const tickets = await db.supportTicket.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }], take: 100, include: { user: { select: { name: true } } } });
  return (
    <div className="space-y-4">
      <PageTitle title="Chamados de suporte" />
      {tickets.length ? (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link href={`/admin/suporte/${t.id}`}>
                <Card className="flex items-center justify-between gap-2 py-3 text-sm transition hover:border-primary">
                  <span><strong>{t.subject}</strong><span className="block text-xs text-muted">{t.user.name} · {t.updatedAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span></span>
                  <Badge tone={TICKET_LABEL[t.status][1]}>{TICKET_LABEL[t.status][0]}</Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="Nenhum chamado" />
      )}
    </div>
  );
}
