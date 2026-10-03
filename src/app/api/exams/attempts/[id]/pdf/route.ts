import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { examPdf } from "@/lib/printable-pdf";

/** Simulado em PDF com as respostas que o aluno marcou (sem mostrar certo ou errado). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const attempt = await db.examAttempt.findFirst({ where: { id: (await params).id, userId: user.id }, include: { exam: true } });
  if (!attempt) return jsonError("Simulado não encontrado", 404);
  const questions = await db.question.findMany({ where: { id: { in: attempt.exam.questionIds } }, select: { id: true, statement: true, options: true } });
  const byId = new Map(questions.map((q) => [q.id, q]));
  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const bytes = await examPdf({
    student: { name: user.name, handle: user.handle },
    title: attempt.exam.title,
    startedAt: attempt.startedAt,
    finishedAt: attempt.finishedAt,
    questions: attempt.exam.questionIds.flatMap((id) => {
      const q = byId.get(id);
      return q ? [{ statement: q.statement, options: (q.options as string[] | null) ?? null, answer: answers[id] ?? null }] : [];
    }),
    tz: user.timezone,
  });
  return new Response(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="simulado-eduvia.pdf"`, "Cache-Control": "private, no-store" },
  });
}
