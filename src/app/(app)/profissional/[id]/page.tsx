import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, Heart, MapPin, ShieldCheck } from "lucide-react";
import { PageTitle, ProPhoto, Rating, Stars } from "@/components/bits";
import { ReportButton } from "@/components/report-dialog";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { REPORT_REASONS, WEEKDAYS, formatBRL, minutesToHHMM, proVisible, ratingOf, serviceLabel, shortName } from "@/lib/domain";
import { proPhotoUrl } from "@/lib/pros";
import { getCurrentUser } from "@/lib/session";
import { report, toggleBlock, toggleFavorite } from "../../social-actions";

export const metadata: Metadata = { title: "Perfil do profissional" };

export default async function ProPublicPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ uf?: string; cidade?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await getCurrentUser();
  const pro = await db.professionalProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, blockedAt: true } },
      areas: { orderBy: { city: "asc" } },
      availability: { orderBy: [{ weekday: "asc" }, { startMin: "asc" }] },
      subscription: true,
    },
  });
  if (!pro) notFound();
  const visible = proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt });
  const isOwner = user?.id === pro.userId;
  if (!visible && !isOwner && user?.role !== "ADMIN") notFound();

  const [reviews, fav, blocked] = await Promise.all([
    db.review.findMany({ where: { targetId: pro.userId, hiddenAt: null }, orderBy: { createdAt: "desc" }, take: 20, include: { author: { select: { name: true } } } }),
    user?.role === "CLIENT" ? db.favorite.findUnique({ where: { clientId_proId: { clientId: user.id, proId: pro.id } } }) : null,
    user?.role === "CLIENT" ? db.block.findUnique({ where: { blockerId_blockedId: { blockerId: user.id, blockedId: pro.userId } } }) : null,
  ]);
  const query = sp.uf && sp.cidade ? `?uf=${sp.uf}&cidade=${encodeURIComponent(sp.cidade)}` : "";
  const requestHref = `/solicitar/${pro.id}${query}`;

  return (
    <div className="space-y-5">
      {sp.uf && sp.cidade && <Link href={`/buscar?uf=${sp.uf}&cidade=${encodeURIComponent(sp.cidade)}`} className="text-sm text-muted hover:text-foreground">← Voltar para a busca</Link>}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ProPhoto url={proPhotoUrl(pro)} name={pro.user.name} size={112} className="self-center sm:self-auto" />
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <PageTitle title={shortName(pro.user.name)} />
          <div className="-mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm sm:justify-start">
            <Rating value={ratingOf(pro)} count={pro.ratingCount} />
            {pro.completedCount > 0 && <span className="flex items-center gap-1 text-muted"><CheckCircle2 size={14} /> {pro.completedCount} serviços concluídos</span>}
            <span className="flex items-center gap-1 text-muted"><ShieldCheck size={14} className="text-accent" /> Verificado</span>
          </div>
          <p className="flex items-center justify-center gap-1 text-sm text-muted sm:justify-start"><MapPin size={14} /> {pro.areas.map((a) => `${a.city}/${a.uf}`).join(", ")}</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-3xl font-extrabold text-brand-ink">{pro.hourlyCents ? formatBRL(pro.hourlyCents) : "—"}</p>
          <p className="text-sm text-muted">por hora</p>
        </div>
      </Card>

      {!isOwner && user?.role !== "ADMIN" && user?.role !== "PRO" && (
        <div className="flex flex-wrap gap-2">
          {blocked ? (
            <p className="text-sm text-muted">Você bloqueou este profissional.</p>
          ) : (
            <Link href={user ? requestHref : `/entrar?voltar=${encodeURIComponent(requestHref)}`} className={buttonClass("primary", "lg", "flex-1 sm:flex-none")}>
              Solicitar limpeza
            </Link>
          )}
          {user?.role === "CLIENT" && (
            <form action={toggleFavorite.bind(null, pro.id)}>
              <Button type="submit" variant="outline" size="lg" aria-pressed={!!fav}>
                <Heart size={18} className={fav ? "fill-danger text-danger" : ""} /> {fav ? "Favorito" : "Favoritar"}
              </Button>
            </form>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <CardTitle>Serviços</CardTitle>
          <ul className="flex flex-wrap gap-2">
            {pro.services.map((s) => <li key={s} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">{serviceLabel(s)}</li>)}
          </ul>
          {pro.bio && <p className="whitespace-pre-line text-sm">{pro.bio}</p>}
        </Card>
        <Card className="space-y-3">
          <CardTitle className="flex items-center gap-2"><CalendarClock size={18} /> Horários de atendimento</CardTitle>
          {pro.availability.length ? (
            <ul className="space-y-1 text-sm">
              {pro.availability.map((a) => (
                <li key={a.id} className="flex justify-between"><span>{WEEKDAYS[a.weekday]}</span><span className="text-muted">{minutesToHHMM(a.startMin)} às {minutesToHHMM(a.endMin)}</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Horário a combinar: o profissional confirma ao aceitar.</p>
          )}
        </Card>
      </div>

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
          <p className="text-sm text-muted">Ainda sem avaliações. Perfis novos ganham a chance de mostrar o seu trabalho!</p>
        )}
      </Card>

      {user && !isOwner && user.role === "CLIENT" && (
        <div className="flex flex-wrap items-start gap-2">
          <ReportButton action={report} reasons={REPORT_REASONS} targetId={pro.userId} label="Denunciar perfil" />
          <form action={toggleBlock.bind(null, pro.userId)}>
            <Button type="submit" variant="ghost" size="sm" className="text-muted">{blocked ? "Desbloquear" : "Bloquear profissional"}</Button>
          </form>
        </div>
      )}
    </div>
  );
}
