import Link from "next/link";
import { MapPin } from "lucide-react";
import { ProPhoto, Rating, RecommendedBadge } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { UNIT_LABEL, formatBRL, formatKm, shortName } from "@/lib/domain";
import type { PriceUnit } from "@/generated/prisma/enums";

export type ProviderCardData = {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number | null;
  ratingCount: number;
  priceCents: number;
  unit: PriceUnit;
  plan: "BASIC" | "FULL";
  distanceKm: number | null;
  place: string;
  quickNow?: boolean;
  overBudget?: boolean;
  serviceLabel?: string;
};

export function ProviderCard({ p, href }: { p: ProviderCardData; href: string }) {
  return (
    <Link href={href}>
      <Card className={`flex items-center gap-3 p-3 transition hover:border-primary ${p.plan === "FULL" ? "border-primary/40" : ""}`}>
        <ProPhoto url={p.photoUrl} name={p.name} size={64} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate font-semibold">{shortName(p.name)}</p>
            {p.plan === "FULL" && <RecommendedBadge />}
          </div>
          <Rating value={p.rating} count={p.ratingCount} />
          <p className="flex items-center gap-1 truncate text-xs text-muted">
            <MapPin size={12} /> {p.distanceKm != null ? `${formatKm(p.distanceKm)} · ` : ""}{p.place}
          </p>
          {p.quickNow && <p className="text-xs font-medium text-success">⚡ Disponível agora</p>}
        </div>
        <div className="text-right">
          <p className={`font-extrabold ${p.overBudget ? "text-muted" : ""}`}>{formatBRL(p.priceCents)}</p>
          <p className="text-[11px] text-muted">{UNIT_LABEL[p.unit].per}</p>
          {p.overBudget && <p className="text-[10px] text-warning">acima do seu valor</p>}
        </div>
      </Card>
    </Link>
  );
}
