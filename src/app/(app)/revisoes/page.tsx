import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { today } from "@/lib/core/dates";
import { QuestionCard, type QuestionData, type SourceRef } from "@/components/question-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Revisões e banco de erros" };

const PAGE = 10;

export default async function Page({ searchParams }: { searchParams: Promise<{ filtro?: string; prep?: string }> }) {
  const user = await requireReadyUser();
  const sp = await searchParams;
  const filter = sp.filtro === "erros" ? "erros" : "hoje";
  const day = today(user.timezone);
  const preps = await db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE" }, select: { id: true, title: true } });
  const prepFilter = preps.find((p) => p.id === sp.prep)?.id;

  const baseWhere = {
    userId: user.id,
    // itens são sempre do próprio aluno; inclui questões de grupos (simulados e listas compartilhadas)
    question: { topic: { subject: { preparation: prepFilter ? { id: prepFilter } : { status: "ACTIVE" as const } } } },
  };
  const [dueCount, errorCount, items] = await Promise.all([
    db.reviewItem.count({ where: { ...baseWhere, dueAt: { lte: day } } }),
    db.reviewItem.count({ where: { ...baseWhere, inErrorBank: true } }),
    db.reviewItem.findMany({
      where: filter === "erros" ? { ...baseWhere, inErrorBank: true } : { ...baseWhere, dueAt: { lte: day } },
      include: { question: { include: { topic: { include: { subject: true } } } } },
      orderBy: [{ inErrorBank: "desc" }, { dueAt: "asc" }],
      take: PAGE,
    }),
  ]);

  const tabHref = (f: string) => `/revisoes?filtro=${f}${prepFilter ? `&prep=${prepFilter}` : ""}`;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revisões</h1>
        <p className="text-sm text-muted">Questões que você errou voltam no dia seguinte; as que acertou voltam com menos frequência para consolidar.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={tabHref("hoje")} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", filter === "hoje" ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2")}>
          Para hoje <Badge className="ml-1">{dueCount}</Badge>
        </Link>
        <Link href={tabHref("erros")} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", filter === "erros" ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2")}>
          Banco de erros <Badge tone="danger" className="ml-1">{errorCount}</Badge>
        </Link>
        {preps.length > 1 && (
          <div className="ml-auto flex flex-wrap gap-1 text-xs">
            <Link href={`/revisoes?filtro=${filter}`} className={cn("rounded-full px-2 py-1", !prepFilter ? "bg-surface-2" : "text-muted")}>Todas</Link>
            {preps.map((p) => (
              <Link key={p.id} href={`/revisoes?filtro=${filter}&prep=${p.id}`} className={cn("rounded-full px-2 py-1", prepFilter === p.id ? "bg-surface-2" : "text-muted")}>{p.title}</Link>
            ))}
          </div>
        )}
      </div>

      {!items.length && (
        <Card className="text-center text-sm text-muted">
          {filter === "erros" ? "Seu banco de erros está vazio. As questões que você errar aparecem aqui." : "Nenhuma questão para revisar hoje. 🎉"}
        </Card>
      )}
      <div className="space-y-4">
        {items.map((it, i) => {
          const q: QuestionData = {
            id: it.question.id,
            type: it.question.type,
            statement: it.question.statement,
            options: (it.question.options as string[] | null) ?? null,
            sourceRefs: it.question.sourceRefs as SourceRef[],
            answered: null,
          };
          return (
            <div key={it.id} className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{it.question.topic.subject.name} · {it.question.topic.title}</span>
                {it.inErrorBank && <Badge tone="danger">Errou {it.lapses}x</Badge>}
              </div>
              <QuestionCard q={q} index={i} sessionId={null} />
            </div>
          );
        })}
      </div>
      {items.length === PAGE && <p className="text-center text-sm text-muted">Responda estas e recarregue a página para ver as próximas.</p>}
    </div>
  );
}
