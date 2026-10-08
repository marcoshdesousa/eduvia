import Link from "next/link";
import { BookOpenCheck, ClipboardCheck, Gift, GraduationCap, PenLine, PlayCircle, RotateCcw, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { addDays, keyFromDay, today } from "@/lib/core/dates";
import { levelFromXp, liveStreak, STREAK_MIN_MINUTES } from "@/lib/gamification";
import { StreakCard } from "@/components/streak-card";
import { getAccess, hasFullAccess } from "@/lib/billing";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { MATERIAS } from "@/lib/enem/catalog";
import { lessonStates, nextEnemLesson } from "@/lib/enem/progress";
import { InstallButton } from "@/components/install-app";
import { Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";

export const metadata = { title: "Início" };

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export default async function Page() {
  const user = await requireReadyUser();
  const day = today(user.timezone);
  await ensureEnemCatalog();
  const access = await getAccess(user);
  const pct = access.limits.lessonsPct;
  const [next, states, dueQuestions, errorBank, lastDays] = await Promise.all([
    nextEnemLesson(user.id, undefined, pct),
    lessonStates(user.id, undefined, pct),
    db.reviewItem.count({ where: { userId: user.id, dueAt: { lte: day } } }),
    db.reviewItem.count({ where: { userId: user.id, inErrorBank: true } }),
    db.studyDay.findMany({ where: { userId: user.id, date: { gte: addDays(day, -6) } }, select: { date: true, minutes: true } }),
  ]);
  const streak = liveStreak(user, EVERY_DAY, day);
  // o dia conta para a sequência com pelo menos 5 minutos de estudo
  const studied = new Set(lastDays.filter((d) => d.minutes >= STREAK_MIN_MINUTES).map((d) => keyFromDay(d.date)));
  const minutesToday = lastDays.find((d) => keyFromDay(d.date) === keyFromDay(day))?.minutes ?? 0;
  const all = [...states.values()].flat();
  const passed = all.filter((l) => l.passed).length;
  const nextMateria = next ? MATERIAS.find((m) => next.topicId.startsWith(`enem-a-${m.slug}-`)) : null;
  // matérias com algum progresso (as que o aluno está estudando), as mais avançadas primeiro
  const started = MATERIAS.map((m) => {
    const ls = states.get(m.slug) ?? [];
    return { m, done: ls.filter((l) => l.passed).length, total: ls.length };
  })
    .filter((x) => x.done > 0)
    .sort((a, b) => b.done / b.total - a.done / a.total)
    .slice(0, 5);
  const { level, progress } = levelFromXp(user.xp);
  const actions = [
    { href: "/simulados/enem", icon: ClipboardCheck, title: "Simulado ENEM", text: "Prova com o tempo do ENEM" },
    { href: "/teste-rapido", icon: Zap, title: "Teste rápido", text: "Questões reais, cronometradas" },
    { href: "/redacao", icon: PenLine, title: "Redação", text: "Tema do ENEM com correção" },
    { href: "/professor", icon: GraduationCap, title: "Professor IA", text: "Tire suas dúvidas" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.name.split(" ")[0]}!</h1>
          <p className="text-sm text-muted">{passed ? `Você já concluiu ${passed} aula${passed === 1 ? "" : "s"} do ENEM. Continue assim!` : "Vamos estudar para o ENEM? Comece pela primeira aula."}</p>
        </div>
        <InstallButton />
      </div>

      <StreakCard streak={streak} best={user.longestStreak} day={day} studied={studied} minutesToday={minutesToday} goal={STREAK_MIN_MINUTES} href={next ? `/enem/aula/${next.topicId}` : "/enem"} />

      <Card className="space-y-3">
        <CardTitle className="flex items-center gap-2"><BookOpenCheck size={18} className="text-primary" /> Próxima aula</CardTitle>
        {next ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">{nextMateria?.name} · Aula {next.index + 1}</p>
              <p className="font-semibold">{next.title}</p>
            </div>
            <Link href={`/enem/aula/${next.topicId}`} className={buttonClass("primary")}>
              <PlayCircle size={16} /> {next.sessionId ? "Continuar" : "Começar"}
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Você concluiu todas as aulas liberadas no seu plano. {hasFullAccess(access) ? "Revise o banco de erros e faça simulados!" : "Assine um plano para liberar mais aulas."}
          </p>
        )}
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted"><span>Seu progresso no ENEM</span><span>{passed}/{all.length} aulas</span></div>
          <Progress value={all.length ? passed / all.length : 0} />
        </div>
        <Link href="/enem" className="inline-block text-sm text-primary">Ver todas as matérias →</Link>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map((a) => (
          <Link key={a.href} href={a.href}>
            <Card className="h-full space-y-1 transition-colors hover:border-primary/50">
              <a.icon size={22} className="text-primary" />
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-muted">{a.text}</p>
            </Card>
          </Link>
        ))}
      </div>

      {!hasFullAccess(access) && (
        <Link href="/assinatura#indicacao" className="block">
          <Card className="flex items-center gap-3 border-success/50 bg-success/5 transition-colors hover:border-success">
            <Gift className="shrink-0 text-success" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold">Indique amigos e tenha tudo liberado por R$ 7,90</p>
              <p className="text-muted">Compartilhe o seu código. Quando 3 pessoas criarem a conta com ele, você libera o plano com tudo do Completo.</p>
            </div>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Nível" value={<span className="inline-flex items-center gap-1"><Zap size={20} className="text-primary" />{level}</span>} hint={<Progress value={progress} className="mt-1" />} />
        <Stat label="Para revisar hoje" value={dueQuestions} hint={<Link href="/revisoes" className="text-primary">Revisar</Link>} />
        <Stat className="col-span-2 lg:col-span-1" label="Banco de erros" value={errorBank} hint={<Link href="/revisoes" className="inline-flex items-center gap-1 text-primary"><RotateCcw size={12} /> Refazer questões</Link>} />
      </div>

      {started.length > 0 && (
        <Card>
          <CardTitle>Suas matérias</CardTitle>
          <div className="mt-3 space-y-4">
            {started.map(({ m, done, total }) => (
              <Link key={m.slug} href={`/enem/${m.slug}`} className="block">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted">{done}/{total} aulas</span>
                </div>
                <Progress value={done / Math.max(1, total)} />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
