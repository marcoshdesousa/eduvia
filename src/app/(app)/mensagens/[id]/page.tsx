import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BookingBadge, ProPhoto } from "@/components/bits";
import { ChatBox } from "@/components/chat-box";
import { ReportButton } from "@/components/report-dialog";
import { conversationAccess } from "@/lib/chat";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, OPEN_STATUSES, REPORT_REASONS, category, shortName } from "@/lib/domain";
import { accountPhotoUrl } from "@/lib/providers";
import { requireUser, workerPaid } from "@/lib/session";
import { report } from "../../social-actions";
import { proposeScheduleAction } from "../actions";

export const metadata: Metadata = { title: "Conversa" };

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/mensagens/${id}`);
  const access = await conversationAccess(id, user);
  if (!access) notFound();
  if (access.as === "ADMIN") redirect("/admin");
  const asPro = access.as === "PRO";
  if (asPro && !(await workerPaid(access.conversation.pro.id))) redirect("/painel/plano?bloqueado=1");
  const c = await db.conversation.findUniqueOrThrow({
    where: { id },
    include: { client: { select: { id: true, name: true } }, pro: { include: { user: { select: { name: true } }, services: { select: { id: true, photoKey: true, category: true }, orderBy: { createdAt: "asc" } } } } },
  });
  // serviços combinados entre os dois (aparecem no topo da conversa)
  const bookings = await db.booking.findMany({
    where: { clientId: c.clientId, proId: c.proId, status: { in: [...OPEN_STATUSES, ...ACTIVE_STATUSES] } },
    orderBy: { scheduledAt: "asc" },
    take: 3,
  });
  const name = asPro ? c.client.name.split(" ")[0] : shortName(c.pro.user.name);
  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/mensagens" className="rounded-lg p-1 text-muted hover:bg-surface-2" aria-label="Voltar"><ChevronLeft /></Link>
        {asPro ? <ProPhoto url={null} name={c.client.name} size={40} /> : <ProPhoto url={accountPhotoUrl(c.pro)} name={c.pro.user.name} size={40} />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{name}</p>
          {!asPro && <Link href={`/prestador/${c.proId}`} className="text-xs text-primary">Ver perfil · {c.pro.services.map((s) => category(s.category)?.label).filter(Boolean).slice(0, 2).join(", ")}</Link>}
          {asPro && <p className="text-xs text-muted">Cliente</p>}
        </div>
        {!asPro && c.pro.directBooking && <Link href={`/contratar/${c.proId}`} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Contratar</Link>}
      </div>
      {bookings.map((b) => (
        <Link key={b.id} href={`/pedidos/${b.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span>{category(b.category)?.emoji} {category(b.category)?.label} · {b.mode === "QUICK" ? "agora" : b.scheduledAt.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}</span>
          <BookingBadge status={b.status} />
        </Link>
      ))}
      <ChatBox conversationId={c.id} otherName={name} initialWrite={access.write} scheduleAction={asPro ? proposeScheduleAction.bind(null, c.id) : undefined} />
      {!asPro && !c.pro.directBooking && <p className="text-center text-xs text-muted">Este prestador agenda pela conversa: combine o dia e ele manda o agendamento para você confirmar.</p>}
      <div className="flex justify-end">
        <ReportButton action={report} reasons={REPORT_REASONS} targetId={asPro ? c.clientId : c.pro.userId} label="Denunciar conversa" small />
      </div>
    </div>
  );
}
