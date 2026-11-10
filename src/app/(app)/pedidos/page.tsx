import Link from "next/link";
import type { Metadata } from "next";
import { CalendarX } from "lucide-react";
import type { BookingStatus } from "@/generated/prisma/enums";
import { BookingBadge, Empty, PageTitle, ProPhoto } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, formatBRL, serviceLabel, shortName } from "@/lib/domain";
import { formatWhen } from "@/lib/places";
import { proPhotoUrl } from "@/lib/pros";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pedidos" };

const TABS: { key: string; label: string; statuses: BookingStatus[] }[] = [
  { key: "aguardando", label: "Aguardando aceite", statuses: ["WAITING_PRO"] },
  { key: "confirmados", label: "Confirmados", statuses: [...ACTIVE_STATUSES, "IN_REVIEW"] },
  { key: "historico", label: "Histórico", statuses: ["COMPLETED", "REFUSED", "EXPIRED", "CANCELED_CLIENT", "CANCELED_PRO"] },
];

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const user = await requireUser("/pedidos");
  const { aba } = await searchParams;
  const asPro = user.role === "PRO" && !!user.pro;
  const mine = asPro ? { proId: user.pro!.id } : { clientId: user.id };
  const counts = await Promise.all(TABS.map((t) => db.booking.count({ where: { ...mine, status: { in: t.statuses } } })));
  const current = TABS.find((t) => t.key === aba) ?? (counts[0] ? TABS[0] : counts[1] ? TABS[1] : TABS[0]);
  const list = await db.booking.findMany({
    where: { ...mine, status: { in: current.statuses } },
    orderBy: current.key === "historico" ? { scheduledAt: "desc" } : { scheduledAt: "asc" },
    take: 100,
    include: { pro: { include: { user: { select: { name: true } } } }, client: { select: { name: true } }, messages: { where: { readAt: null, NOT: { senderId: user.id } }, select: { id: true } } },
  });
  return (
    <div className="space-y-4">
      <PageTitle title={asPro ? "Pedidos recebidos" : "Meus pedidos"} />
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {TABS.map((t, i) => (
          <Link
            key={t.key}
            href={`/pedidos?aba=${t.key}`}
            role="tab"
            aria-selected={t === current}
            className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium", t === current ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted")}
          >
            {t.label} {counts[i] > 0 && <span className="opacity-80">({counts[i]})</span>}
          </Link>
        ))}
      </div>
      {list.length ? (
        <ul className="space-y-3">
          {list.map((b) => (
            <li key={b.id}>
              <Link href={`/pedidos/${b.id}`}>
                <Card className="flex items-center gap-3 transition hover:border-primary">
                  {asPro ? (
                    <ProPhoto url={null} name={b.client.name} size={48} />
                  ) : (
                    <ProPhoto url={proPhotoUrl(b.pro)} name={b.pro.user.name} size={48} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{asPro ? shortName(b.client.name) : shortName(b.pro.user.name)}</p>
                    <p className="text-sm">{formatWhen(b.scheduledAt, b.addrUf)}</p>
                    <p className="truncate text-xs text-muted">{b.hours} h · {b.addrCity}/{b.addrUf} · {b.services.map(serviceLabel).join(", ")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <BookingBadge status={b.status} />
                    <span className="text-sm font-semibold">{formatBRL(b.estimateCents)}</span>
                    {b.messages.length > 0 && <span className="rounded-full bg-danger px-2 text-[11px] text-white">{b.messages.length} nova(s)</span>}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={<CalendarX />} title="Nada por aqui">
          {asPro ? "Quando um cliente enviar um pedido, ele aparece aqui." : <Link href="/buscar" className="text-primary hover:underline">Encontre um profissional</Link>}
        </Empty>
      )}
    </div>
  );
}
