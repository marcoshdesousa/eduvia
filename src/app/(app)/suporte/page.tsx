import Link from "next/link";
import type { Metadata } from "next";
import { LifeBuoy } from "lucide-react";
import { Empty, PageTitle } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { TICKET_LABEL } from "@/lib/domain";

export const metadata: Metadata = { title: "Suporte" };

export default async function SupportPage() {
  const user = await requireUser("/suporte");
  const [tickets, settings] = await Promise.all([db.supportTicket.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }), getSettings()]);
  return (
    <div className="space-y-4">
      <PageTitle title="Suporte" subtitle="Fale com a equipe da HoraLimp.">
        <Link href="/suporte/novo" className={buttonClass("primary", "sm")}>Novo chamado</Link>
      </PageTitle>
      {settings.supportWhatsapp && <p className="text-sm text-muted">Também atendemos pelo WhatsApp {settings.supportWhatsapp}.</p>}
      {tickets.length ? (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link href={`/suporte/${t.id}`}>
                <Card className="flex items-center justify-between gap-2 py-3 transition hover:border-primary">
                  <span><span className="font-medium">{t.subject}</span><span className="block text-xs text-muted">{t.updatedAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span></span>
                  <Badge tone={TICKET_LABEL[t.status][1]}>{TICKET_LABEL[t.status][0]}</Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={<LifeBuoy />} title="Nenhum chamado">Se precisar de ajuda, abra um chamado.</Empty>
      )}
    </div>
  );
}
