import Link from "next/link";
import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { Empty, PageTitle, ProPhoto, Rating } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatBRL, proVisible, ratingOf, shortName } from "@/lib/domain";
import { proPhotoUrl } from "@/lib/pros";
import { requireClient } from "@/lib/session";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritesPage() {
  const user = await requireClient("/favoritos");
  const favs = await db.favorite.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { pro: { include: { user: { select: { name: true, blockedAt: true } }, subscription: true, areas: true } } },
  });
  return (
    <div className="space-y-4">
      <PageTitle title="Favoritos" subtitle="Profissionais que você salvou." />
      {favs.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {favs.map(({ pro }) => {
            const on = proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt });
            return (
              <li key={pro.id}>
                <Card className="flex items-center gap-3">
                  <ProPhoto url={on ? proPhotoUrl(pro) : null} name={pro.user.name} size={56} />
                  <div className="flex-1">
                    <p className="font-semibold">{shortName(pro.user.name)}</p>
                    <Rating value={ratingOf(pro)} count={pro.ratingCount} />
                    <p className="text-xs text-muted">{pro.areas.map((a) => a.city).join(", ")}</p>
                  </div>
                  {on ? (
                    <Link href={`/profissional/${pro.id}`} className="text-right text-sm font-semibold text-primary">{formatBRL(pro.hourlyCents!)}/h<span className="block text-xs font-normal">Ver perfil</span></Link>
                  ) : (
                    <span className="text-xs text-muted">Indisponível no momento</span>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty icon={<Heart />} title="Nenhum favorito ainda">Toque em “Favoritar” no perfil de um profissional para guardar aqui.</Empty>
      )}
    </div>
  );
}
