import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, ShoppingCart, CalendarClock, CheckCircle2, ExternalLink, Info, LifeBuoy, Lock, MapPin, Timer, Wallet, Zap } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { BookingBadge, ProPhoto, Rating, Stars } from "@/components/bits";
import { ChatBox } from "@/components/chat-box";
import { conversationWith } from "@/lib/chat";
import { proposeScheduleAction } from "../../mensagens/actions";
import { ConfirmSchedule } from "./confirm-schedule";
import { UFS } from "@/lib/places";
import { savedAddresses } from "@/lib/saved-addresses";
import { MapPicker } from "@/components/map-picker";
import { ReportButton } from "@/components/report-dialog";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { roleIn } from "@/lib/bookings";
import { db } from "@/lib/db";
import { ARRIVE_HOURS, BOOKING_LABEL, CLIENT_NOSHOW_WAIT_MIN, REPORT_REASONS, UNIT_LABEL, canReview, category, chatOpen, formatBRL, nextSteps, proSeesAddress, qtyLabel, qtyLong, ratingOf, shortName, SHOPPING_RULE, needsShoppingList, whatsappLabel, whatsappLink } from "@/lib/domain";
import { openSecret } from "@/lib/secret-box";
import { formatWhen } from "@/lib/places";
import { accountPhotoUrl } from "@/lib/providers";
import { requireUser } from "@/lib/session";
import { report, toggleBlock } from "../../social-actions";
import { cancelSearchAction, changeStatusAction, clientNoShowAction, reviewAction } from "./actions";
import { AutoRefresh, Countdown, LiveDistance, Radar } from "./live";
import { ReviewForm } from "./review-form";
import { StatusActions } from "./status-actions";

export const metadata: Metadata = { title: "Pedido" };

const PAY: Record<string, string> = { PIX: "Pix", DINHEIRO: "dinheiro", DEBITO: "cartão de débito", CREDITO: "cartão de crédito", CARTAO: "cartão" };

