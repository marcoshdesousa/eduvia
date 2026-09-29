import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { masteryStatus } from "@/lib/core/spaced";
import { formatDay } from "@/lib/core/dates";
import { startAttemptAction } from "@/app/actions/exams";
import { SourceLinks, type SourceRef } from "@/components/question-card";
import { MasteryBadge, Progress } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExamRunner } from "./exam-runner";
import { canAccessExam, examRanking } from "@/lib/groups";

const LETTERS = "ABCDEFGH";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ resultado?: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const { resultado } = await searchParams;
  if (!(await canAccessExam(user.id, id))) notFound();
  const exam = await db.exam.findUniqueOrThrow({ where: { id }, include: { preparation: true, owner: { select: { handle: true } } } });
  const groupShares = await db.groupShare.findMany({ where: { type: "EXAM", resourceId: exam.id, group: { members: { some: { userId: user.id } } } }, include: { group: true } });
  const attempts = await db.examAttempt.findMany({ where: { examId: exam.id, userId: user.id }, orderBy: { startedAt: "desc" } });
  const open = attempts.find((a) => !a.finishedAt);
  const questions = await db.question.findMany({ where: { id: { in: exam.questionIds } }, include: { topic: { include: { subject: true } } } });
  const byId = new Map(questions.map((q) => [q.id, q]));
  const ordered = exam.questionIds.flatMap((qid) => (byId.get(qid) ? [byId.get(qid)!] : []));

  // prova em andamento
  if (open && !resultado) {
    return (
      <ExamRunner
        attemptId={open.id}
        title={exam.title}
        deadline={open.deadline.toISOString()}
        initialAnswers={(open.answers ?? {}) as Record<string, string>}
        questions={ordered.map((q) => ({ id: q.id, type: q.type, statement: q.statement, options: (q.options as string[]) ?? [], subject: q.topic.subject.name }))}
      />
    );
  }

  const result = attempts.find((a) => a.id === resultado && a.finishedAt) ?? attempts.find((a) => a.finishedAt);
  const header = (
    <div>
      <Link href="/simulados" className="text-sm text-muted hover:text-foreground">← Simulados</Link>
      <h1 className="mt-2 text-2xl font-bold">{exam.title}</h1>
      <p className="text-sm text-muted">
        {exam.ownerId === user.id ? exam.preparation.title : `Compartilhado por @${exam.owner.handle}`} · {exam.questionIds.length} questões · {exam.durationMin} min · {exam.style === "CERTO_ERRADO" ? "certo ou errado" : "múltipla escolha"}
      </p>
    </div>
  );

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {header}
        <Card className="space-y-3 text-sm">
          <p>Quando começar, o cronômetro não para. Ao terminar o tempo, a prova é entregue automaticamente com o que você marcou.</p>
          <p className="text-muted">Dica: faça como na prova real, sem consultar o material.</p>
          <form action={startAttemptAction.bind(null, exam.id)}>
            <Button size="lg" className="w-full">Começar simulado</Button>
          </form>
        </Card>
      </div>
    );
  }

  const answers = await db.attempt.findMany({ where: { userId: user.id, contextId: result.id } });
  const answerBy = new Map(answers.map((a) => [a.questionId, a]));
  const perSubject = (result.perSubject ?? []) as { subjectId: string; name: string; correct: number; total: number }[];
  const minutes = Math.floor((result.timeSpentSec ?? 0) / 60);
  const seconds = (result.timeSpentSec ?? 0) % 60;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Nota" value={result.score!.toFixed(1).replace(".", ",")} hint="de 0 a 10" />
        <Stat label="Acertos" value={`${result.correct}/${result.total}`} hint={`${Math.round((result.correct! / Math.max(1, result.total!)) * 100)}%`} />
        <Stat label="Tempo" value={`${minutes}min ${String(seconds).padStart(2, "0")}s`} hint={`de ${exam.durationMin} min`} />
        <Stat label="Tentativas" value={attempts.filter((a) => a.finishedAt).length} />
      </div>

      <Card>
        <CardTitle>Desempenho por disciplina</CardTitle>
        <ul className="mt-3 space-y-3">
          {perSubject.map((s) => {
            const acc = s.correct / Math.max(1, s.total);
            const status = masteryStatus(Math.max(s.total, 3), acc);
            return (
              <li key={s.subjectId}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="flex items-center gap-2 text-muted">{s.correct}/{s.total} · {Math.round(acc * 100)}% <MasteryBadge status={status} /></span>
                </div>
                <Progress value={acc} tone={status === "CRITICO" ? "danger" : status === "EM_DESENVOLVIMENTO" ? "warning" : "success"} />
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-2">
        <form action={startAttemptAction.bind(null, exam.id)}><Button variant="outline">Refazer este simulado</Button></form>
        <Link href="/simulados/novo" className={buttonClass("primary")}>Novo simulado</Link>
        {result.correct! < result.total! && <Link href="/revisoes?filtro=erros" className={buttonClass("ghost")}>Treinar os erros</Link>}
      </div>

      {await Promise.all(
        groupShares.map(async (gs) => {
          const ranking = await examRanking(exam.id, gs.groupId);
          return (
            <Card key={gs.id}>
              <CardTitle>Ranking — {gs.group.name}</CardTitle>
              <ol className="mt-3 divide-y divide-border text-sm">
                {ranking.map((r, i) => (
                  <li key={r.user.id} className={cn("flex items-center gap-3 py-2", r.user.id === user.id && "font-semibold")}>
                    <span className="w-6 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
                    <Link href={`/u/${r.user.handle}`} className="flex-1 truncate hover:text-primary">{r.user.name} <span className="text-muted">@{r.user.handle}</span></Link>
                    <span className="text-muted">{r.correct}/{r.total} · {Math.floor(r.timeSpentSec / 60)}min</span>
                    <span className="w-10 text-right font-bold">{r.score.toFixed(1).replace(".", ",")}</span>
                  </li>
                ))}
              </ol>
            </Card>
          );
        }),
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Gabarito comentado</h2>
        {ordered.map((q, i) => {
          const a = answerBy.get(q.id);
          const options = (q.options as string[]) ?? [];
          const given = a?.answer ?? "";
          return (
            <Card key={q.id} className="space-y-3">
              <div className="flex items-start justify-between gap-2 text-sm">
                <span className="text-muted">Questão {i + 1} · {q.topic.subject.name}</span>
                {a?.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 size={16} /> Acertou</span>
                ) : given ? (
                  <span className="inline-flex items-center gap-1 text-danger"><XCircle size={16} /> Errou</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted"><Clock size={16} /> Em branco</span>
                )}
              </div>
              <p className="whitespace-pre-line leading-relaxed">{q.statement}</p>
              <ul className="space-y-1.5 text-sm">
                {options.map((o, oi) => {
                  const isRight = q.correctAnswer === String(oi);
                  const isChosen = given === String(oi);
                  return (
                    <li key={oi} className={cn("flex gap-2 rounded-lg border px-3 py-2", isRight ? "border-success bg-success/10" : isChosen ? "border-danger bg-danger/10" : "border-border")}>
                      <span className="font-semibold">{exam.style === "CERTO_ERRADO" ? (oi === 0 ? "C" : "E") : LETTERS[oi]}</span>
                      <span className="flex-1">{o}</span>
                      {isRight && <span className="text-xs text-success">correta</span>}
                      {isChosen && !isRight && <span className="text-xs text-danger">sua resposta</span>}
                    </li>
                  );
                })}
              </ul>
              <p className="rounded-lg bg-surface-2 p-3 text-sm"><span className="font-medium">Comentário: </span>{q.explanation}</p>
              <SourceLinks refs={q.sourceRefs as SourceRef[]} />
            </Card>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted">Entregue em {formatDay(result.finishedAt!, { day: "2-digit", month: "long", year: "numeric" })}. Questões erradas e em branco foram para o banco de erros.</p>
    </div>
  );
}
