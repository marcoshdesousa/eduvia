import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarClock, CalendarX, History } from "lucide-react";
import { BookingBadge, Empty, PageTitle, ProPhoto } from "@/components/bits";
import { Card } from "@/components/ui/card";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, CLOSED_STATUSES, OPEN_STATUSES, category, formatBRL, qtyLabel, shortName } from "@/lib/domain";
import { accountPhotoUrl } from "@/lib/providers";
import { getMode, requireUser, workerPaid } from "@/lib/session";

export const metadata: Metadata = { title: "Pedidos" };

const TZ = "America/Sao_Paulo";
const day = (d: Date) => d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: TZ }).replace(".", "");
const time = (d: Date) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

export default async function BookingsPage() {
  const user = await requireUser("/pedidos");
  if (user.role === "ADMIN") redirect("/admin/pedidos");
  const mode = await getMode(user);
  const asPro = mode === "trabalho" && !!user.provider;
  if (asPro && !(await workerPaid(user.provider!.id))) redirect("/painel/plano?bloqueado=1");
  const mine: Prisma.BookingWhereInput = asPro ? { proId: user.provider!.id } : { clientId: user.id };
  const include = {
    pro: { include: { user: { select: { name: true } }, services: { select: { id: true, photoKey: true }, take: 1 } } },
    client: { select: { name: true } },
  } satisfies Prisma.BookingInclude;
  const [next, past] = await Promise.all([
    db.booking.findMany({ where: { ...mine, status: { in: [...OPEN_STATUSES, ...ACTIVE_STATUSES, "IN_REVIEW"] } }, orderBy: { scheduledAt: "asc" }, take: 50, include }),
    db.booking.findMany({ where: { ...mine, status: { in: CLOSED_STATUSES } }, orderBy: { scheduledAt: "desc" }, take: 50, include }),
  ]);

  const Row = ({ b, done }: { b: (typeof next)[number]; done?: boolean }) => {
    const cat = category(b.category);
    const who = asPro ? shortName(b.client.name) : b.pro ? shortName(b.pro.user.name) : "Procurando prestador…";
    const when = done ? (b.completedAt ?? b.canceledAt ?? b.scheduledAt) : b.scheduledAt;
    const value = b.finalCents ?? b.estimateCents;
    return (
      <li>
        <Link href={`/pedidos/${b.id}`}>
          <Card className="flex items-center gap-3 p-3 transition hover:border-primary">
            <div className="w-14 shrink-0 rounded-xl bg-primary/10 py-1.5 text-center leading-tight text-primary">
              <p className="text-[11px] font-semibold capitalize">{day(when).split(",")[0]}</p>
              <p className="text-sm font-extrabold">{day(when).split(", ")[1] ?? ""}</p>
              <p className="text-[11px] font-semibold">{time(when)}</p>
            </div>
            {!asPro && b.pro ? <ProPhoto url={accountPhotoUrl(b.pro)} name={b.pro.user.name} size={40} /> : <span className="text-2xl">{cat?.emoji ?? "🛠️"}</span>}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{who}</p>
              <p className="truncate text-xs text-muted">{cat?.label ?? b.category} · {qtyLabel(b.unit, b.quantity)}{b.mode === "QUICK" ? " · ⚡ rápido" : ""}</p>
              <div className="mt-1"><BookingBadge status={b.status} /></div>
            </div>
            {value != null && <span className="text-sm font-bold">{formatBRL(value)}</span>}
          </Card>
        </Link>
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <PageTitle title="Pedidos" subtitle={asPro ? "Serviços que você vai fazer e os que já fez." : "Serviços que você contratou."} />
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 font-bold"><CalendarClock size={18} className="text-primary" /> Próximos serviços</h2>
        {next.length ? <ul className="space-y-2">{next.map((b) => <Row key={b.id} b={b} />)}</ul> : (
          <Empty icon={<CalendarX />} title="Nenhum serviço marcado">
            {asPro ? "Quando um cliente pedir ou você agendar pela conversa, aparece aqui." : <Link href="/inicio" className="text-primary hover:underline">Encontre quem faz o serviço</Link>}
          </Empty>
        )}
      </section>
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 font-bold"><History size={18} className="text-muted" /> Anteriores</h2>
        {past.length ? <ul className="space-y-2">{past.map((b) => <Row key={b.id} b={b} done />)}</ul> : <p className="text-sm text-muted">Nada por aqui ainda.</p>}
      </section>
    </div>
  );
}
