import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Crown, Lock, PlayCircle, RotateCcw } from "lucide-react";
import { getAccess } from "@/lib/billing";
import { lessonsAllowed } from "@/lib/plans";
import { requireReadyUser } from "@/lib/session";
import { areaOf, ENEM_TITLE, findMateria } from "@/lib/enem/catalog";
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
  const access = await getAccess(user);
  const lessons = (await lessonStates(user.id, [m], access.limits.lessonsPct)).get(m.slug) ?? [];
  const allowed = lessonsAllowed(lessons.length, access.limits.lessonsPct);
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
        <p className="text-xs text-muted">Cada aula tem um texto (com o robô lendo para você) e um quiz sobre o que você estudou. Tire 75% ou mais para liberar a próxima. Pode refazer quando quiser para melhorar a nota.</p>
      </Card>

      {allowed < lessons.length && (
        <Card className="flex flex-wrap items-center gap-3 border-primary/40 bg-primary/5 text-sm">
          <Crown size={18} className="shrink-0 text-primary" />
          <p className="min-w-0 flex-1">
            Seu plano libera {allowed} de {lessons.length} aulas desta matéria. {access.limits.lessonsPct < 50 ? "O Básico libera metade e o Completo libera todas." : "O Completo libera todas."}
          </p>
          <Link href="/assinatura" className={buttonClass("primary", "sm")}>Ver planos</Link>
        </Card>
      )}

      <ol className="space-y-3">
        {lessons.map((l) => (
          <li key={l.topicId}>
            <Card className={cn("flex flex-wrap items-center gap-3", (!l.unlocked || l.planLock) && "opacity-70")}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold", l.passed ? "bg-success/15 text-success" : l.planLock ? "bg-surface-2 text-primary" : l.unlocked ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted")}>
                {l.passed ? <CheckCircle2 size={18} /> : l.planLock ? <Crown size={16} /> : !l.unlocked ? <Lock size={16} /> : l.index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">Aula {l.index + 1} · {l.title}</p>
                <p className="text-xs text-muted">
                  {l.planLock
                    ? `Bloqueada: faz parte do plano ${l.planLock}`
                    : !l.unlocked
                    ? "Bloqueada: tire 75% na aula anterior"
                    : l.best === null
                      ? "Ainda não feita"
                      : `Melhor nota: ${pct(l.best)}${l.last !== null && l.last !== l.best ? ` · última: ${pct(l.last)}` : ""} · ${l.tries} tentativa(s)`}
                </p>
              </div>
              {l.passed ? <Badge tone="success">Aprovada</Badge> : l.best !== null ? <Badge tone="warning">Abaixo de 75%</Badge> : null}
              {l.planLock ? (
                <Link href="/assinatura" className={buttonClass("outline", "sm")}><Crown size={14} /> Liberar</Link>
              ) : l.unlocked && (
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
