import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { getGame } from "@/games/catalog";
import { GamePlayer } from "./game-player";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireReadyUser();
  const game = getGame((await params).slug);
  if (!game) notFound();
  const preps = await db.preparation.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { subjects: { orderBy: { name: "asc" }, select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/jogos" className="text-sm text-muted hover:text-foreground">← Jogos</Link>
      <h1 className="text-2xl font-bold">{game.emoji} {game.name}</h1>
      {preps.length ? (
        <GamePlayer game={game} preparations={preps.map((p) => ({ id: p.id, title: p.title, subjects: p.subjects }))} />
      ) : (
        <p className="text-sm text-muted">Crie uma preparação e envie seus materiais para jogar.</p>
      )}
    </div>
  );
}
