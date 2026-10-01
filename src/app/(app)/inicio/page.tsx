import Link from "next/link";
import { AlertTriangle, CheckCircle2, Play, RotateCcw, Target, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { InstallAppBanner } from "@/components/install-app";
import { requireReadyUser } from "@/lib/session";
import { ensurePlanFresh } from "@/lib/plan";
import { addDays, keyFromDay, today, weekday } from "@/lib/core/dates";
import { levelFromXp, liveStreak } from "@/lib/gamification";
import { StreakCard } from "@/components/streak-card";
import { MasteryBadge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { cn, formatMinutes } from "@/lib/utils";

export const metadata = { title: "Início" };

export default async function Page() {
  const user = await requireReadyUser();
  const day = today(user.timezone);
  const preps = await db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE" } });
  for (const p of preps) await ensurePlanFresh(p, user.timezone);

  // semana de domingo a sábado
  const weekStart = addDays(day, -weekday(day));
  const [todaySessions, dueQuestions, errorBank, weekDays, critical, topicStats, lastDays] = await Promise.all([
    db.plannedSession.findMany({
      where: { plan: { preparation: { userId: user.id, status: "ACTIVE" } }, date: day, status: { in: ["PENDING", "DONE"] } },
      include: { topic: { include: { subject: { include: { preparation: true } } } } },
      orderBy: [{ status: "asc" }, { order: "asc" }],
    }),
    db.reviewItem.count({ where: { userId: user.id, dueAt: { lte: day }, question: { topic: { subject: { preparation: { status: "ACTIVE" } } } } } }),
    db.reviewItem.count({ where: { userId: user.id, inErrorBank: true } }),
    db.studyDay.findMany({ where: { userId: user.id, date: { gte: weekStart } } }),
    db.topicMastery.findMany({
      where: { userId: user.id, status: "CRITICO", topic: { subject: { preparation: { status: "ACTIVE" } } } },
      include: { topic: { include: { subject: true } } },
      orderBy: { accuracy: "asc" },
      take: 5,
    }),
    db.topic.findMany({
      where: { subject: { preparation: { userId: user.id, status: "ACTIVE" } } },
      select: { id: true, subject: { select: { preparationId: true } }, mastery: { where: { userId: user.id }, select: { studyDone: true } } },
    }),
    db.studyDay.findMany({ where: { userId: user.id, date: { gte: addDays(day, -6) }, minutes: { gt: 0 } }, select: { date: true } }),
  ]);
  const streak = liveStreak(user, preps.flatMap((p) => p.studyDays), day);
  const studied = new Set(lastDays.map((d) => keyFromDay(d.date)));

  const pending = todaySessions.filter((s) => s.status === "PENDING");
  const doneToday = todaySessions.filter((s) => s.status === "DONE");
  const todayMinutes = todaySessions.reduce((s, x) => s + x.durationMin, 0);
  const weekMinutes = weekDays.reduce((s, d) => s + d.minutes, 0);
  const weekGoal = preps.reduce((s, p) => s + p.dailyMinutes * p.studyDays.length, 0);
  const { level, progress } = levelFromXp(user.xp);

  return (
    <div className="space-y-6">
      <InstallAppBanner />
      <div>
        <h1 className="text-2xl font-bold">Olá, {user.name.split(" ")[0]}!</h1>
        <p className="text-sm text-muted">
          {pending.length ? `Você tem ${formatMinutes(pending.reduce((s, x) => s + x.durationMin, 0))} de estudo para hoje.` : doneToday.length ? "Estudo de hoje concluído. Mandou bem!" : "Nada agendado para hoje."}
        </p>
      </div>

      <StreakCard streak={streak} best={user.longestStreak} day={day} studied={studied} href={pending[0] ? `/estudar/${pending[0].id}` : preps.length ? "/revisoes" : "/preparacoes/nova"} />

      {!preps.length ? (
        <Card className="text-center">
          <p className="font-medium">Vamos começar?</p>
          <p className="mt-1 text-sm text-muted">Crie sua primeira preparação e envie seus materiais. A IA monta o plano para você.</p>
          <Link href="/preparacoes/nova" className={buttonClass("primary", "md", "mt-4")}>Criar preparação</Link>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>O que fazer hoje</CardTitle>
            <span className="text-xs text-muted">{doneToday.length}/{todaySessions.length} sessões · {formatMinutes(todayMinutes)}</span>
          </div>
          {todaySessions.length > 0 && <Progress value={doneToday.length / todaySessions.length} className="mt-3" tone="success" />}
          <ul className="mt-3 divide-y divide-border">
            {todaySessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                {s.status === "DONE" ? <CheckCircle2 size={18} className="shrink-0 text-success" /> : s.kind === "REVIEW" ? <RotateCcw size={18} className="shrink-0 text-warning" /> : <Play size={18} className="shrink-0 text-primary" />}
                <div className="min-w-0 flex-1">
                  <div className={cn("truncate text-sm font-medium", s.status === "DONE" && "text-muted line-through")}>{s.topic.title}</div>
                  <div className="truncate text-xs text-muted">
                    {s.topic.subject.preparation.title} · {s.kind === "REVIEW" ? (s.reviewNumber ? `Revisão R${s.reviewNumber}` : "Reforço") : s.partCount > 1 ? `Parte ${s.part}/${s.partCount}` : "Estudo"} · {formatMinutes(s.durationMin)}
                  </div>
                </div>
                {s.status === "PENDING" && <Link href={`/estudar/${s.id}`} className={buttonClass(s === pending[0] ? "primary" : "outline", "sm")}>{s.kind === "REVIEW" ? "Revisar" : "Estudar"}</Link>}
              </li>
            ))}
            {!todaySessions.length && <li className="py-3 text-sm text-muted">Sem sessões hoje. Que tal praticar o banco de erros?</li>}
          </ul>
          {dueQuestions > 0 && (
            <Link href="/revisoes" className="mt-2 flex items-center justify-between rounded-lg bg-surface-2 p-3 text-sm hover:bg-border">
              <span className="inline-flex items-center gap-2"><Target size={16} className="text-primary" />{dueQuestions} questão(ões) para revisar hoje</span>
              <span className="text-primary">Praticar →</span>
            </Link>
          )}
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Nível" value={<span className="inline-flex items-center gap-1"><Zap size={20} className="text-primary" />{level}</span>} hint={<Progress value={progress} className="mt-1" />} />
        <Stat label="Meta da semana" value={formatMinutes(weekMinutes)} hint={weekGoal ? <Progress value={weekMinutes / weekGoal} className="mt-1" tone="success" /> : "Sem meta"} />
        <Stat label="Banco de erros" value={errorBank} hint={<Link href="/revisoes" className="text-primary">Refazer questões</Link>} />
      </div>

      {critical.length > 0 && (
        <Card>
          <CardTitle className="flex items-center gap-2"><AlertTriangle size={16} className="text-danger" /> Pontos de atenção</CardTitle>
          <ul className="mt-3 divide-y divide-border">
            {critical.map((m) => (
              <li key={m.topicId} className="flex items-center gap-3 py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{m.topic.title}</div>
                  <div className="text-xs text-muted">{m.topic.subject.name} · {Math.round(m.accuracy * 100)}% de acerto em {m.attempts} questões</div>
                </div>
                <MasteryBadge status={m.status} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Recomendação: refaça essas questões no banco de erros. O plano já agendou um reforço extra para esses assuntos.</p>
        </Card>
      )}

      {preps.length > 0 && (
        <Card>
          <CardTitle>Progresso dos planos</CardTitle>
          <div className="mt-3 space-y-4">
            {preps.map((p) => {
              const topics = topicStats.filter((t) => t.subject.preparationId === p.id);
              const finished = topics.filter((t) => t.mastery[0]?.studyDone).length;
              return (
                <Link key={p.id} href={`/preparacoes/${p.id}`} className="block">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-muted">{finished}/{topics.length} assuntos</span>
                  </div>
                  <Progress value={topics.length ? finished / topics.length : 0} />
                </Link>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
