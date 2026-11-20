import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtSign, CalendarClock, Music2, Phone, SquarePlay, CheckCircle2, CreditCard, Globe, Heart, MapPin, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { PageTitle, ProPhoto, Rating, RecommendedBadge, Stars } from "@/components/bits";
import { ReportButton } from "@/components/report-dialog";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { PAY_METHODS, POSTS_PREVIEW, REPORT_REASONS, DIARIA_HOURS, UNIT_LABEL, WEEKDAYS, category, formatBRL, whatsappLabel, whatsappLink, youtubeLink, isPayMethod, minutesToHHMM, providerVisible, ratingOf, shortName } from "@/lib/domain";
import { postImageUrl, profilePhotoUrl } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { startConversationAction } from "../../mensagens/actions";
import { report, toggleBlock, toggleFavorite } from "../../social-actions";
import { Gallery } from "./gallery";

export const metadata: Metadata = { title: "Perfil do prestador" };

/** Perfil público: o trabalhador pode ter um perfil por profissão (abas no topo). */
export default async function ProviderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ perfil?: string; agenda?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await getCurrentUser();
  const pro = await db.providerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, blockedAt: true } },
      services: { orderBy: { createdAt: "asc" }, include: { posts: { orderBy: { createdAt: "desc" } } } },
      places: { where: { active: true }, orderBy: { createdAt: "asc" } },
      availability: { orderBy: [{ weekday: "asc" }, { startMin: "asc" }] },
      subscription: true,
    },
  });
  if (!pro) notFound();
  const isOwner = user?.id === pro.userId;
  const profiles = isOwner ? pro.services : pro.services.filter((s) => s.photoKey);
  const visible = providerVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt, services: pro.services.filter((s) => s.photoKey).length, places: pro.places.length });
  if ((!visible || !profiles.length) && !isOwner && user?.role !== "ADMIN") notFound();
  const cur = profiles.find((s) => s.category === sp.perfil) ?? profiles[0];
  const c = cur ? category(cur.category) : null;
  const full = pro.subscription?.plan === "FULL";
  const quickNow = visible && full && !!pro.quickTermsAt && pro.quickOn && !(pro.quickBannedUntil && pro.quickBannedUntil > new Date());

  const [reviews, fav, blocked] = await Promise.all([
    db.review.findMany({ where: { targetId: pro.userId, hiddenAt: null, booking: { proId: pro.id } }, orderBy: { createdAt: "desc" }, take: 20, include: { author: { select: { name: true } }, booking: { select: { category: true } } } }),
    user && !isOwner ? db.favorite.findUnique({ where: { clientId_proId: { clientId: user.id, proId: pro.id } } }) : null,
    user && !isOwner ? db.block.findUnique({ where: { blockerId_blockedId: { blockerId: user.id, blockedId: pro.userId } } }) : null,
  ]);
  const hireHref = `/contratar/${pro.id}${cur ? `?servico=${cur.category}` : ""}`;
  const cities = [...new Set(pro.places.map((p) => `${p.district ? `${p.district}, ` : ""}${p.city}/${p.uf}`))];
  const canHire = !isOwner && user?.role !== "ADMIN";
  const pays = pro.payMethods.filter(isPayMethod).map((m) => PAY_METHODS[m]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {!visible && <Card className="border-warning/50 bg-warning/10 text-sm">Este perfil não está aparecendo na busca agora (plano vencido, pausado ou incompleto).</Card>}
      {sp.agenda === "conversa" && <Card className="border-primary/40 bg-primary/5 text-sm">Este prestador agenda pela conversa. Mande uma mensagem para combinar o dia.</Card>}

      {profiles.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Profissões">
          {profiles.map((s) => {
            const sc = category(s.category);
            const on = s.id === cur?.id;
            return (
              <Link key={s.id} href={`/prestador/${pro.id}?perfil=${s.category}`} role="tab" aria-selected={on} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-2 py-1 pr-3 text-sm", on ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border bg-surface text-muted")}>
                <ProPhoto url={profilePhotoUrl(s)} name={sc?.label ?? s.category} size={28} />
                {sc?.label}
              </Link>
            );
          })}
        </div>
      )}

      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <ProPhoto url={cur ? profilePhotoUrl(cur) : null} name={pro.user.name} size={96} />
          <div className="min-w-0 flex-1 space-y-1">
            <PageTitle title={shortName(pro.user.name)} />
            <p className="-mt-3 text-sm font-semibold text-primary">{c?.emoji} {c?.label}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <Rating value={ratingOf(pro)} count={pro.ratingCount} />
              {full && <RecommendedBadge />}
              {quickNow && <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"><Zap size={12} /> Disponível agora</span>}
            </div>
            <div className="flex flex-wrap gap-x-3 text-xs text-muted">
              {pro.completedCount > 0 && <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {pro.completedCount} serviços</span>}
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-primary" /> CPF verificado</span>
            </div>
          </div>
        </div>

        {cur && (
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-2xl font-extrabold">{formatBRL(cur.priceCents)} <span className="text-sm font-medium text-muted">/ {UNIT_LABEL[cur.unit].one}</span></p>
            {cur.hourCents ? <p className="text-lg font-bold">{formatBRL(cur.hourCents)} <span className="text-sm font-medium text-muted">/ hora (de 1 a {DIARIA_HOURS} horas)</span></p> : null}
            {cur.unit === "DIARIA" && <p className="text-xs text-muted">Diária de até {DIARIA_HOURS} horas. Dá para contratar várias diárias seguidas.</p>}
            {cur.description && <p className="mt-1 whitespace-pre-line text-sm">{cur.description}</p>}
          </div>
        )}
        {cur?.bio && <p className="whitespace-pre-line text-sm">{cur.bio}</p>}
        {cur?.whatsapp && (
          <a href={whatsappLink(cur.whatsapp)} target="_blank" rel="noreferrer nofollow" className={cn(buttonClass("outline"), "w-full border-[#25D366] text-[#128C7E]")}>
            <Phone size={16} /> WhatsApp {whatsappLabel(cur.whatsapp)}
          </a>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1"><MapPin size={14} /> {cities.join(" · ") || "—"}</span>
          {cur?.instagram && <a href={`https://instagram.com/${cur.instagram}`} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-1 text-primary hover:underline"><AtSign size={14} /> Instagram @{cur.instagram}</a>}
          {cur?.tiktok && <a href={`https://www.tiktok.com/@${cur.tiktok}`} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-1 text-primary hover:underline"><Music2 size={14} /> TikTok @{cur.tiktok}</a>}
          {cur?.youtube && <a href={youtubeLink(cur.youtube)} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-1 text-primary hover:underline"><SquarePlay size={14} /> YouTube{cur.youtube.startsWith("@") ? ` ${cur.youtube}` : ""}</a>}
          {cur?.website && <a href={cur.website} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-1 text-primary hover:underline"><Globe size={14} /> {new URL(cur.website).hostname.replace(/^www\./, "")}</a>}
        </div>
        {pays.length > 0 && <p className="flex items-center gap-1 text-sm text-muted"><CreditCard size={14} /> Aceita: {pays.join(", ")}</p>}

        {canHire && (
          <div className="flex flex-wrap gap-2">
            {blocked ? (
              <p className="text-sm text-muted">Você bloqueou este prestador.</p>
            ) : (
              <>
                {pro.directBooking && <Link href={user ? hireHref : `/entrar?voltar=${encodeURIComponent(hireHref)}`} className={buttonClass("primary", "lg", "flex-1")}>Contratar</Link>}
                {user ? (
                  <form action={startConversationAction.bind(null, pro.id)} className={pro.directBooking ? "" : "flex-1"}>
                    <Button type="submit" size="lg" variant={pro.directBooking ? "outline" : "primary"} className="w-full"><MessageCircle size={18} /> {pro.directBooking ? "Mensagem" : "Mandar mensagem para agendar"}</Button>
                  </form>
                ) : (
                  <Link href={`/entrar?voltar=${encodeURIComponent(`/prestador/${pro.id}`)}`} className={buttonClass("outline", "lg")}><MessageCircle size={18} /> Mensagem</Link>
                )}
              </>
            )}
            {user && (
              <form action={toggleFavorite.bind(null, pro.id)}>
                <Button type="submit" variant="outline" size="lg" aria-pressed={!!fav} aria-label={fav ? "Tirar dos favoritos" : "Favoritar"}><Heart size={18} className={fav ? "fill-danger text-danger" : ""} /></Button>
              </form>
            )}
          </div>
        )}
        {isOwner && <Link href={`/painel/perfil${cur ? `?p=${cur.id}` : ""}`} className={buttonClass("outline", "md", "w-full")}>Editar este perfil</Link>}
      </Card>

      {cur && cur.posts.length > 0 && (
        <Card className="space-y-3">
          <CardTitle>Trabalhos</CardTitle>
          <Gallery items={cur.posts.map((p) => ({ id: p.id, url: postImageUrl(p), caption: p.caption }))} preview={POSTS_PREVIEW} />
          {user && !isOwner && <ReportButton action={report} reasons={REPORT_REASONS} targetId={pro.userId} postId={cur.posts[0].id} label="Denunciar fotos" small />}
        </Card>
      )}

      <Card className="space-y-3">
        <CardTitle className="flex items-center gap-2"><CalendarClock size={18} /> Horários</CardTitle>
        <ul className="space-y-1 text-sm">
          {pro.availability.map((a) => (
            <li key={a.id} className="flex justify-between"><span>{WEEKDAYS[a.weekday]}</span><span className="text-muted">{minutesToHHMM(a.startMin)} às {minutesToHHMM(a.endMin)}</span></li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Avaliações</CardTitle>
        {reviews.length ? (
          <ul className="divide-y divide-border">
            {reviews.map((r) => (
              <li key={r.id} className="space-y-1 py-3">
                <div className="flex items-center justify-between gap-2">
                  <Stars value={r.stars} />
                  <span className="text-xs text-muted">{r.createdAt.toLocaleDateString("pt-BR")}</span>
                </div>
                {r.comment && <p className="text-sm">{r.comment}</p>}
                <p className="text-xs text-muted">{r.author.name.split(" ")[0]} · {category(r.booking.category)?.label}</p>
                {user && user.id !== r.authorId && <ReportButton action={report} reasons={REPORT_REASONS} targetId={r.authorId} reviewId={r.id} label="Denunciar avaliação" small />}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Ainda sem avaliações. Perfis novos merecem uma chance!</p>
        )}
      </Card>

      {user && !isOwner && (
        <div className="flex flex-wrap items-start gap-2">
          <ReportButton action={report} reasons={REPORT_REASONS} targetId={pro.userId} label="Denunciar perfil" />
          <form action={toggleBlock.bind(null, pro.userId)}>
            <Button type="submit" variant="ghost" size="sm" className="text-muted">{blocked ? "Desbloquear" : "Bloquear prestador"}</Button>
          </form>
        </div>
      )}
    </div>
  );
}
