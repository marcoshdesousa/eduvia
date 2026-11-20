import { db } from "@/lib/db";
import { visibleWhere } from "@/lib/providers";

/** Fotos recentes dos prestadores que estão na vitrine (Completo primeiro no mesmo dia). */
export async function feedPosts(opts: { take?: number; before?: Date | null; uf?: string | null } = {}) {
  return db.post.findMany({
    where: { pro: { ...visibleWhere(), ...(opts.uf ? { places: { some: { active: true, uf: opts.uf } } } : {}) }, ...(opts.before ? { createdAt: { lt: opts.before } } : {}) },
    orderBy: { createdAt: "desc" },
    take: opts.take ?? 20,
    include: { pro: { select: { id: true, photoKey: true, ratingSum: true, ratingCount: true, user: { select: { name: true } }, services: { select: { category: true }, take: 3 }, places: { where: { active: true }, select: { city: true, uf: true }, take: 1 }, subscription: { select: { plan: true } } } } },
  });
}
