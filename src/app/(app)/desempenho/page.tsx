import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { addDays, formatDay, keyFromDay, today } from "@/lib/core/dates";
import { masteryStatus, MASTERY_LABEL } from "@/lib/core/spaced";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { MasteryBadge, Progress } from "@/components/ui/badge";
import { ColumnChart, TrendChart } from "@/components/charts";
import { cn, formatMinutes } from "@/lib/utils";

export const metadata = { title: "Desempenho" };

const RECOMMEND: Record<string, string> = {
  CRITICO: "Refaça as questões no banco de erros e revise o texto de estudo antes de seguir.",
  EM_DESENVOLVIMENTO: "Continue praticando: um simulado ou uma partida do jogo ajudam a consolidar.",
  BOM: "Mantenha as revisões programadas para não esquecer.",
  SEM_DADOS: "Responda algumas questões para medirmos seu desempenho.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prep?: string }> }) {
  const user = await requireReadyUser();
  const preps = await db.preparation.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { id: true, title: true } });
  const wanted = (await searchParams).prep;
  const prepId = preps.find((p) => p.id === wanted)?.id ?? null;
  const prepFilter = prepId ? { id: prepId } : { userId: user.id };
  const day = today(user.timezone);

  const [subjects, mastery, totals, studyDays, exams] = await Promise.all([
    db.subject.findMany({ where: { preparation: prepFilter }, include: { topics: { select: { id: true, title: true } }, preparation: { select: { title: true } } }, orderBy: [{ weight: "desc" }, { name: "asc" }] }),
    db.topicMastery.findMany({ where: { userId: user.id, topic: { subject: { preparation: prepFilter } } } }),
    db.attempt.aggregate({ where: { userId: user.id, question: { topic: { subject: { preparation: prepFilter } } } }, _count: true, _sum: { score: true } }),
    db.studyDay.findMany({ where: { userId: user.id, date: { gte: addDays(day, -29) } }, orderBy: { date: "asc" } }),
    db.examAttempt.findMany({ where: { userId: user.id, finishedAt: { not: null }, exam: { preparation: prepFilter } }, select: { score: true } }),
  ]);

  const weekly = await db.$queryRaw<{ week: Date; total: bigint; score: number }[]>`
    SELECT date_trunc('week', a."createdAt") AS week, COUNT(*)::bigint AS total, SUM(a.score)::float AS score
      FROM "Attempt" a
      JOIN "Question" q ON q.id = a."questionId"
      JOIN "Topic" t ON t.id = q."topicId"
      JOIN "Subject" s ON s.id = t."subjectId"
      JOIN "Preparation" p ON p.id = s."preparationId"
     WHERE a."userId" = ${user.id} AND a."createdAt" > now() - interval '8 weeks'
       AND (${prepId}::text IS NULL OR p.id = ${prepId})
     GROUP BY 1 ORDER BY 1`;

  const masteryBy = new Map(mastery.map((m) => [m.topicId, m]));
  const answered = totals._count;
  const accuracy = answered ? (totals._sum.score ?? 0) / answered : 0;
  const allMinutes = await db.studyDay.aggregate({ where: { userId: user.id }, _sum: { minutes: true } });
  const minutesByDay = new Map(studyDays.map((d) => [keyFromDay(d.date), d.minutes]));
  const last30 = Array.from({ length: 30 }, (_, i) => addDays(day, i - 29)).map((d) => ({ label: formatDay(d), value: minutesByDay.get(keyFromDay(d)) ?? 0 }));

  const subjectRows = subjects
    .map((s) => {
      const ms = s.topics.map((t) => masteryBy.get(t.id)).filter(Boolean);
      const attempts = ms.reduce((a, m) => a + m!.attempts, 0);
      const correct = ms.reduce((a, m) => a + m!.correct, 0);
      const acc = attempts ? correct / attempts : 0;
      return { s, attempts, acc, status: masteryStatus(attempts, acc) };
    })
    .sort((a, b) => (a.attempts && b.attempts ? a.acc - b.acc : b.attempts - a.attempts));
  const critical = mastery.filter((m) => m.status === "CRITICO").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Desempenho</h1>
          <p className="text-sm text-muted">Acertos por disciplina e assunto, evolução e tempo de estudo.</p>
        </div>
        {preps.length > 1 && (
          <div className="flex flex-wrap gap-1 text-sm">
            <Link href="/desempenho" className={cn("rounded-full px-3 py-1", !prepId ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2")}>Todas</Link>
            {preps.map((p) => (
              <Link key={p.id} href={`/desempenho?prep=${p.id}`} className={cn("rounded-full px-3 py-1", prepId === p.id ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2")}>{p.title}</Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Acerto geral" value={answered ? `${Math.round(accuracy * 100)}%` : "—"} hint={`${answered} questões respondidas`} />
        <Stat label="Tempo de estudo" value={formatMinutes(allMinutes._sum.minutes ?? 0)} hint="total registrado" />
        <Stat label="Simulados" value={exams.length} hint={exams.length ? `média ${(exams.reduce((s, e) => s + (e.score ?? 0), 0) / exams.length).toFixed(1).replace(".", ",")}` : "nenhum ainda"} />
        <Stat label="Pontos críticos" value={critical} hint={critical ? "assuntos abaixo de 50%" : "nenhum no momento"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Acerto por semana</CardTitle>
          <p className="text-xs text-muted">% de acerto nas últimas 8 semanas</p>
          <div className="mt-3">
            {weekly.length ? (
              <TrendChart
                data={weekly.map((w) => ({ label: `sem. ${formatDay(new Date(w.week))}`, value: Math.round((w.score / Number(w.total)) * 100) }))}
                domain={[0, 100]}
                format="percent"
                valueLabel="Acerto"
              />
            ) : (
              <p className="py-10 text-center text-sm text-muted">Responda questões para ver sua evolução.</p>
            )}
          </div>
        </Card>
        <Card>
          <CardTitle>Minutos estudados por dia</CardTitle>
          <p className="text-xs text-muted">Últimos 30 dias, todas as preparações</p>
          <div className="mt-3">
            <ColumnChart data={last30} format="minutes" valueLabel="Minutos" />
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Por disciplina</CardTitle>
        <p className="text-xs text-muted">Crítico: abaixo de 50% · Em desenvolvimento: 50% a 75% · Bom: acima de 75% (a partir de 3 questões)</p>
        {!subjectRows.length && <p className="mt-3 text-sm text-muted">Nenhuma disciplina ainda.</p>}
        <ul className="mt-3 divide-y divide-border">
          {subjectRows.map(({ s, attempts, acc, status }) => (
            <li key={s.id} className="py-3">
              <details>
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{s.name}{!prepId && preps.length > 1 && <span className="ml-2 text-xs font-normal text-muted">{s.preparation.title}</span>}</span>
                    <span className="flex items-center gap-2 text-muted">{attempts ? `${Math.round(acc * 100)}% · ${Math.round(attempts)} questões` : "sem respostas"} <MasteryBadge status={status} /></span>
                  </div>
                  <Progress className="mt-2" value={attempts ? acc : 0} tone={status === "CRITICO" ? "danger" : status === "EM_DESENVOLVIMENTO" ? "warning" : "success"} />
                </summary>
                <ul className="mt-3 space-y-2 pl-2">
                  {s.topics.map((t) => {
                    const m = masteryBy.get(t.id);
                    const st = m?.status ?? "SEM_DADOS";
                    return (
                      <li key={t.id} className="text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex-1 truncate">{t.title}</span>
                          <span className="shrink-0 text-xs text-muted">{m?.attempts ? `${Math.round(m.accuracy * 100)}% (${m.attempts})` : "—"}</span>
                          <MasteryBadge status={st} />
                        </div>
                        {st !== "BOM" && st !== "SEM_DADOS" && <p className="mt-0.5 text-xs text-muted">{MASTERY_LABEL[st]}: {RECOMMEND[st]}</p>}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
