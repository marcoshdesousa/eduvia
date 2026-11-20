import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, AtSign, Heart, MapPin, ShieldCheck, Zap } from "lucide-react";
import { PageTitle, ProPhoto, Rating, RecommendedBadge, Stars } from "@/components/bits";
import { ReportButton } from "@/components/report-dialog";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { POSTS_PREVIEW, REPORT_REASONS, UNIT_LABEL, WEEKDAYS, category, formatBRL, minutesToHHMM, providerVisible, ratingOf, shortName } from "@/lib/domain";
import { postImageUrl, providerPhotoUrl } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { report, toggleBlock, toggleFavorite } from "../../social-actions";
import { Gallery } from "./gallery";

export const metadata: Metadata = { title: "Perfil do prestador" };

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const pro = await db.providerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, blockedAt: true, createdAt: true } },
      services: { orderBy: { priceCents: "asc" } },
      places: { where: { active: true }, orderBy: { createdAt: "asc" } },
      availability: { orderBy: [{ weekday: "asc" }, { startMin: "asc" }] },
      posts: { orderBy: { createdAt: "desc" } },
      subscription: true,
    },
  });
  if (!pro) notFound();
  const visible = providerVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt, services: pro.services.length, places: pro.places.length });
  const isOwner = user?.id === pro.userId;
  if (!visible && !isOwner && user?.role !== "ADMIN") notFound();
  const full = pro.subscription?.plan === "FULL";
  const quickNow = visible && pro.quickOn && !(pro.quickBannedUntil && pro.quickBannedUntil > new Date());

  const [reviews, fav, blocked] = await Promise.all([
    db.review.findMany({ where: { targetId: pro.userId, hiddenAt: null, booking: { proId: pro.id } }, orderBy: { createdAt: "desc" }, take: 20, include: { author: { select: { name: true } } } }),
    user && !isOwner ? db.favorite.findUnique({ where: { clientId_proId: { clientId: user.id, proId: pro.id } } }) : null,
    user && !isOwner ? db.block.findUnique({ where: { blockerId_blockedId: { blockerId: user.id, blockedId: pro.userId } } }) : null,
  ]);
  const hireHref = `/contratar/${pro.id}`;
  const cities = [...new Set(pro.places.map((p) => `${p.district ? `${p.district}, ` : ""}${p.city}/${p.uf}`))];
  const canHire = !isOwner && user?.role !== "ADMIN";

  return (
    <div className="space-y-4">
      {!visible && <Card className="border-warning/50 bg-warning/10 text-sm">Este perfil não está aparecendo na busca agora (plano vencido, pausado ou incompleto).</Card>}
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <ProPhoto url={providerPhotoUrl(pro)} name={pro.user.name} size={96} />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <PageTitle title={shortName(pro.user.name)} />
            </div>
            <div className="-mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
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
        {pro.bio && <p className="whitespace-pre-line text-sm">{pro.bio}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1"><MapPin size={14} /> {cities.join(" · ")}</span>
          {pro.instagram && (
            <a href={`https://instagram.com/${pro.instagram}`} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-1 text-primary hover:underline"><AtSign size={14} /> Instagram @{pro.instagram}</a>
          )}
        </div>
        {canHire && (
          <div className="flex gap-2">
            {blocked ? (
              <p className="text-sm text-muted">Você bloqueou este prestador.</p>
            ) : (
              <Link href={user ? hireHref : `/entrar?voltar=${encodeURIComponent(hireHref)}`} className={buttonClass("primary", "lg", "flex-1")}>Contratar</Link>
            )}
            {user && (
              <form action={toggleFavorite.bind(null, pro.id)}>
                <Button type="submit" variant="outline" size="lg" aria-pressed={!!fav} aria-label={fav ? "Tirar dos favoritos" : "Favoritar"}>
                  <Heart size={18} className={fav ? "fill-danger text-danger" : ""} />
                </Button>
              </form>
            )}
          </div>
        )}
        {isOwner && <Link href="/painel/perfil" className={buttonClass("outline", "md", "w-full")}>Editar meu perfil</Link>}
      </Card>

      <Card className="space-y-3">
        <CardTitle>Serviços e preços</CardTitle>
        <ul className="divide-y divide-border">
          {pro.services.map((s) => {
            const c = category(s.category);
            return (
              <li key={s.id} className="flex items-start gap-3 py-3">
                <span className="text-2xl">{c?.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c?.label ?? s.category}</p>
                  {s.description && <p className="whitespace-pre-line text-sm text-muted">{s.description}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatBRL(s.priceCents)}</p>
                  <p className="text-xs text-muted">{UNIT_LABEL[s.unit].per}</p>
                  {canHire && !blocked && <Link href={`${hireHref}?servico=${s.category}`} className="text-xs text-primary hover:underline">Contratar</Link>}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted">O cliente paga direto ao prestador (Pix, dinheiro ou cartão se ele tiver maquininha). Para o cliente, o Diária Paga é grátis.</p>
      </Card>

      {pro.posts.length > 0 && (
        <Card className="space-y-3">
          <CardTitle>Trabalhos</CardTitle>
          <Gallery items={pro.posts.map((p) => ({ id: p.id, url: postImageUrl(p), caption: p.caption }))} preview={POSTS_PREVIEW} />
          {user && !isOwner && <ReportButton action={report} reasons={REPORT_REASONS} targetId={pro.userId} postId={pro.posts[0].id} label="Denunciar fotos" small />}
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
                <p className="text-xs text-muted">{r.author.name.split(" ")[0]}</p>
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
