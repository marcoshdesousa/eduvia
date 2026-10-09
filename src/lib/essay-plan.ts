// Redação no plano: guias de estudo com a opção marcada pedem uma redação por semana.
import { db } from "@/lib/db";
import { addDays, today, weekday } from "@/lib/core/dates";
import { localDayStart } from "@/lib/billing";

export async function weeklyEssays(user: { id: string; timezone: string }) {
  const day = today(user.timezone);
  const weekStart = localDayStart(user.timezone, addDays(day, -weekday(day)));
  const preps = await db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE", includeEssay: true }, select: { id: true, title: true } });
  if (!preps.length) return [];
  const done = await db.essay.findMany({
    where: { userId: user.id, preparationId: { in: preps.map((p) => p.id) }, createdAt: { gte: weekStart }, status: { not: "DRAFT" } },
    select: { preparationId: true, id: true },
  });
  return preps.map((p) => ({ prep: p, essayId: done.find((e) => e.preparationId === p.id)?.id ?? null }));
}
