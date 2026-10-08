import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { notFound } from "next/navigation";
import { Lock, Zap } from "lucide-react";
import { StreakIcon } from "@/components/streak-icon";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { ACHIEVEMENTS, computeStats } from "@/lib/achievements";
import { levelFromXp } from "@/lib/gamification";
import { formatDay } from "@/lib/core/dates";
import { Badge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  return { title: `@${(await params).handle}` };
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const viewer = await requireReadyUser();
  const handle = decodeURIComponent((await params).handle).replace(/^@/, "");
  const user = await db.user.findUnique({ where: { handle } });
  if (!user || !user.cpf) notFound();
  const isSelf = user.id === viewer.id;
  const isPrivate = user.profileVisibility === "PRIVATE" && !isSelf;
  const { level, title, progress, nextFloor } = levelFromXp(user.xp);

  const header = (
    <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <Avatar id={user.avatar} name={user.name} size={80} />
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted">@{user.handle}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <Badge tone="primary">Nível {level} · {title}</Badge>
          {isPrivate && <Badge><Lock size={12} /> Perfil privado</Badge>}
          {isSelf && user.profileVisibility === "PRIVATE" && <Badge><Lock size={12} /> Só você vê as estatísticas</Badge>}
        </div>
      </div>
      {isSelf && <Link href="/configuracoes" className={buttonClass("outline", "sm")}>Editar perfil</Link>}
    </Card>
  );
  if (isPrivate) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {header}
        <Card className="text-center text-sm text-muted">Este perfil é privado.</Card>
      </div>
    );
  }

  const [stats, owned, accuracy] = await Promise.all([
    computeStats(user.id),
    db.userAchievement.findMany({ where: { userId: user.id } }),
    db.attempt.aggregate({ where: { userId: user.id }, _avg: { score: true } }),
  ]);
  const unlocked = new Map(owned.map((o) => [o.slug, o.unlockedAt]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      <Card>
        <div className="mb-1 flex justify-between text-sm">
          <span className="inline-flex items-center gap-1 font-medium"><Zap size={15} className="text-primary" /> {user.xp} XP</span>
          <span className="text-muted">próximo nível em {nextFloor} XP</span>
        </div>
        <Progress value={progress} />
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sequência" value={<span className="inline-flex items-center gap-1"><StreakIcon className="h-5 w-5" />{user.currentStreak}</span>} hint={`recorde ${user.longestStreak}`} />
        <Stat label="Sessões" value={stats.sessions} />
        <Stat label="Questões" value={stats.attempts} hint={stats.attempts ? `${Math.round((accuracy._avg.score ?? 0) * 100)}% de acerto` : undefined} />
        <Stat label="Simulados" value={stats.exams} hint={stats.exams ? `melhor nota ${stats.bestExam.toFixed(1).replace(".", ",")}` : undefined} />
      </div>
      <Card>
        <CardTitle>Conquistas <span className="text-sm font-normal text-muted">{unlocked.size}/{ACHIEVEMENTS.length}</span></CardTitle>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const at = unlocked.get(a.slug);
            return (
              <li key={a.slug} className={cn("rounded-xl border p-3", at ? "border-primary/40 bg-primary/10" : "border-border opacity-60")}>
                <div className={cn("text-3xl", !at && "grayscale")}>{a.emoji}</div>
                <div className="mt-1 text-sm font-semibold">{a.name}</div>
                <div className="text-xs text-muted">{a.description}</div>
                <div className="mt-1 text-xs">{at ? <span className="text-success">Conquistada em {formatDay(at)}</span> : <span className="inline-flex items-center gap-1 text-muted"><Lock size={11} /> Bloqueada</span>}</div>
              </li>
            );
          })}
        </ul>
      </Card>
      <p className="text-center text-xs text-muted">No Eduvia desde {formatDay(user.createdAt, { month: "long", year: "numeric" })}</p>
    </div>
  );
}
