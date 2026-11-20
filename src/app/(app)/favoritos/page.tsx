import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { Empty, PageTitle } from "@/components/bits";
import { ProviderCard } from "@/components/provider-card";
import { db } from "@/lib/db";
import { providerVisible, ratingOf } from "@/lib/domain";
import { providerPhotoUrl } from "@/lib/providers";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritesPage() {
  const user = await requireUser("/favoritos");
  const favs = await db.favorite.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { pro: { include: { user: { select: { name: true, blockedAt: true } }, subscription: true, places: { where: { active: true } }, services: { orderBy: { priceCents: "asc" } } } } },
  });
  const list = favs.map(({ pro }) => ({ pro, on: providerVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt, services: pro.services.length, places: pro.places.length }) })).filter((x) => x.on);
  return (
    <div className="space-y-4">
      <PageTitle title="Favoritos" subtitle="Prestadores que você salvou." />
      {list.length ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map(({ pro }) => (
            <li key={pro.id}>
              <ProviderCard
                href={`/prestador/${pro.id}`}
                p={{ id: pro.id, name: pro.user.name, photoUrl: providerPhotoUrl(pro), rating: ratingOf(pro), ratingCount: pro.ratingCount, priceCents: pro.services[0].priceCents, unit: pro.services[0].unit, plan: pro.subscription?.plan ?? "BASIC", distanceKm: null, place: pro.places[0] ? `${pro.places[0].city}/${pro.places[0].uf}` : "" }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={<Heart />} title="Nenhum favorito ainda">Toque no coração no perfil de um prestador para guardar aqui.</Empty>
      )}
      {favs.length > list.length && <p className="text-center text-xs text-muted">{favs.length - list.length} favorito(s) não está(ão) atendendo no momento.</p>}
    </div>
  );
}
