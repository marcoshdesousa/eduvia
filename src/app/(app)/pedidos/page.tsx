import Link from "next/link";
import type { Metadata } from "next";
import { CalendarX } from "lucide-react";
import type { BookingStatus } from "@/generated/prisma/enums";
import { BookingBadge, Empty, PageTitle, ProPhoto } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, CLOSED_STATUSES, category, formatBRL, qtyLabel, shortName } from "@/lib/domain";
import { formatWhen } from "@/lib/places";
import { providerPhotoUrl } from "@/lib/providers";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pedidos" };

const FILTERS: { key: string; label: string; statuses: BookingStatus[] }[] = [
  { key: "abertos", label: "Em aberto", statuses: ["SEARCHING", "WAITING_PRO"] },
  { key: "andamento", label: "Confirmados", statuses: [...ACTIVE_STATUSES, "IN_REVIEW"] },
  { key: "historico", label: "Histórico", statuses: CLOSED_STATUSES },
];

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ aba?: string; ver?: string }> }) {
  const user = await requireUser("/pedidos");
  const { aba, ver } = await searchParams;
  const pro = user.provider;
  const side = pro && (aba === "recebi" || (!aba && (await db.booking.count({ where: { proId: pro.id, status: { in: ["WAITING_PRO", ...ACTIVE_STATUSES] } } })) > 0)) ? "recebi" : "contratei";
  const mine = side === "recebi" && pro ? { proId: pro.id } : { clientId: user.id };
  const counts = await Promise.all(FILTERS.map((t) => db.booking.count({ where: { ...mine, status: { in: t.statuses } } })));
  const current = FILTERS.find((t) => t.key === ver) ?? (counts[0] ? FILTERS[0] : counts[1] ? FILTERS[1] : FILTERS[2]);
  const list = await db.booking.findMany({
    where: { ...mine, status: { in: current.statuses } },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { pro: { include: { user: { select: { name: true } } } }, client: { select: { name: true } }, messages: { where: { readAt: null, NOT: { senderId: user.id } }, select: { id: true } } },
  });
  const asPro = side === "recebi";
  return (
    <div className="space-y-4">
      <PageTitle title="Pedidos" />
      {pro && (
        <div className="grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-sm font-semibold">
          {(["contratei", "recebi"] as const).map((s) => (
            <Link key={s} href={`/pedidos?aba=${s}`} className={cn("rounded-lg py-2 text-center", side === s ? "bg-surface shadow-sm" : "text-muted")}>
              {s === "contratei" ? "Contratei" : "Recebi (trabalho)"}
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {FILTERS.map((t, i) => (
          <Link
            key={t.key}
            href={`/pedidos?aba=${side}&ver=${t.key}`}
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
          {list.map((b) => {
            const cat = category(b.category);
            const who = asPro ? shortName(b.client.name) : b.pro ? shortName(b.pro.user.name) : "Procurando prestador…";
            return (
              <li key={b.id}>
                <Link href={`/pedidos/${b.id}`}>
                  <Card className="flex items-center gap-3 transition hover:border-primary">
                    {asPro || !b.pro ? (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-2xl">{cat?.emoji ?? "🛠️"}</div>
                    ) : (
                      <ProPhoto url={providerPhotoUrl(b.pro)} name={b.pro.user.name} size={48} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{who}</p>
                      <p className="truncate text-sm">{b.mode === "QUICK" ? "⚡ Contrate rápido" : formatWhen(b.scheduledAt, b.addrUf)}</p>
                      <p className="truncate text-xs text-muted">{cat?.label ?? b.category} · {qtyLabel(b.unit, b.quantity)} · {b.addrDistrict ? `${b.addrDistrict}, ` : ""}{b.addrCity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <BookingBadge status={b.status} />
                      {(b.finalCents ?? b.estimateCents ?? b.maxCents) != null && <span className="text-sm font-semibold">{formatBRL((b.finalCents ?? b.estimateCents ?? b.maxCents)!)}</span>}
                      {b.messages.length > 0 && <span className="rounded-full bg-danger px-2 text-[11px] text-white">{b.messages.length} nova(s)</span>}
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty icon={<CalendarX />} title="Nada por aqui">
          {asPro ? "Quando um cliente pedir um serviço seu, aparece aqui." : <Link href="/inicio" className="text-primary hover:underline">Encontre quem faz o serviço</Link>}
        </Empty>
      )}
    </div>
  );
}
