import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Play, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { ensurePlanFresh, latestPlan } from "@/lib/plan";
import { PROFILES } from "@/lib/core/profiles";
import { addDays, diffDays, formatDay, keyFromDay, today, weekdayShort } from "@/lib/core/dates";
import { listMaterials } from "@/lib/materials/list";
import { MaterialsPanel } from "@/components/materials-panel";
import { Badge, MasteryBadge, Progress } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatMinutes } from "@/lib/utils";
import { PrepSettings } from "./settings";
import { RegenerateButton } from "./regenerate-button";

const TABS = [
  { key: "plano", label: "Plano" },
  { key: "materiais", label: "Materiais" },
  { key: "assuntos", label: "Assuntos" },
  { key: "ajustes", label: "Ajustes" },
] as const;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aba?: string; nova?: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const sp = await searchParams;
  const prep = await db.preparation.findFirst({ where: { id, userId: user.id }, include: { editalAnalysis: true } });
  if (!prep) notFound();
  if (prep.status === "ACTIVE") await ensurePlanFresh(prep, user.timezone);

  const materials = await listMaterials(prep.id);
  const tab = TABS.find((t) => t.key === sp.aba)?.key ?? (sp.nova || materials.length === 0 ? "materiais" : "plano");
  const day = today(user.timezone);
  const profile = PROFILES[prep.studentType];
  const syllabusRole = prep.studentType === "CONCURSO" ? "EDITAL" : ["FACULDADE", "ENEM_VESTIBULAR", "CURSINHO", "MEDIO", "FUNDAMENTAL"].includes(prep.studentType) ? "EMENTA" : null;
  const needsEdital = prep.studentType === "CONCURSO" && !materials.some((m) => m.role === "EDITAL");

  const [plan, subjects, mastery] = await Promise.all([
    latestPlan(prep.id),
    db.subject.findMany({ where: { preparationId: prep.id }, include: { topics: { orderBy: { order: "asc" } } }, orderBy: [{ weight: "desc" }, { order: "asc" }] }),
    db.topicMastery.findMany({ where: { userId: user.id, topic: { subject: { preparationId: prep.id } } } }),
  ]);
  const masteryBy = new Map(mastery.map((m) => [m.topicId, m]));
  const topicCount = subjects.reduce((s, x) => s + x.topics.length, 0);
  const doneCount = mastery.filter((m) => m.studyDone).length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/preparacoes" className="text-sm text-muted hover:text-foreground">← Preparações</Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{prep.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <Badge tone="primary">{profile.label}</Badge>
              {prep.editalAnalysis?.banca && <Badge>Banca: {prep.editalAnalysis.banca}</Badge>}
              <span className="inline-flex items-center gap-1"><Clock size={14} />{formatMinutes(prep.dailyMinutes)}/dia · {prep.studyDays.map(weekdayShort).join(", ")} · {prep.studyTime}</span>
              {prep.examDate && (
                <span className="inline-flex items-center gap-1"><CalendarDays size={14} />Prova em {formatDay(prep.examDate, { day: "2-digit", month: "short", year: "numeric" })} ({diffDays(prep.examDate, day)} dias)</span>
              )}
              {prep.status === "ARCHIVED" && <Badge tone="warning">Arquivada</Badge>}
            </div>
          </div>
        </div>
        {topicCount > 0 && (
          <div className="mt-4 max-w-md">
            <div className="mb-1 flex justify-between text-xs text-muted"><span>Assuntos concluídos</span><span>{doneCount}/{topicCount}</span></div>
            <Progress value={doneCount / topicCount} />
          </div>
        )}
      </div>

      {needsEdital && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
          <div>Envie o <strong>edital</strong> na aba Materiais: é com ele que o plano identifica as disciplinas, os pesos e a banca.</div>
        </div>
      )}
      {plan && plan.feasibility !== "OK" && plan.notes && (
        <div className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", plan.feasibility === "INSUFICIENTE" ? "border-danger/50 bg-danger/10" : "border-warning/50 bg-warning/10")}>
          <AlertTriangle size={18} className={cn("mt-0.5 shrink-0", plan.feasibility === "INSUFICIENTE" ? "text-danger" : "text-warning")} />
          <div>{plan.notes}</div>
        </div>
      )}

      <nav className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/preparacoes/${prep.id}?aba=${t.key}`}
            className={cn("whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "plano" && <PlanTab preparationId={prep.id} day={day} hasTopics={topicCount > 0} />}

      {tab === "materiais" && (
        <MaterialsPanel
          preparationId={prep.id}
          initial={materials}
          subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
          syllabusRole={syllabusRole}
          syllabusRequired={prep.studentType === "CONCURSO"}
        />
      )}

      {tab === "assuntos" && (
        <div className="space-y-4">
          {!subjects.length && <p className="text-sm text-muted">Os assuntos aparecem aqui depois que os materiais forem processados.</p>}
          {subjects.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">{s.name}</h2>
                {s.weight !== 1 && <Badge>peso {s.weight.toFixed(1)}</Badge>}
              </div>
              <ul className="mt-3 divide-y divide-border">
                {s.topics.map((t) => {
                  const m = masteryBy.get(t.id);
                  return (
                    <li key={t.id} className="flex items-center gap-3 py-2 text-sm">
                      {m?.studyDone ? <CheckCircle2 size={16} className="shrink-0 text-success" /> : <span className="size-4 shrink-0 rounded-full border border-border" />}
                      <span className="min-w-0 flex-1">{t.title}</span>
                      <span className="hidden text-xs text-muted sm:inline">{formatMinutes(t.estimatedMinutes)}</span>
                      {m && m.status !== "SEM_DADOS" && <MasteryBadge status={m.status} />}
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === "ajustes" && (
        <PrepSettings
          prep={{
            id: prep.id,
            title: prep.title,
            status: prep.status,
            dailyMinutes: prep.dailyMinutes,
            studyDays: prep.studyDays,
            studyTime: prep.studyTime,
            examDate: prep.examDate ? keyFromDay(prep.examDate) : "",
            reviewIntervals: prep.reviewIntervals.join(", "),
          }}
        />
      )}
    </div>
  );
}

async function PlanTab({ preparationId, day, hasTopics }: { preparationId: string; day: Date; hasTopics: boolean }) {
  const sessions = await db.plannedSession.findMany({
    where: { plan: { preparationId }, date: { gte: addDays(day, -1), lt: addDays(day, 21) }, status: { in: ["PENDING", "DONE", "MISSED"] } },
    include: { topic: { include: { subject: true } } },
    orderBy: [{ date: "asc" }, { order: "asc" }],
  });
  const byDay = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const k = keyFromDay(s.date);
    byDay.set(k, [...(byDay.get(k) ?? []), s]);
  }
  const plan = await latestPlan(preparationId);

  if (!hasTopics) {
    return (
      <Card className="text-center">
        <p className="font-medium">Seu plano aparece aqui</p>
        <p className="mt-1 text-sm text-muted">Envie os materiais na aba Materiais. Assim que forem processados, o plano é montado automaticamente.</p>
        <Link href={`/preparacoes/${preparationId}?aba=materiais`} className={buttonClass("primary", "md", "mt-4")}>Enviar materiais</Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          {plan && `Conteúdo novo restante: ${formatMinutes(plan.totalMinutes)}`}
          {plan?.missingMinutes ? ` · não cabe até a prova: ${formatMinutes(plan.missingMinutes)}` : ""}
        </span>
        <RegenerateButton preparationId={preparationId} />
      </div>
      {!byDay.size && <Card className="text-sm text-muted">Nada agendado nas próximas semanas. Todo o conteúdo já foi estudado — as revisões aparecem aqui quando vencerem.</Card>}
      {[...byDay.entries()].map(([k, items]) => {
        const d = new Date(`${k}T00:00:00Z`);
        const isToday = k === keyFromDay(day);
        return (
          <div key={k}>
            <div className={cn("mb-2 text-sm font-semibold", isToday && "text-primary")}>
              {isToday ? "Hoje" : k === keyFromDay(addDays(day, 1)) ? "Amanhã" : k === keyFromDay(addDays(day, -1)) ? "Ontem" : formatDay(d, { weekday: "long", day: "2-digit", month: "short" })}
              <span className="ml-2 font-normal text-muted">{formatMinutes(items.reduce((s, i) => s + i.durationMin, 0))}</span>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
              {items.map((s) => (
                <li key={s.id} className="flex items-center gap-3 p-3">
                  {s.kind === "REVIEW" ? <RotateCcw size={16} className="shrink-0 text-warning" /> : <Play size={16} className="shrink-0 text-primary" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.topic.title}</div>
                    <div className="truncate text-xs text-muted">
                      {s.topic.subject.name} · {s.kind === "REVIEW" ? (s.reviewNumber ? `Revisão R${s.reviewNumber}` : "Reforço") : s.partCount > 1 ? `Parte ${s.part}/${s.partCount}` : "Estudo"} · {formatMinutes(s.durationMin)}
                    </div>
                  </div>
                  {s.status === "DONE" ? (
                    <Badge tone="success">Feito</Badge>
                  ) : s.status === "MISSED" ? (
                    <Badge tone="danger">Perdida</Badge>
                  ) : isToday ? (
                    <Link href={`/estudar/${s.id}`} className={buttonClass("primary", "sm")}>Estudar</Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
