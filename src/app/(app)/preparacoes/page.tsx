import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { PROFILES } from "@/lib/core/profiles";
import { diffDays, formatDay, today } from "@/lib/core/dates";
import { Badge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMinutes } from "@/lib/utils";

export const metadata = { title: "Preparações" };

export default async function Page() {
  const user = await requireReadyUser();
  const preps = await db.preparation.findMany({
    where: { userId: user.id },
    include: { _count: { select: { materials: true } }, subjects: { include: { _count: { select: { topics: true } } } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  const done = await db.topicMastery.groupBy({
    by: ["topicId"],
    where: { userId: user.id, studyDone: true },
  });
  const doneSet = new Set(done.map((d) => d.topicId));
  const topicsByPrep = await db.topic.findMany({ where: { subject: { preparation: { userId: user.id } } }, select: { id: true, subject: { select: { preparationId: true } } } });
  const day = today(user.timezone);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Preparações</h1>
        <Link href="/preparacoes/nova" className={buttonClass("primary")}><Plus size={16} /> Nova</Link>
      </div>
      {!preps.length && (
        <Card className="text-center">
          <p className="font-medium">Você ainda não tem nenhuma preparação.</p>
          <p className="mt-1 text-sm text-muted">Crie uma para cada objetivo: um concurso, uma matéria da escola ou da faculdade...</p>
          <Link href="/preparacoes/nova" className={buttonClass("primary", "md", "mt-4")}>Criar preparação</Link>
        </Card>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {preps.map((p) => {
          const topics = topicsByPrep.filter((t) => t.subject.preparationId === p.id);
          const finished = topics.filter((t) => doneSet.has(t.id)).length;
          return (
            <Link key={p.id} href={`/preparacoes/${p.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{p.title}</h2>
                  {p.status === "ARCHIVED" && <Badge tone="warning">Arquivada</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                  <Badge tone="primary">{PROFILES[p.studentType].label}</Badge>
                  <span>{formatMinutes(p.dailyMinutes)}/dia</span>
                  <span>{p._count.materials} material(is)</span>
                  {p.examDate && <span>Prova {formatDay(p.examDate)} · {diffDays(p.examDate, day)} dias</span>}
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted"><span>Assuntos concluídos</span><span>{finished}/{topics.length}</span></div>
                  <Progress value={topics.length ? finished / topics.length : 0} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
