import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lock, PlayCircle, RotateCcw } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { areaOf, ENEM_TITLE, findMateria, LESSON_QUESTIONS } from "@/lib/enem/catalog";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { lessonStates } from "@/lib/enem/progress";
import { Badge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const pct = (x: number) => `${Math.round(x * 100)}%`;

export async function generateMetadata({ params }: { params: Promise<{ materia: string }> }) {
  const m = findMateria((await params).materia);
  return { title: m ? `${m.name} · ${ENEM_TITLE}` : ENEM_TITLE };
}

export default async function Page({ params }: { params: Promise<{ materia: string }> }) {
  const user = await requireReadyUser();
  const m = findMateria((await params).materia);
  if (!m) notFound();
  await ensureEnemCatalog();
  const lessons = (await lessonStates(user.id, [m])).get(m.slug) ?? [];
  const done = lessons.filter((l) => l.passed).length;
  const graded = lessons.filter((l) => l.best !== null);
  const avg = graded.length ? graded.reduce((s, l) => s + (l.best ?? 0), 0) / graded.length : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/enem" className="text-sm text-muted hover:text-foreground">← {ENEM_TITLE}</Link>
        <p className="mt-2 text-sm text-muted">{areaOf(m.area).name}</p>
        <h1 className="text-2xl font-bold">{m.name}</h1>
      </div>

      <Card className="space-y-2">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span className="font-medium">{done} de {lessons.length} aulas concluídas ({pct(done / Math.max(1, lessons.length))})</span>
          {avg !== null && <span className="text-muted">Média das suas notas: {pct(avg)}</span>}
        </div>
        <Progress value={done / Math.max(1, lessons.length)} />
        <p className="text-xs text-muted">Cada aula tem um texto (com o robô lendo para você) e {LESSON_QUESTIONS} questões reais do ENEM de {m.name}. Tire 75% ou mais para liberar a próxima. Pode refazer quando quiser para melhorar a nota: as questões mudam a cada tentativa.</p>
      </Card>

      <ol className="space-y-3">
        {lessons.map((l) => (
          <li key={l.topicId}>
            <Card className={cn("flex flex-wrap items-center gap-3", !l.unlocked && "opacity-70")}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold", l.passed ? "bg-success/15 text-success" : l.unlocked ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted")}>
                {l.passed ? <CheckCircle2 size={18} /> : !l.unlocked ? <Lock size={16} /> : l.index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">Aula {l.index + 1} · {l.title}</p>
                <p className="text-xs text-muted">
                  {!l.unlocked
                    ? "Bloqueada: tire 75% na aula anterior"
                    : l.best === null
                      ? "Ainda não feita"
                      : `Melhor nota: ${pct(l.best)}${l.last !== null && l.last !== l.best ? ` · última: ${pct(l.last)}` : ""} · ${l.tries} tentativa(s)`}
                </p>
              </div>
              {l.passed ? <Badge tone="success">Aprovada</Badge> : l.best !== null ? <Badge tone="warning">Abaixo de 75%</Badge> : null}
              {l.unlocked && (
                <Link href={`/enem/aula/${l.topicId}`} className={buttonClass(l.passed ? "outline" : "primary", "sm")}>
                  {l.passed ? <><RotateCcw size={14} /> Rever / refazer</> : l.sessionId ? <><PlayCircle size={14} /> Continuar</> : <><PlayCircle size={14} /> Começar</>}
                </Link>
              )}
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
