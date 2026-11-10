import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTitle, ProPhoto, Rating } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { WEEKDAYS, formatBRL, minutesToHHMM, proVisible, ratingOf, serviceLabel, shortName } from "@/lib/domain";
import { UFS } from "@/lib/places";
import { proPhotoUrl } from "@/lib/pros";
import { requireClient } from "@/lib/session";
import { RequestForm } from "./request-form";

export const metadata: Metadata = { title: "Solicitar limpeza" };

export default async function RequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ uf?: string; cidade?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requireClient(`/solicitar/${id}`);
  const pro = await db.professionalProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true, blockedAt: true } }, areas: true, availability: { orderBy: [{ weekday: "asc" }, { startMin: "asc" }] }, subscription: true },
  });
  if (!pro || !proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt })) notFound();
  const addresses = await db.address.findMany({ where: { clientId: user.id }, orderBy: { lastUsedAt: "desc" }, take: 5 });
  const area = pro.areas.find((a) => a.uf === sp.uf && a.city === sp.cidade) ?? pro.areas[0];
  return (
    <div className="space-y-5">
      <PageTitle title="Solicitar limpeza" subtitle="Nada é cobrado de você pela HoraLimp. O pedido só vira contratação quando o profissional aceitar." />
      <Card className="flex items-center gap-3">
        <ProPhoto url={proPhotoUrl(pro)} name={pro.user.name} size={56} />
        <div className="flex-1">
          <p className="font-semibold">{shortName(pro.user.name)}</p>
          <Rating value={ratingOf(pro)} count={pro.ratingCount} />
        </div>
        <p className="text-right"><span className="text-lg font-bold">{formatBRL(pro.hourlyCents!)}</span><span className="block text-xs text-muted">por hora</span></p>
      </Card>
      <RequestForm
        proId={pro.id}
        hourlyCents={pro.hourlyCents!}
        services={pro.services.map((s) => ({ slug: s, label: serviceLabel(s) }))}
        areas={pro.areas.map((a) => ({ uf: a.uf, city: a.city }))}
        defaultArea={{ uf: area.uf, city: area.city }}
        agenda={pro.availability.map((a) => `${WEEKDAYS[a.weekday]}: ${minutesToHHMM(a.startMin)} às ${minutesToHHMM(a.endMin)}`)}
        addresses={addresses.map((a) => ({ id: a.id, label: a.label, street: a.street, number: a.number ?? "", complement: a.complement ?? "", district: a.district ?? "", city: a.city, uf: a.uf, cep: a.cep ?? "", lat: a.lat, lng: a.lng }))}
        ufs={UFS}
      />
    </div>
  );
}
