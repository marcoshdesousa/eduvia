import Link from "next/link";
import type { Metadata } from "next";
import { SearchX, Zap } from "lucide-react";
import { Empty, PageTitle } from "@/components/bits";
import { ProviderCard } from "@/components/provider-card";
import { buttonClass } from "@/components/ui/button";
import { category, isCategory, parseBRL, isQuickCategory } from "@/lib/domain";
import { UFS, officialCity } from "@/lib/places";
import { profilePhotoUrl, searchProviders } from "@/lib/providers";
import { getCurrentUser } from "@/lib/session";
import { SearchBar } from "./search-bar";

export const metadata: Metadata = { title: "Buscar" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const servico = isCategory(sp.servico ?? "") ? sp.servico! : "";
  const lat = Number(sp.lat);
  const lng = Number(sp.lng);
  const near = sp.lat && sp.lng && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  const uf = (sp.uf ?? "").toUpperCase();
  const city = uf && sp.cidade ? officialCity(uf, sp.cidade) : null;
  const maxCents = sp.max ? parseBRL(sp.max) : null;
  const cat = category(servico);
  const results = servico ? await searchProviders({ category: servico, near, uf: near ? null : uf, city: near ? null : city, maxCents }, { clientId: user?.id }) : null;
  const now = new Date();
  return (
    <div className="space-y-4">
      <PageTitle title={cat ? `${cat.emoji} ${cat.label}` : "Encontrar prestador"} subtitle="Prestadores ★ Recomendados (plano Completo) ficam no topo. Use o filtro para ver os mais perto de você." />
      {servico ? (
        <details className="rounded-2xl border border-border bg-surface">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
            🔎 {near ? "Mais perto de você" : city ? `Em ${city}/${uf}` : "Todo o Brasil"} · <span className="text-primary">filtrar (perto de mim, cidade, preço)</span>
          </summary>
          <div className="px-1 pb-1">
            <SearchBar ufs={UFS} initial={{ servico, uf, cidade: city ?? sp.cidade ?? "", max: sp.max ?? "", lat: near ? String(lat) : "", lng: near ? String(lng) : "" }} />
          </div>
        </details>
      ) : (
        <SearchBar ufs={UFS} initial={{ servico, uf, cidade: city ?? sp.cidade ?? "", max: sp.max ?? "", lat: near ? String(lat) : "", lng: near ? String(lng) : "" }} />
      )}
      {cat && isQuickCategory(cat.slug) && (
        <Link href={`/rapido?servico=${cat.slug}`} className={buttonClass("outline", "md", "w-full border-primary/50 text-primary")}>
          <Zap size={16} /> Precisa agora? Use o Contrate rápido
        </Link>
      )}
      {results &&
        (results.length ? (
          <ul className="space-y-2">
            {results.map((p) => {
              const place = near ? p.places.reduce((a, b) => (Math.hypot(a.lat - lat, a.lng - lng) < Math.hypot(b.lat - lat, b.lng - lng) ? a : b)) : (p.places.find((pl) => pl.city === city) ?? p.places[0]);
              return (
                <li key={p.id}>
                  <ProviderCard
                    href={`/prestador/${p.id}?perfil=${p.service.category}`}
                    p={{
                      id: p.id,
                      name: p.user.name,
                      photoUrl: profilePhotoUrl(p.service),
                      rating: p.rating,
                      ratingCount: p.ratingCount,
                      priceCents: p.priceCents,
                      unit: p.service.unit,
                      hourCents: p.service.unit !== "HORA" ? p.service.hourCents : null,
                      plan: p.plan,
                      distanceKm: p.distanceKm,
                      place: `${place.district ? `${place.district}, ` : ""}${place.city}`,
                      quickNow: !!cat && isQuickCategory(cat.slug) && p.plan === "FULL" && !!p.quickTermsAt && p.quickOn && !(p.quickBannedUntil && p.quickBannedUntil > now),
                      overBudget: !!maxCents && p.priceCents > maxCents,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty icon={<SearchX />} title="Ninguém encontrado ainda">
            Tente outra cidade, aumente o valor ou chame pelo Contrate rápido. A plataforma está crescendo!
          </Empty>
        ))}
    </div>
  );
}
