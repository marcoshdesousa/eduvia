import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { parseQuickConfig, type QuickQuestion } from "@/lib/quick-test";
import { buttonClass } from "@/components/ui/button";
import { Card, Stat } from "@/components/ui/card";
import { QuickTestPlayer } from "./quick-test-player";

export const metadata = { title: "Teste rápido" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const run = await db.gameRun.findFirst({ where: { id, userId: user.id, gameSlug: "teste-rapido" } });
  if (!run) notFound();
  const cfg = parseQuickConfig(run.config);
  const [questions, attempts] = await Promise.all([
    db.question.findMany({ where: { id: { in: run.questionIds } } }),
    db.attempt.findMany({ where: { contextId: run.id, userId: user.id } }),
  ]);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const ordered = run.questionIds.flatMap((qid) => (byId.get(qid) ? [byId.get(qid)!] : []));
  const answered = new Map(attempts.map((a) => [a.questionId, a]));

  if (!run.endedAt) {
    const pending: QuickQuestion[] = ordered
      .filter((q) => !answered.has(q.id))
      .map((q) => ({ id: q.id, type: q.type, statement: q.statement, options: (q.options as string[] | null) ?? [] }));
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/teste-rapido" className="text-sm text-muted hover:text-foreground">← Testes rápidos</Link>
        <QuickTestPlayer
          runId={run.id}
          name={run.name ?? "Teste rápido"}
          seconds={cfg.seconds}
          questions={pending}
          total={ordered.length}
          answeredBefore={ordered.length - pending.length}
          correctBefore={attempts.filter((a) => a.isCorrect).length}
        />
      </div>
    );
  }

  const correct = run.correct;
  const total = ordered.length;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/teste-rapido" className="text-sm text-muted hover:text-foreground">← Testes rápidos</Link>
      <Card className="text-center">
        <p className="text-sm text-muted">{run.name ?? "Teste rápido"} · {cfg.count} perguntas · {cfg.seconds}s cada</p>
        <p className="font-display mt-2 text-5xl font-extrabold text-primary">{correct}/{total}</p>
        <p className="mt-1 font-medium">{correct === total ? "Gabaritou! 🎉" : correct >= total * 0.7 ? "Mandou bem!" : "Os erros foram para o banco de erros. Revise e tente um novo teste."}</p>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Acertos" value={correct} />
        <Stat label="Erros" value={total - correct} />
        <Stat label="Tempo médio" value={run.avgTimeMs ? `${(run.avgTimeMs / 1000).toFixed(1)}s` : "—"} />
      </div>
      <Card>
        <ol className="space-y-4">
          {ordered.map((q, i) => {
            const a = answered.get(q.id);
            const opts = (q.options as string[] | null) ?? [];
            const mine = a?.answer ? opts[Number(a.answer)] ?? a.answer : null;
            const right = opts[Number(q.correctAnswer)] ?? q.correctAnswer;
            return (
              <li key={q.id} className="space-y-1 text-sm">
                <p className="font-medium">{i + 1}. {q.statement}</p>
                {a?.isCorrect ? (
                  <p className="flex items-start gap-1.5 text-success"><Check size={16} className="mt-0.5 shrink-0" /> {right}</p>
                ) : (
                  <>
                    <p className="flex items-start gap-1.5 text-danger"><X size={16} className="mt-0.5 shrink-0" /> {mine ?? "Sem resposta (tempo esgotado)"}</p>
                    <p className="flex items-start gap-1.5 text-success"><Check size={16} className="mt-0.5 shrink-0" /> {right}</p>
                  </>
                )}
                {!a?.isCorrect && q.explanation && <p className="text-muted">{q.explanation}</p>}
              </li>
            );
          })}
        </ol>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Link href="/teste-rapido#novo" className={buttonClass("primary")}>Criar outro teste rápido</Link>
        {correct < total && <Link href="/revisoes?filtro=erros" className={buttonClass("outline")}>Ver banco de erros</Link>}
      </div>
    </div>
  );
}