export default async function BookingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enviado?: string }> }) {
  const { id } = await params;
  const { enviado } = await searchParams;
  const user = await requireUser(`/pedidos/${id}`);
  const b = await db.booking.findUnique({
    where: { id },
    include: {
      pro: { include: { user: { select: { id: true, name: true } }, services: { select: { id: true, photoKey: true }, orderBy: { createdAt: "asc" } } } },
      client: { select: { id: true, name: true } },
      history: { orderBy: { createdAt: "asc" }, include: { by: { select: { name: true, role: true } } } },
      reviews: true,
      _count: { select: { offers: true } },
    },
  });
  if (!b) notFound();
  const as = roleIn(b, user);
  if (!as) notFound();
  const isClient = as === "CLIENT";
  const isPro = as === "PRO";
  const pro = b.pro;
  const quick = b.mode === "QUICK";
  const cat = category(b.category);
  const shopping = needsShoppingList(b.category);
  const contact = b.contactSealed ? openSecret(b.contactSealed) : null;
  const showAddress = !b.addressPurgedAt && (isClient || as === "ADMIN" || (isPro && proSeesAddress(b)));
  const chat = chatOpen(b);
  // conversa entre os dois (uma só, antes e depois de contratar)
  const conversation = b.proId && as !== "ADMIN" ? await conversationWith(b.clientId, b.proId) : null;
  const myReview = b.reviews.find((r) => r.authorId === user.id);
  const otherReview = b.reviews.find((r) => r.authorId !== user.id);
  const steps = nextSteps(b.status, as, b.mode);
  const clientRating = isPro || as === "ADMIN" ? await db.review.aggregate({ where: { targetId: b.clientId, hiddenAt: null }, _avg: { stars: true }, _count: true }) : null;
  const otherUserId = isClient ? pro?.userId : b.clientId;
  const blocked = as !== "ADMIN" && otherUserId ? await db.block.findUnique({ where: { blockerId_blockedId: { blockerId: user.id, blockedId: otherUserId } } }) : null;
  const point = b.lat != null && b.lng != null ? { lat: b.lat, lng: b.lng } : null;
  const fullAddress = [b.addrStreet, b.addrNumber, b.addrComplement, b.addrDistrict, `${b.addrCity}/${b.addrUf}`, b.addrCep ? `CEP ${b.addrCep.replace(/(\d{5})(\d{3})/, "$1-$2")}` : null].filter(Boolean).join(", ");
  const mapsUrl = point ? `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const otherName = isPro ? (b.acceptedAt ? b.client.name.split(" ")[0] : shortName(b.client.name)) : pro ? shortName(pro.user.name) : "prestador";
  const waitedMin = b.arrivedAt ? (Date.now() - b.arrivedAt.getTime()) / 60_000 : 0;
  const value = b.finalCents ?? b.estimateCents;
  const arriving = quick && b.arriveBy && (b.status === "ACCEPTED" || b.status === "ON_THE_WAY");

  return (
    <div className="space-y-4">
      <Link href="/pedidos" className="text-sm text-muted hover:text-foreground">← Pedidos</Link>
      {(b.status === "SEARCHING" || arriving || b.status === "WAITING_PRO") && <AutoRefresh every={b.status === "SEARCHING" ? 3000 : 15000} />}

      {b.status === "SEARCHING" && isClient && (
        <Card className="space-y-2 text-center">
          <Radar label={cat?.emoji ?? "⚡"} />
          <p className="text-lg font-bold">Procurando {cat?.label.toLowerCase() ?? "prestador"} perto de você…</p>
          <p className="text-sm text-muted">Estamos chamando quem está perto e disponível agora, pelo valor fixo de {formatBRL(b.estimateCents ?? 0)}. O primeiro que aceitar leva.</p>
          {b._count.offers > 0 && <p className="text-xs text-muted">{b._count.offers} prestador(es) chamado(s) até agora</p>}
          <ActionButton action={cancelSearchAction.bind(null, b.id)} variant="outline" confirm="Cancelar o chamado?">Cancelar chamado</ActionButton>
        </Card>
      )}
      {b.status === "NO_PROVIDER" && isClient && (
        <Card className="space-y-2 border-warning/50 bg-warning/10">
          <p className="font-semibold">Ninguém aceitou desta vez 😕</p>
          <p className="text-sm">Tente de novo daqui a pouco, ou procure na lista e marque um horário.</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/rapido?servico=${b.category}`} className={buttonClass("primary")}><Zap size={16} /> Chamar de novo</Link>
            <Link href={`/buscar?servico=${b.category}`} className={buttonClass("outline")}>Ver prestadores</Link>
          </div>
        </Card>
      )}
      {b.status === "NO_SHOW_CLIENT" && isClient && (
        <Card className="space-y-2 border-danger/40 bg-danger/5">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={18} className="text-danger" /> O prestador foi e você não estava</p>
          <p className="text-sm">Sua conta ficou 30 dias sem contratar. Você pode pagar R$ 2,85 para liberar agora.</p>
          <Link href="/desbloquear" className={buttonClass("primary")}>Liberar minha conta</Link>
        </Card>
      )}
      {enviado && b.status === "WAITING_PRO" && (
        <Card className="flex gap-3 border-success/40 bg-success/5">
          <CheckCircle2 className="shrink-0 text-success" />
          <p className="text-sm">Pedido enviado! O prestador vai aceitar ou recusar. Avisamos você por aqui.</p>
        </Card>
      )}

      {(b.status === "ACCEPTED" || b.status === "ON_THE_WAY") && (isPro || isClient) && b.lat != null && (
        <Card className="flex items-center gap-3 py-3">
          <MapPin className="shrink-0 text-primary" />
          <LiveDistance bookingId={b.id} as={isPro ? "PRO" : "CLIENT"} />
        </Card>
      )}

      {arriving && (
        <Card className="flex items-center gap-3 border-primary/40 bg-primary/5">
          <Timer className="shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">{isPro ? "Você tem para chegar:" : "Chega em até:"} <Countdown to={b.arriveBy!.toISOString()} done="tempo esgotado" /></p>
            <p className="text-muted">{isPro ? `Se não chegar em ${ARRIVE_HOURS} horas, o chamado é cancelado e você fica 7 dias fora do Contrate rápido.` : `Se não chegar em ${ARRIVE_HOURS} horas, o chamado é cancelado automaticamente.`}</p>
          </div>
        </Card>
      )}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {pro ? (
            <div className="flex items-center gap-3">
              {isPro ? <ProPhoto url={null} name={b.client.name} size={56} /> : <ProPhoto url={accountPhotoUrl(pro)} name={pro.user.name} size={56} />}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">{isPro ? "Cliente" : "Prestador"}</p>
                {isPro ? <p className="font-semibold">{otherName}</p> : <Link href={`/prestador/${pro.id}`} className="font-semibold hover:underline">{shortName(pro.user.name)}</Link>}
                {isPro && clientRating && clientRating._count > 0 ? (
                  <Rating value={Math.round((clientRating._avg.stars ?? 0) * 10) / 10} count={clientRating._count} />
                ) : !isPro ? (
                  <Rating value={ratingOf(pro)} count={pro.ratingCount} />
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">{quick ? "⚡ Contrate rápido" : "Pedido"}</p>
          )}
          <BookingBadge status={b.status} />
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <CalendarClock size={18} className="shrink-0 text-primary" />
            <div>
              <dt className="text-muted">{cat?.emoji} {cat?.label ?? b.category}</dt>
              <dd className="font-medium">{quick ? "Agora (Contrate rápido)" : formatWhen(b.scheduledAt, b.addrUf)} · {qtyLong(b.unit, b.quantity)}</dd>
            </div>
          </div>
          <div className="flex gap-2">
            <Wallet size={18} className="shrink-0 text-primary" />
            <div>
              <dt className="text-muted">{b.finalCents != null ? "Valor final" : value != null ? "Valor combinado" : "Valor"}</dt>
              <dd className="font-medium">
                {formatBRL(value ?? b.maxCents ?? 0)}
                {b.unitPriceCents != null && b.finalCents == null && <span className="font-normal text-muted"> ({formatBRL(b.unitPriceCents)} {UNIT_LABEL[b.unit].per})</span>}
              </dd>
              <dd className="text-xs text-muted">Pago direto ao prestador{b.payMethod ? ` em ${PAY[b.payMethod] ?? b.payMethod}` : " (Pix, dinheiro ou cartão se ele tiver maquininha)"}. O Diária Paga não cobra nada do cliente.</dd>
            </div>
          </div>
        </dl>
        {b.notes && <p className="whitespace-pre-line rounded-lg bg-surface-2 p-3 text-sm">{shopping ? "Lista de compras" : "Observações"}: {b.notes}</p>}
        {shopping && (
          <div className="space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold"><ShoppingCart size={16} className="text-primary" /> Compras no supermercado</p>
            {contact && (isClient || as === "ADMIN" || (isPro && proSeesAddress(b))) ? (
              <p>
                Telefone {isPro ? "do cliente" : "informado"} para o Pix das compras:{" "}
                <a href={whatsappLink(contact)} target="_blank" rel="noreferrer nofollow" className="font-semibold text-primary underline">{whatsappLabel(contact)}</a>
              </p>
            ) : isPro && contact ? (
              <p className="text-muted">O telefone do cliente para o Pix aparece depois que você aceitar.</p>
            ) : null}
            <p className="text-xs text-muted">{SHOPPING_RULE}</p>
          </div>
        )}
        {b.status === "WAITING_PRO" && b.expiresAt && (
          <p className="flex items-center gap-2 text-sm text-muted"><Info size={16} /> {isPro ? "Responda até" : "O prestador tem até"} {b.expiresAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" })}{isPro ? "." : " para responder."}</p>
        )}
        {b.cancelReason && <p className="text-sm text-muted">Motivo: {b.cancelReason}</p>}
        {b.status !== "SEARCHING" && (
          <StatusActions steps={steps} action={changeStatusAction.bind(null, b.id)} adminLabels={as === "ADMIN"} finalDefault={isPro && value != null ? (value / 100).toFixed(2).replace(".", ",") : undefined} />
        )}
        {isPro && quick && b.status === "ARRIVED" && (
          <div className="rounded-lg border border-border p-3 text-sm">
            <p className="font-medium">O cliente não está no endereço?</p>
            <p className="text-muted">Tente o chat primeiro. Depois de {CLIENT_NOSHOW_WAIT_MIN} minutos no local você pode registrar.</p>
            <div className="mt-2">
              {waitedMin >= CLIENT_NOSHOW_WAIT_MIN ? (
                <ActionButton action={clientNoShowAction.bind(null, b.id)} variant="outline" className="text-danger" confirm="Confirmar que o cliente não estava no endereço?">Cliente não estava</ActionButton>
              ) : (
                <p className="text-xs text-muted">Liberado em <Countdown to={new Date(b.arrivedAt!.getTime() + CLIENT_NOSHOW_WAIT_MIN * 60_000).toISOString()} done="agora — atualize a tela" /></p>
              )}
            </div>
          </div>
        )}
        {(b.status === "REFUSED" || b.status === "EXPIRED") && isClient && <Link href={`/buscar?servico=${b.category}`} className={buttonClass("primary")}>Escolher outro prestador</Link>}
      </Card>

      {b.status === "PROPOSED" && isClient && (
        <Card className="space-y-3 border-2 border-primary">
          <CardTitle>📅 Confirmar agendamento</CardTitle>
          <p className="text-sm text-muted">{otherName} reservou este horário para você. Informe o endereço para confirmar. Se não der, cancele.</p>
          <ConfirmSchedule bookingId={b.id} saved={await savedAddresses(user.id)} ufs={UFS} payMethods={b.pro?.payMethods ?? []} shopping={needsShoppingList(b.category)} />
        </Card>
      )}

      {b.status !== "PROPOSED" && <Card className="space-y-3">
        <CardTitle className="flex items-center gap-2"><MapPin size={18} /> Endereço</CardTitle>
        {showAddress ? (
          <>
            <p className="text-sm">{fullAddress}</p>
            {b.addrReference && <p className="text-sm text-muted">Referência: {b.addrReference}</p>}
            {point && <MapPicker value={point} height={220} />}
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={buttonClass("outline", "sm")}><ExternalLink size={14} /> Abrir rota no Google Maps</a>
          </>
        ) : b.addressPurgedAt ? (
          <p className="text-sm text-muted">Endereço apagado por privacidade. Cidade: {b.addrCity}/{b.addrUf}.</p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted"><Lock size={16} /> {b.addrDistrict ? `${b.addrDistrict}, ` : ""}{b.addrCity}/{b.addrUf}. O endereço completo aparece depois que você aceitar.</p>
        )}
      </Card>}

      {conversation && as !== "ADMIN" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Conversa com {otherName}</h2>
            <Link href={`/mensagens/${conversation.id}`} className="text-sm text-primary">Abrir em tela cheia</Link>
          </div>
          <ChatBox conversationId={conversation.id} otherName={otherName} initialWrite={!blocked} height="h-[45vh] max-h-[420px]" scheduleAction={isPro ? proposeScheduleAction.bind(null, conversation.id) : undefined} />
        </div>
      ) : chat.read && as === "ADMIN" ? (
        <Card className="space-y-2 text-sm">
          <CardTitle>Conversa</CardTitle>
          <p className="text-muted">Por privacidade, o admin só abre a conversa quando há denúncia ou pedido de suporte.</p>
          <Link href={`/admin/conversa/${b.id}`} className={buttonClass("outline", "sm")}>Abrir conversa (fica registrado)</Link>
        </Card>
      ) : b.status === "SEARCHING" || b.status === "WAITING_PRO" ? (
        <Card className="text-sm text-muted">O chat abre quando o prestador aceitar.</Card>
      ) : null}

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
                {h.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" })} · {h.by ? (h.by.role === "ADMIN" ? "Suporte Diária Paga" : h.by.name.split(" ")[0]) : "Automático"}
                {h.reason ? ` · ${h.reason}` : ""}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      {as !== "ADMIN" && otherUserId && (
        <div className="flex flex-wrap items-start gap-2">
          <Link href={`/suporte/novo?pedido=${b.id}`} className={buttonClass("ghost", "sm", "text-muted")}><LifeBuoy size={14} /> Pedir ajuda ao suporte</Link>
          <ReportButton action={report} reasons={REPORT_REASONS} targetId={otherUserId} bookingId={b.id} label={isClient ? "Denunciar prestador" : "Denunciar cliente"} />
          <form action={toggleBlock.bind(null, otherUserId)}>
            <button type="submit" className={buttonClass("ghost", "sm", "text-muted")}>{blocked ? "Desbloquear" : "Bloquear"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
