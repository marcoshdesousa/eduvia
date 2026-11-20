import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageTitle, ProPhoto } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { WEEKDAYS, category, minutesToHHMM, providerVisible, shortName } from "@/lib/domain";
import { UFS } from "@/lib/places";
import { providerPhotoUrl } from "@/lib/providers";
import { savedAddresses } from "@/lib/saved-addresses";
import { requireUser } from "@/lib/session";
import { clientBlock } from "@/lib/subscription";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = { title: "Contratar" };

export default async function HirePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ servico?: string }> }) {
  const { id } = await params;
  const { servico = "" } = await searchParams;
  const user = await requireUser(`/contratar/${id}`);
  const pro = await db.providerProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true, blockedAt: true } }, services: { orderBy: { priceCents: "asc" } }, availability: { orderBy: [{ weekday: "asc" }, { startMin: "asc" }] }, subscription: true, places: { where: { active: true } } },
  });
  if (!pro || !providerVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt, services: pro.services.length, places: pro.places.length })) notFound();
  if (pro.userId === user.id) redirect("/painel");
  const block = await clientBlock(user.cpfHash);
  const agenda = pro.availability.map((r) => `${WEEKDAYS[r.weekday].slice(0, 3)} ${minutesToHHMM(r.startMin)}–${minutesToHHMM(r.endMin)}`);
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href={`/prestador/${pro.id}`} className="text-sm text-muted hover:text-foreground">← Perfil</Link>
      <div className="flex items-center gap-3">
        <ProPhoto url={providerPhotoUrl(pro)} name={pro.user.name} size={56} />
        <PageTitle title={`Contratar ${shortName(pro.user.name)}`} subtitle="Marque o dia. O prestador aceita ou recusa, e vocês conversam pelo chat." />
      </div>
      {block ? (
        <Card className="space-y-2 border-danger/40 bg-danger/5">
          <p className="font-semibold">Sua conta está sem contratar até {block.until.toLocaleDateString("pt-BR")}</p>
          <Link href="/desbloquear" className={buttonClass("primary")}>Liberar agora por R$ 2,85</Link>
        </Card>
      ) : (
        <BookingForm
          proId={pro.id}
          initial={servico}
          agenda={agenda}
          saved={await savedAddresses(user.id)}
          ufs={UFS}
          services={pro.services.map((s) => ({ category: s.category, label: category(s.category)?.label ?? s.category, emoji: category(s.category)?.emoji ?? "🛠️", priceCents: s.priceCents, unit: s.unit, description: s.description }))}
        />
      )}
    </div>
  );
}
