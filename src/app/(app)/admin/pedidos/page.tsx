import Link from "next/link";
import type { Metadata } from "next";
import type { BookingStatus } from "@/generated/prisma/enums";
import { BookingBadge, Empty, PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { BOOKING_LABEL, formatBRL } from "@/lib/domain";
import { formatWhen } from "@/lib/places";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Solicitações" };

export default async function AdminBookings({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = sp.status && sp.status in BOOKING_LABEL ? (sp.status as BookingStatus) : null;
  const list = await db.booking.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { client: { select: { name: true } }, pro: { include: { user: { select: { name: true } } } } },
  });
  return (
    <div className="space-y-4">
      <PageTitle title="Solicitações e contratações" />
      <form className="flex gap-2">
        <Select name="status" defaultValue={status ?? ""}>
          <option value="">Todos os status</option>
          {Object.entries(BOOKING_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
        <Button type="submit">Filtrar</Button>
      </form>
      {list.length ? (
        <ul className="space-y-2">
          {list.map((b) => (
            <li key={b.id}>
              <Link href={`/pedidos/${b.id}`}>
                <Card className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm transition hover:border-primary">
                  <span>
                    <strong>{b.client.name}</strong> → {b.pro.user.name}
                    <span className="block text-xs text-muted">{formatWhen(b.scheduledAt, b.addrUf)} · {b.addrCity}/{b.addrUf} · {b.hours} h · {formatBRL(b.estimateCents)}</span>
                  </span>
                  <BookingBadge status={b.status} />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="Nenhuma solicitação" />
      )}
    </div>
  );
}
