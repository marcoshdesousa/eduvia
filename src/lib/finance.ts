// Gestão financeira do trabalhador: serviços concluídos (entram sozinhos) + entradas e saídas que ele lança.
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/domain";

const DAY = 86_400_000;
const TZ = "America/Sao_Paulo";
const valueOf = (b: { finalCents: number | null; estimateCents: number | null }) => b.finalCents ?? b.estimateCents ?? 0;

export type Movement = { id: string; date: Date; kind: "IN" | "OUT"; cents: number; description: string; auto: boolean };

/** "AAAA-MM" do mês em São Paulo. */
export const monthKey = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: TZ }).slice(0, 7);
export function monthRange(key: string) {
  const [y, m] = key.split("-").map(Number);
  return { start: new Date(Date.UTC(y, m - 1, 1, 3)), end: new Date(Date.UTC(y, m, 1, 3)) }; // 0h de São Paulo
}
export const monthLabel = (key: string) => {
  const { start } = monthRange(key);
  return start.toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: TZ });
};

/** Movimentos de um período (serviços concluídos + lançamentos manuais), do mais novo para o mais velho. */
export async function movements(proId: string, start: Date, end: Date): Promise<Movement[]> {
  const [done, entries] = await Promise.all([
    db.booking.findMany({ where: { proId, status: "COMPLETED", completedAt: { gte: start, lt: end } }, select: { id: true, completedAt: true, finalCents: true, estimateCents: true, category: true, client: { select: { name: true } } } }),
    db.financeEntry.findMany({ where: { proId, date: { gte: new Date(start.getTime() - 3 * 3_600_000), lt: new Date(end.getTime() - 3 * 3_600_000) } } }),
  ]);
  return [
    ...done.map((b) => ({ id: b.id, date: b.completedAt!, kind: "IN" as const, cents: valueOf(b), description: `Serviço: ${categoryLabel(b.category)} (${b.client.name.split(" ")[0]})`, auto: true })),
    ...entries.map((e) => ({ id: e.id, date: new Date(e.date.getTime() + 15 * 3_600_000), kind: e.kind, cents: e.amountCents, description: e.description, auto: false })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}

const sum = (list: Movement[], kind: "IN" | "OUT") => list.filter((m) => m.kind === kind).reduce((a, m) => a + m.cents, 0);

export async function providerFinance(proId: string, now = new Date()) {
  const sixAgo = monthRange(monthKey(new Date(now.getTime() - 155 * DAY))).start;
  const all = await movements(proId, sixAgo, new Date(now.getTime() + DAY));
  const weekStart = new Date(now.getTime() - ((now.getDay() + 6) % 7) * DAY);
  weekStart.setHours(0, 0, 0, 0);
  const curMonth = monthRange(monthKey(now)).start;
  const servicesIn = (from: Date) => all.filter((m) => m.auto && m.date >= from);
  const months = Array.from({ length: 6 }, (_, i) => {
    const key = monthKey(new Date(now.getFullYear(), now.getMonth() - 5 + i, 15));
    const { start, end } = monthRange(key);
    const list = all.filter((m) => m.date >= start && m.date < end);
    return { key, label: start.toLocaleDateString("pt-BR", { month: "short", timeZone: TZ }).replace(".", ""), in: sum(list, "IN"), out: sum(list, "OUT"), count: list.filter((m) => m.auto).length };
  });
  const pack = (list: Movement[]) => ({ cents: sum(list, "IN"), count: list.length });
  return { week: pack(servicesIn(weekStart)), month: pack(servicesIn(curMonth)), last30: pack(servicesIn(new Date(now.getTime() - 30 * DAY))), months };
}
