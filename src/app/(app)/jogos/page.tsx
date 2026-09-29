import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { GAMES } from "@/games/catalog";
import { formatDay } from "@/lib/core/dates";
import { Card, CardTitle } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Jogos" };

export default async function Page() {
  const user = await requireReadyUser();
  const runs = await db.gameRun.findMany({ where: { userId: user.id, endedAt: { not: null } }, orderBy: { startedAt: "desc" }, take: 10 });
  const best = await db.gameRun.groupBy({ by: ["gameSlug"], where: { userId: user.id }, _max: { score: true } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jogos</h1>
        <p className="text-sm text-muted">Pratique o que você estudou de um jeito rápido. As perguntas vêm do seu material e os erros vão para o banco de erros.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {GAMES.map((g) => (
          <Card key={g.slug} className="flex flex-col">
            <div className="text-4xl">{g.emoji}</div>
            <h2 className="mt-2 text-lg font-semibold">{g.name}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{g.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted">Recorde: {best.find((b) => b.gameSlug === g.slug)?._max.score ?? 0}</span>
              <Link href={`/jogos/${g.slug}`} className={buttonClass("primary")}>Jogar</Link>
            </div>
          </Card>
        ))}
        <Card className="grid place-items-center border-dashed text-center text-sm text-muted">Novos jogos em breve</Card>
      </div>
      {runs.length > 0 && (
        <Card>
          <CardTitle>Últimas partidas</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {runs.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2">
                <span className="w-24 text-muted">{formatDay(r.startedAt)}</span>
                <span className="flex-1">{GAMES.find((g) => g.slug === r.gameSlug)?.name}</span>
                <span className="text-muted">✅ {r.correct} · ❌ {r.wrong}</span>
                <span className="w-16 text-right font-semibold">⭐ {r.score}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
