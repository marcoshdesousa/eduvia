// Resumo financeiro do prestador (o que recebeu direto dos clientes nos serviços concluídos).
import { db } from "@/lib/db";

const DAY = 86_400_000;
const valueOf = (b: { finalCents: number | null; estimateCents: number | null }) => b.finalCents ?? b.estimateCents ?? 0;

export async function providerFinance(proId: string, now = new Date()) {
  const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const done = await db.booking.findMany({
    where: { proId, status: "COMPLETED", completedAt: { gte: since } },
    select: { finalCents: true, estimateCents: true, completedAt: true, category: true, payMethod: true },
    orderBy: { completedAt: "asc" },
  });
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now.getTime() - ((now.getDay() + 6) % 7) * DAY);
  weekStart.setHours(0, 0, 0, 0);
  const sum = (from: Date) => done.filter((b) => b.completedAt! >= from).reduce((a, b) => ({ cents: a.cents + valueOf(b), count: a.count + 1 }), { cents: 0, count: 0 });
  const months = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);
    const list = done.filter((b) => b.completedAt! >= start && b.completedAt! < end);
    return { label: start.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""), cents: list.reduce((a, b) => a + valueOf(b), 0), count: list.length };
  });
  const byCategory = new Map<string, { cents: number; count: number }>();
  for (const b of done.filter((x) => x.completedAt! >= monthStart)) {
    const c = byCategory.get(b.category) ?? { cents: 0, count: 0 };
    byCategory.set(b.category, { cents: c.cents + valueOf(b), count: c.count + 1 });
  }
  return { week: sum(weekStart), month: sum(monthStart), last30: sum(new Date(now.getTime() - 30 * DAY)), months, byCategory: [...byCategory.entries()].sort((a, b) => b[1].cents - a[1].cents) };
}
