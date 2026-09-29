import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { RUBRICS, type Annotation, type PlacedAnnotation } from "@/lib/core/essay";
import { formatDay } from "@/lib/core/dates";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/badge";
import { AnnotatedEssay } from "./annotated-essay";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  const essay = await db.essay.findFirst({ where: { id: (await params).id, userId: user.id } });
  if (!essay) notFound();
  const rubric = RUBRICS[essay.rubric];
  const ev = essay.evaluation as {
    criteria: { key: string; name: string; max: number; score: number; comment: string }[];
    annotations: PlacedAnnotation[];
    unplaced: Annotation[];
    strengths: string[];
    tips: string[];
    summary: string;
  } | null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/redacao" className="text-sm text-muted hover:text-foreground">← Redação</Link>
        <h1 className="mt-2 text-2xl font-bold">{essay.theme}</h1>
        <p className="text-sm text-muted">{rubric.label} · {formatDay(essay.createdAt, { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>

      {!ev ? (
        <Card className="text-sm">
          {essay.status === "ERROR" ? "A correção falhou. Copie seu texto e envie de novo em Nova redação." : "Corrigindo..."}
          <pre className="mt-3 whitespace-pre-wrap font-[inherit] text-muted">{essay.text}</pre>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card className="flex flex-col items-center justify-center text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-muted">Nota</div>
              <div className="mt-1 text-5xl font-extrabold text-primary">{essay.score?.toLocaleString("pt-BR")}</div>
              <div className="text-sm text-muted">de {essay.maxScore}</div>
              <p className="mt-3 text-sm">{ev.summary}</p>
            </Card>
            <Card>
              <CardTitle>Critérios</CardTitle>
              <ul className="mt-3 space-y-3">
                {ev.criteria.map((c) => {
                  const ratio = c.score / c.max;
                  return (
                    <li key={c.key}>
                      <div className="mb-1 flex justify-between gap-2 text-sm">
                        <span className="font-medium">{c.name}</span>
                        <span className="shrink-0 text-muted">{c.score.toLocaleString("pt-BR")}/{c.max}</span>
                      </div>
                      <Progress value={ratio} tone={ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"} />
                      {c.comment && <p className="mt-1 text-xs text-muted">{c.comment}</p>}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <AnnotatedEssay text={essay.text} annotations={ev.annotations} unplaced={ev.unplaced} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardTitle>Pontos fortes</CardTitle>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{ev.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </Card>
            <Card>
              <CardTitle>Dicas para melhorar</CardTitle>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{ev.tips.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </Card>
          </div>
          <Link href="/redacao/nova" className={buttonClass("primary")}>Escrever outra</Link>
        </>
      )}
    </div>
  );
}
