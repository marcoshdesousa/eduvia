import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";
import { ENEM_TITLE } from "@/lib/enem/catalog";
import { lessonStates } from "@/lib/enem/progress";
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
  const enemLessons = [...(await lessonStates(user.id)).values()].flat();
  const enemDone = enemLessons.filter((l) => l.passed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Preparações</h1>
        <Link href="/preparacoes/nova" className={buttonClass("primary")}><Plus size={16} /> Nova</Link>
      </div>
      {/* preparação fixa da plataforma: todo mundo tem, não dá para apagar e não conta no limite do plano */}
      <Link href="/enem" aria-label={ENEM_TITLE}>
        <Card className="border-primary/50 bg-primary/5 transition-colors hover:border-primary">
          <div className="flex items-start justify-between gap-2">
            <h2 className="flex items-center gap-2 font-semibold"><GraduationCap size={20} className="text-primary" /> {ENEM_TITLE}</h2>
            <Badge tone="primary">Da plataforma</Badge>
          </div>
          <p className="mt-1 text-xs text-muted">Aulas de todas as matérias e questões reais do ENEM. Grátis e fora do limite do seu plano.</p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-muted"><span>Aulas concluídas</span><span>{enemDone}/{enemLessons.length}</span></div>
            <Progress value={enemLessons.length ? enemDone / enemLessons.length : 0} />
          </div>
        </Card>
      </Link>
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
