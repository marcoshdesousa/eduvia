// Vitrine: busca de prestadores por categoria, cidade e proximidade.
import { Prisma } from "@/generated/prisma/client";
import type { Plan } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { distanceKm, ratingOf, rankProviders } from "@/lib/domain";

/** Onde um prestador aparece: conta ativa, plano/teste em dia, sem pausa, com foto, serviço e endereço. */
export function visibleWhere(now = new Date()): Prisma.ProviderProfileWhereInput {
  return {
    status: "ACTIVE",
    paused: false,
    photoKey: { not: null },
    subscription: { currentPeriodEnd: { gt: now } },
    user: { blockedAt: null },
    services: { some: {} },
    places: { some: { active: true } },
  };
}

export type SearchInput = {
  category: string;
  uf?: string | null;
  city?: string | null;
  /** posição do cliente (localização do aparelho ou endereço escolhido) */
  near?: { lat: number; lng: number } | null;
  maxCents?: number | null;
  minRating?: number | null;
  radiusKm?: number;
};

const notBlockedBy = (clientId: string): Prisma.ProviderProfileWhereInput => ({
  NOT: { user: { OR: [{ blocks: { some: { blockedId: clientId } } }, { blockedBy: { some: { blockerId: clientId } } }] } },
});

/** Caixa de latitude/longitude em volta de um ponto (filtro rápido no banco antes da conta exata). */
export function bbox(p: { lat: number; lng: number }, km: number) {
  const dLat = km / 111;
  const dLng = km / (111 * Math.max(0.2, Math.cos((p.lat * Math.PI) / 180)));
  return { lat: { gte: p.lat - dLat, lte: p.lat + dLat }, lng: { gte: p.lng - dLng, lte: p.lng + dLng } };
}

export async function searchProviders(f: SearchInput, opts: { clientId?: string | null; now?: Date } = {}) {
  const radius = f.radiusKm ?? 30;
  const placeFilter: Prisma.ProviderPlaceWhereInput = f.near ? { active: true, ...bbox(f.near, radius) } : { active: true, uf: f.uf ?? undefined, city: f.city ?? undefined };
  const rows = await db.providerProfile.findMany({
    where: {
      ...visibleWhere(opts.now),
      services: { some: { category: f.category } },
      places: { some: placeFilter },
      ...(opts.clientId ? notBlockedBy(opts.clientId) : {}),
    },
    include: { user: { select: { name: true } }, services: true, places: { where: { active: true } }, subscription: { select: { plan: true } }, _count: { select: { posts: true } } },
    take: 300,
  });
  let list = rows.map((p) => {
    const service = p.services.find((s) => s.category === f.category)!;
    const dist = f.near ? Math.min(...p.places.map((pl) => distanceKm(f.near!, pl))) : null;
    return { ...p, service, priceCents: service.priceCents, plan: (p.subscription?.plan ?? "BASIC") as Plan, distanceKm: dist, rating: ratingOf(p) };
  });
  if (f.near) list = list.filter((p) => p.distanceKm! <= radius);
  if (f.minRating) list = list.filter((p) => p.rating == null || p.rating >= f.minRating!);
  return rankProviders(list, f.maxCents);
}

export const providerPhotoUrl = (p: { id: string; photoKey: string | null }) => (p.photoKey ? `/api/foto/${p.id}?v=${p.photoKey.slice(-12, -5)}` : null);
export const postImageUrl = (post: { id: string; imageKey: string }) => `/api/post/${post.id}?v=${post.imageKey.slice(-12, -5)}`;

/** O perfil (foto e portfólio) pode ser visto por esta pessoa? Público se está na vitrine; senão, só o dono, o admin e quem já contratou. */
export async function providerViewable(proId: string, viewer: { id: string; role: string } | null) {
  const pro = await db.providerProfile.findFirst({ where: { id: proId }, select: { userId: true } });
  if (!pro) return { pro: null, isPublic: false, allowed: false };
  const isPublic = !!(await db.providerProfile.findFirst({ where: { id: proId, ...visibleWhere() }, select: { id: true } }));
  const allowed = isPublic || (!!viewer && (viewer.role === "ADMIN" || viewer.id === pro.userId || !!(await db.booking.findFirst({ where: { proId, clientId: viewer.id }, select: { id: true } }))));
  return { pro, isPublic, allowed };
}
