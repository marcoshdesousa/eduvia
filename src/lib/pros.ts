// Vitrine: busca de profissionais por município, com filtros e ordenação.
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ratingOf } from "@/lib/domain";

export type SearchFilters = {
  uf: string;
  city: string;
  maxPriceCents?: number | null;
  services?: string[];
  /** dia da semana (0 = domingo) em que precisa atender */
  weekday?: number | null;
  minRating?: number | null;
  sort?: "relevancia" | "preco" | "avaliacao";
};

/** Onde aparece um profissional na vitrine: aprovado, com assinatura em dia, sem pausa, com preço e conta ativa. */
export function visibleWhere(now = new Date()): Prisma.ProfessionalProfileWhereInput {
  return {
    status: "APPROVED",
    paused: false,
    hourlyCents: { not: null },
    subscription: { currentPeriodEnd: { gt: now } },
    user: { blockedAt: null },
  };
}

export async function searchPros(f: SearchFilters, opts: { clientId?: string | null; now?: Date } = {}) {
  const where: Prisma.ProfessionalProfileWhereInput = {
    ...visibleWhere(opts.now),
    areas: { some: { uf: f.uf, city: f.city } },
    ...(f.maxPriceCents ? { hourlyCents: { not: null, lte: f.maxPriceCents } } : {}),
    ...(f.services?.length ? { services: { hasEvery: f.services } } : {}),
    ...(f.weekday != null ? { OR: [{ availability: { some: { weekday: f.weekday } } }, { availability: { none: {} } }] } : {}),
  };
  if (opts.clientId) {
    where.NOT = { user: { OR: [{ blocks: { some: { blockedId: opts.clientId } } }, { blockedBy: { some: { blockerId: opts.clientId } } }] } };
  }
  const rows = await db.professionalProfile.findMany({
    where,
    include: { user: { select: { name: true } }, areas: true, availability: true },
    take: 200,
  });
  let list = rows.map((p) => ({ ...p, rating: ratingOf(p) }));
  if (f.minRating) list = list.filter((p) => p.rating == null || p.rating >= f.minRating!);
  const sort = f.sort ?? "relevancia";
  list.sort((a, b) => {
    if (sort === "preco") return a.hourlyCents! - b.hourlyCents!;
    if (sort === "avaliacao") return (b.rating ?? 0) - (a.rating ?? 0) || b.ratingCount - a.ratingCount;
    // relevância: nota com peso pela quantidade de avaliações e serviços concluídos; perfis novos não são penalizados
    const score = (p: (typeof list)[number]) => (p.rating ?? 4.5) * Math.min(1, 0.6 + p.ratingCount / 25) + Math.min(p.completedCount, 50) / 100;
    return score(b) - score(a);
  });
  return list;
}

export const proPhotoUrl = (p: { id: string; photoKey: string | null; updatedAt?: Date }) => (p.photoKey ? `/api/foto/${p.id}?v=${p.photoKey.slice(-12, -5)}` : null);
