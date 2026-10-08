import Link from "next/link";
import { BookOpenCheck, ChevronRight, Info, PlayCircle, Timer } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { getAccess } from "@/lib/billing";
import { lessonsAllowed } from "@/lib/plans";
import { AREAS, ENEM_TITLE, MATERIAS } from "@/lib/enem/catalog";
import { ensureEnemCatalog } from "@/lib/enem/bank";
import { lessonStates } from "@/lib/enem/progress";
import { studyGeneralAction } from "@/app/actions/enem";
import { Badge, Progress } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata = { title: ENEM_TITLE };

export default async function Page() {
  const user = await requireReadyUser();
  await ensureEnemCatalog();
  const access = await getAccess(user);
  const states = await lessonStates(user.id, undefined, access.limits.lessonsPct);
  const all = [...states.values()].flat();
  const passed = all.filter((l) => l.passed).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{ENEM_TITLE}</h1>
          <Badge tone="primary">{access.limits.lessonsPct >= 100 ? "Todas as aulas liberadas" : `${access.limits.lessonsPct}% das aulas liberadas`}</Badge>
        </div>
        <p className="text-sm text-muted">Aulas de todas as matérias do ENEM e de redação, com quiz em cada aula, e questões reais das provas (2009 a 2023) nos simulados.</p>
      </div>

      <Card className="flex gap-3 border-primary/40 bg-primary/5 text-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="font-semibold">Como estudar aqui</p>
          <p className="text-muted">
            Estude as aulas de cada matéria: leia o texto (ou ouça o robô) e responda o quiz da aula, com perguntas de marcar e de escrever
            sobre o que você estudou. Tire pelo menos 75% para liberar a próxima aula. O que errar vai para o banco de erros. Depois, treine
            com os simulados, que têm questões reais do ENEM e o tempo da prova.
          </p>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <form action={studyGeneralAction}>
          <Button size="lg" className="w-full"><PlayCircle size={18} /> Estudar geral</Button>
          <p className="mt-1 text-center text-xs text-muted">Vai para a próxima aula da matéria em que você está mais atrasado.</p>
        </form>
        <div>
          <Link href="/simulados/enem" className={buttonClass("outline", "lg", "w-full")}><Timer size={18} /> Simulado ENEM</Link>
          <p className="mt-1 text-center text-xs text-muted">Prova do 1º ou do 2º dia, com o tempo do ENEM.</p>
        </div>
      </div>

      <Card>
        <div className="mb-1 flex justify-between text-sm"><span className="font-medium">Seu progresso</span><span className="text-muted">{passed}/{all.length} aulas</span></div>
        <Progress value={all.length ? passed / all.length : 0} />
      </Card>

      {[{ key: "redacao", name: "Redação" }, ...AREAS].map((area) => {
        const materias = MATERIAS.filter((m) => (area.key === "redacao" ? m.slug === "redacao" : m.area === area.key && m.slug !== "redacao"));
        if (!materias.length) return null;
        return (
          <section key={area.key} className="space-y-3">
            <h2 className="text-lg font-bold">{area.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {materias.map((m) => {
                const ls = states.get(m.slug) ?? [];
                const done = ls.filter((l) => l.passed).length;
                const free = lessonsAllowed(ls.length, access.limits.lessonsPct);
                return (
                  <Link key={m.slug} href={`/enem/${m.slug}`} aria-label={`Matéria ${m.name}`}>
                    <Card className="h-full space-y-3 transition-colors hover:border-primary/50">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="flex items-center gap-2"><BookOpenCheck size={18} className="text-primary" /> {m.name}</CardTitle>
                        <ChevronRight size={18} className="text-muted" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs text-muted">
                          <span>{ls.length} aulas{free < ls.length ? ` · ${free} liberadas` : ""}</span>
                          <span>{done}/{ls.length} concluídas · {Math.round((done / Math.max(1, ls.length)) * 100)}%</span>
                        </div>
                        <Progress value={done / Math.max(1, ls.length)} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
