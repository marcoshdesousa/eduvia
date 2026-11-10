import Link from "next/link";
import type { Metadata } from "next";
import { Clock, MapPin, SearchX, SlidersHorizontal } from "lucide-react";
import { Empty, PageTitle, ProPhoto, Rating } from "@/components/bits";
import { CityPicker } from "@/components/city-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { SERVICES, WEEKDAYS, formatBRL, minutesToHHMM, serviceLabel, shortName } from "@/lib/domain";
import { UFS, officialCity, ufName } from "@/lib/places";
import { proPhotoUrl, searchPros } from "@/lib/pros";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Buscar profissionais" };

type Params = { uf?: string; cidade?: string; preco?: string; servicos?: string | string[]; dia?: string; nota?: string; ordem?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const uf = (sp.uf ?? "").toUpperCase();
  const city = uf ? officialCity(uf, sp.cidade ?? "") : null;
  const services = ([] as string[]).concat(sp.servicos ?? []).filter((s) => SERVICES.some((x) => x.slug === s));
  const maxPrice = Number(sp.preco) > 0 ? Number(sp.preco) * 100 : null;
  const weekday = sp.dia !== undefined && sp.dia !== "" && Number(sp.dia) >= 0 && Number(sp.dia) <= 6 ? Number(sp.dia) : null;
  const minRating = Number(sp.nota) > 0 ? Number(sp.nota) : null;
  const sort = sp.ordem === "preco" || sp.ordem === "avaliacao" ? sp.ordem : "relevancia";
  const pros = city ? await searchPros({ uf, city, maxPriceCents: maxPrice, services, weekday, minRating, sort }, { clientId: user?.role === "CLIENT" ? user.id : null }) : [];

  return (
    <div className="space-y-5">
      <PageTitle title="Encontre um profissional" subtitle={city ? `${city} · ${ufName(uf)}` : "Escolha o município onde você quer a limpeza."} />
      <Card>
        <form action="/buscar" className="space-y-3">
          <CityPicker ufs={UFS} defaultUf={uf} defaultCity={city ?? sp.cidade ?? ""} />
          <details className="group" open={!!(services.length || maxPrice || weekday != null || minRating)}>
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary">
              <SlidersHorizontal size={16} /> Filtros e ordem
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <Select name="preco" defaultValue={sp.preco ?? ""} aria-label="Preço máximo por hora">
                <option value="">Qualquer preço</option>
                {[20, 25, 30, 40, 50, 70, 100].map((v) => <option key={v} value={v}>Até R$ {v}/hora</option>)}
              </Select>
              <Select name="dia" defaultValue={sp.dia ?? ""} aria-label="Dia da semana">
                <option value="">Qualquer dia</option>
                {WEEKDAYS.map((d, i) => <option key={d} value={i}>Atende {d.toLowerCase()}</option>)}
              </Select>
              <Select name="nota" defaultValue={sp.nota ?? ""} aria-label="Avaliação mínima">
                <option value="">Qualquer avaliação</option>
                <option value="4">4 estrelas ou mais</option>
                <option value="4.5">4,5 estrelas ou mais</option>
              </Select>
              <Select name="ordem" defaultValue={sort} aria-label="Ordenar">
                <option value="relevancia">Mais relevantes</option>
                <option value="preco">Menor preço</option>
                <option value="avaliacao">Melhor avaliação</option>
              </Select>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <label key={s.slug} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary">
                  <input type="checkbox" name="servicos" value={s.slug} defaultChecked={services.includes(s.slug)} className="sr-only" />
                  {s.label}
                </label>
              ))}
            </div>
          </details>
          <Button type="submit" className="w-full sm:w-auto">Buscar</Button>
        </form>
      </Card>

      {city &&
        (pros.length ? (
          <>
            <p className="text-sm text-muted">{pros.length === 1 ? "1 profissional encontrado" : `${pros.length} profissionais encontrados`}</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pros.map((p, i) => (
                <li key={p.id} className="hl-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <Link href={`/profissional/${p.id}?uf=${uf}&cidade=${encodeURIComponent(city)}`} className="block h-full">
                    <Card className="flex h-full flex-col gap-3 transition hover:border-primary hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <ProPhoto url={proPhotoUrl(p)} name={p.user.name} size={64} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{shortName(p.user.name)}</p>
                          <p className="flex items-center gap-1 text-xs text-muted"><MapPin size={12} /> {p.areas.map((a) => a.city).join(", ")}</p>
                          <Rating value={p.rating} count={p.ratingCount} />
                        </div>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted">{p.services.map(serviceLabel).join(" · ")}</p>
                      <div className="mt-auto flex items-end justify-between gap-2">
                        <p className="text-xs text-muted">
                          <Clock size={12} className="mr-1 inline" />
                          {p.availability.length ? p.availability.sort((a, b) => a.weekday - b.weekday).map((a) => `${WEEKDAYS[a.weekday].slice(0, 3)} ${minutesToHHMM(a.startMin)}`).slice(0, 3).join(", ") + (p.availability.length > 3 ? "…" : "") : "Horário a combinar"}
                          {p.completedCount > 0 && <span className="block">{p.completedCount} serviços concluídos</span>}
                        </p>
                        <p className="text-right">
                          <span className="text-lg font-bold text-brand-ink">{formatBRL(p.hourlyCents!)}</span>
                          <span className="text-xs text-muted">/hora</span>
                        </p>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty icon={<SearchX />} title="Nenhum profissional disponível com esses filtros">
            Tente tirar alguns filtros ou escolher um município vizinho. Novos profissionais entram toda semana.
          </Empty>
        ))}
    </div>
  );
}
