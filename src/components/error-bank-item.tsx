"use client";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpenCheck, Check, FileText, Loader2 } from "lucide-react";
import { lessonAction } from "@/app/actions/lesson";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form";
import type { SourceRef } from "@/components/question-card";

/** Questão do banco de erros: mostra a resposta certa e, sob pedido, uma aula curta com base no material do aluno. */
export function ErrorBankItem({
  questionId,
  subject,
  statement,
  correct,
  explanation,
  lapses,
  sources,
  initialLesson,
}: {
  questionId: string;
  subject: string;
  statement: string;
  correct: string;
  explanation: string;
  lapses: number;
  sources: SourceRef[];
  initialLesson: string | null;
}) {
  const [lesson, setLesson] = useState(initialLesson);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{subject}</span>
        <Badge tone="danger">Errou {lapses}x</Badge>
      </div>
      <p className="font-medium">{statement}</p>
      <p className="flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm">
        <Check size={16} className="mt-0.5 shrink-0 text-success" /> <span><strong>Resposta certa:</strong> {correct}</span>
      </p>
      {explanation && <p className="text-sm text-muted">{explanation}</p>}
      {sources.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {sources.map((r, i) => (
            <a key={i} href={`/api/materials/${r.materialId}/file?page=${r.pageStart}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <FileText size={12} /> {r.title}, p. {r.pageStart}
            </a>
          ))}
        </div>
      )}
      {lesson ? (
        <div className="prose-study rounded-lg bg-surface-2 p-3 text-sm">
          <ReactMarkdown>{lesson}</ReactMarkdown>
        </div>
      ) : (
        <>
          <FormError message={error} />
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const r = await lessonAction(questionId);
                if ("error" in r) setError(r.error);
                else setLesson(r.lesson);
              })
            }
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <BookOpenCheck size={16} />} Aprender o certo com o meu material
          </Button>
        </>
      )}
    </Card>
  );
}
