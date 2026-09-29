import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/charts";

export const metadata = { title: "Simulados" };

export default async function Page() {
  const user = await requireReadyUser();
  const exams = await db.exam.findMany({
    where: { ownerId: user.id },
    include: { preparation: { select: { title: true } }, attempts: { where: { userId: user.id }, orderBy: { startedAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  const finished = exams
    .flatMap((e) => e.attempts.filter((a) => a.finishedAt).map((a) => ({ a, e })))
    .sort((x, y) => x.a.finishedAt!.getTime() - y.a.finishedAt!.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Simulados</h1>
          <p className="text-sm text-muted">Provas cronometradas com questões do seu material.</p>
        </div>
        <Link href="/simulados/novo" className={buttonClass("primary")}><Plus size={16} /> Novo</Link>
      </div>

      {finished.length >= 2 && (
        <Card>
          <CardTitle>Evolução das notas</CardTitle>
          <p className="text-xs text-muted">Nota de 0 a 10 em cada simulado entregue</p>
          <div className="mt-3">
            <TrendChart
              data={finished.map(({ a }, i) => ({ label: `#${i + 1} ${formatDay(a.finishedAt!)}`, value: a.score }))}
              domain={[0, 10]}
              format="grade"
              valueLabel="Nota"
            />
          </div>
        </Card>
      )}

      {!exams.length && (
        <Card className="text-center">
          <p className="font-medium">Nenhum simulado ainda</p>
          <p className="mt-1 text-sm text-muted">Monte uma prova com as disciplinas que quiser e veja sua nota no final.</p>
          <Link href="/simulados/novo" className={buttonClass("primary", "md", "mt-4")}>Criar simulado</Link>
        </Card>
      )}
      <div className="space-y-3">
        {exams.map((e) => {
          const last = e.attempts[0];
          return (
            <Link key={e.id} href={`/simulados/${e.id}`} className="block">
              <Card className="flex items-center gap-3 transition-colors hover:border-primary/50">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{e.title}</div>
                  <div className="text-xs text-muted">{e.questionIds.length} questões · {e.durationMin} min · {formatDay(e.createdAt)}</div>
                </div>
                {last?.finishedAt ? (
                  <span className="text-lg font-bold">{last.score!.toFixed(1).replace(".", ",")}</span>
                ) : last ? (
                  <Badge tone="warning">Em andamento</Badge>
                ) : (
                  <Badge>Não iniciado</Badge>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
