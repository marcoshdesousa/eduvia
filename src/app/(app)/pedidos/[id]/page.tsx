import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, ExternalLink, Info, LifeBuoy, Lock, MapPin, Wallet } from "lucide-react";
import { BookingBadge, ProPhoto, Rating, Stars } from "@/components/bits";
import { ChatBox } from "@/components/chat-box";
import { MapPicker } from "@/components/map-picker";
import { ReportButton } from "@/components/report-dialog";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { roleIn } from "@/lib/bookings";
import { db } from "@/lib/db";
import { BOOKING_LABEL, REPORT_REASONS, canReview, chatOpen, formatBRL, nextSteps, proSeesAddress, ratingOf, serviceLabel, shortName } from "@/lib/domain";
import { formatWhen } from "@/lib/places";
import { proPhotoUrl } from "@/lib/pros";
import { requireUser } from "@/lib/session";
import { report, toggleBlock } from "../../social-actions";
import { changeStatusAction, reviewAction } from "./actions";
import { ReviewForm } from "./review-form";
import { StatusActions } from "./status-actions";

export const metadata: Metadata = { title: "Pedido" };

export default async function BookingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enviado?: string }> }) {
  const { id } = await params;
  const { enviado } = await searchParams;
  const user = await requireUser(`/pedidos/${id}`);
  const b = await db.booking.findUnique({
    where: { id },
    include: {
      pro: { include: { user: { select: { id: true, name: true } } } },
      client: { select: { id: true, name: true } },
      history: { orderBy: { createdAt: "asc" }, include: { by: { select: { name: true, role: true } } } },
      reviews: true,
    },
  });
  if (!b) notFound();
  const as = roleIn(b, user);
  if (!as) notFound();
  const isClient = as === "CLIENT";
  const isPro = as === "PRO";
  const showAddress = !b.addressPurgedAt && (isClient || as === "ADMIN" || (isPro && proSeesAddress(b)));
  const chat = chatOpen(b);
  const myReview = b.reviews.find((r) => r.authorId === user.id);
  const otherReview = b.reviews.find((r) => r.authorId !== user.id);
  const steps = nextSteps(b.status, as);
  const clientRating = isPro || as === "ADMIN" ? await db.review.aggregate({ where: { targetId: b.clientId, hiddenAt: null }, _avg: { stars: true }, _count: true }) : null;
  const blocked = as !== "ADMIN" ? await db.block.findUnique({ where: { blockerId_blockedId: { blockerId: user.id, blockedId: isClient ? b.pro.userId : b.clientId } } }) : null;
  const point = b.lat != null && b.lng != null ? { lat: b.lat, lng: b.lng } : null;
  const fullAddress = [b.addrStreet, b.addrNumber, b.addrComplement, b.addrDistrict, `${b.addrCity}/${b.addrUf}`, b.addrCep ? `CEP ${b.addrCep.replace(/(\d{5})(\d{3})/, "$1-$2")}` : null].filter(Boolean).join(", ");
  const mapsUrl = point ? `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const otherName = isClient || as === "ADMIN" ? shortName(b.pro.user.name) : b.acceptedAt ? b.client.name.split(" ")[0] : shortName(b.client.name);

  return (
    <div className="space-y-4">
      <Link href="/pedidos" className="text-sm text-muted hover:text-foreground">← Pedidos</Link>
      {enviado && b.status === "WAITING_PRO" && (
        <Card className="flex gap-3 border-success/40 bg-success/5">
          <CheckCircle2 className="shrink-0 text-success" />
          <p className="text-sm">Solicitação enviada! O profissional vai aceitar ou recusar. Avisamos você por aqui.</p>
        </Card>
      )}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {isPro ? <ProPhoto url={null} name={b.client.name} size={56} /> : <ProPhoto url={proPhotoUrl(b.pro)} name={b.pro.user.name} size={56} />}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">{isPro ? "Cliente" : "Profissional"}</p>
              {isPro ? (
                <p className="font-semibold">{otherName}</p>
              ) : (
                <Link href={`/profissional/${b.pro.id}`} className="font-semibold hover:underline">{shortName(b.pro.user.name)}</Link>
              )}
              {isPro && clientRating && clientRating._count > 0 ? (
                <Rating value={Math.round((clientRating._avg.stars ?? 0) * 10) / 10} count={clientRating._count} />
              ) : !isPro ? (
                <Rating value={ratingOf(b.pro)} count={b.pro.ratingCount} />
              ) : null}
            </div>
          </div>
          <BookingBadge status={b.status} />
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-2"><CalendarClock size={18} className="shrink-0 text-primary" /><div><dt className="text-muted">Quando</dt><dd className="font-medium">{formatWhen(b.scheduledAt, b.addrUf)} · {b.hours} {b.hours === 1 ? "hora" : "horas"}</dd></div></div>
          <div className="flex gap-2"><Wallet size={18} className="shrink-0 text-primary" /><div><dt className="text-muted">Valor estimado</dt><dd className="font-medium">{formatBRL(b.estimateCents)} <span className="font-normal text-muted">({formatBRL(b.hourlyCents)} × {b.hours} h)</span></dd><dd className="text-xs text-muted">Pago direto ao profissional{b.payMethod ? `, em ${b.payMethod === "PIX" ? "Pix" : "dinheiro"} (informado pelo cliente)` : " em dinheiro ou Pix"}. A HoraLimp não recebe esse valor.</dd></div></div>
        </dl>
        <div className="flex flex-wrap gap-2">
          {b.services.map((s) => <span key={s} className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">{serviceLabel(s)}</span>)}
        </div>
        {(b.notes || b.homeSize || b.rooms) && (
          <div className="rounded-lg bg-surface-2 p-3 text-sm">
            {b.homeSize && <p>Tamanho: {b.homeSize}</p>}
            {b.rooms && <p>Cômodos: {b.rooms}</p>}
            {b.notes && <p className="whitespace-pre-line">Observações: {b.notes}</p>}
          </div>
        )}
        {b.status === "WAITING_PRO" && b.expiresAt && (
          <p className="flex items-center gap-2 text-sm text-muted"><Info size={16} /> {isPro ? "Responda até" : "O profissional tem até"} {b.expiresAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}{isPro ? "." : " para responder. Sem resposta, a solicitação expira e você pode escolher outra pessoa."}</p>
        )}
        {b.cancelReason && <p className="text-sm text-muted">Motivo do cancelamento: {b.cancelReason}</p>}
        <StatusActions steps={steps} action={changeStatusAction.bind(null, b.id)} adminLabels={as === "ADMIN"} />
        {(b.status === "REFUSED" || b.status === "EXPIRED") && isClient && <Link href={`/buscar?uf=${b.addrUf}&cidade=${encodeURIComponent(b.addrCity)}`} className={buttonClass("primary")}>Escolher outro profissional</Link>}
      </Card>

      <Card className="space-y-3">
        <CardTitle className="flex items-center gap-2"><MapPin size={18} /> Endereço</CardTitle>
        {showAddress ? (
          <>
            <p className="text-sm">{fullAddress}</p>
            {b.addrReference && <p className="text-sm text-muted">Referência: {b.addrReference}</p>}
            {point && <MapPicker value={point} height={220} />}
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={buttonClass("outline", "sm")}><ExternalLink size={14} /> Abrir no Google Maps</a>
          </>
        ) : b.addressPurgedAt ? (
          <p className="text-sm text-muted">Endereço apagado por privacidade. Cidade: {b.addrCity}/{b.addrUf}.</p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted"><Lock size={16} /> {b.addrDistrict ? `${b.addrDistrict}, ` : ""}{b.addrCity}/{b.addrUf}. O endereço completo aparece depois que você aceitar.</p>
        )}
      </Card>

      {chat.read && as !== "ADMIN" ? (
        <ChatBox bookingId={b.id} otherName={otherName} initialWrite={chat.write && !blocked} />
      ) : chat.read && as === "ADMIN" ? (
        <Card className="space-y-2 text-sm">
          <CardTitle>Conversa</CardTitle>
          <p className="text-muted">Por privacidade, o admin só abre a conversa quando há denúncia ou pedido de suporte.</p>
          <Link href={`/admin/conversa/${b.id}`} className={buttonClass("outline", "sm")}>Abrir conversa (fica registrado)</Link>
        </Card>
      ) : (
        <Card className="text-sm text-muted">O chat é liberado quando o profissional aceitar a solicitação.</Card>
      )}

      {b.status === "COMPLETED" && (isClient || isPro) && (
        <Card className="space-y-3">
          <CardTitle>Avaliação</CardTitle>
          {myReview ? (
            <div className="text-sm"><p>Sua avaliação: <Stars value={myReview.stars} /></p>{myReview.comment && <p className="text-muted">“{myReview.comment}”</p>}</div>
          ) : canReview(b, false) ? (
            <ReviewForm action={reviewAction.bind(null, b.id)} who={otherName} />
          ) : null}
          {otherReview && !otherReview.hiddenAt && (
            <div className="border-t border-border pt-3 text-sm"><p>Avaliação que você recebeu: <Stars value={otherReview.stars} /></p>{otherReview.comment && <p className="text-muted">“{otherReview.comment}”</p>}</div>
          )}
        </Card>
      )}

      <Card className="space-y-3">
        <CardTitle>Histórico</CardTitle>
        <ol className="space-y-2 border-l-2 border-border pl-4 text-sm">
          {b.history.map((h) => (
            <li key={h.id}>
              <p className="font-medium">{BOOKING_LABEL[h.to]}</p>
              <p className="text-xs text-muted">
                {h.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {h.by ? (h.by.role === "ADMIN" ? "Suporte HoraLimp" : h.by.name.split(" ")[0]) : "Automático"}
                {h.reason ? ` · ${h.reason}` : ""}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      {as !== "ADMIN" && (
        <div className="flex flex-wrap items-start gap-2">
          <Link href={`/suporte/novo?pedido=${b.id}`} className={buttonClass("ghost", "sm", "text-muted")}><LifeBuoy size={14} /> Pedir ajuda ao suporte</Link>
          <ReportButton action={report} reasons={REPORT_REASONS} targetId={isClient ? b.pro.userId : b.clientId} bookingId={b.id} label={isClient ? "Denunciar profissional" : "Denunciar cliente"} />
          <form action={toggleBlock.bind(null, isClient ? b.pro.userId : b.clientId)}>
            <button type="submit" className={buttonClass("ghost", "sm", "text-muted")}>{blocked ? "Desbloquear" : "Bloquear"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
