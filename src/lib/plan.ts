// Geração e atualização do plano de estudo de uma preparação (usa o planner puro de core/).
import { db } from "@/lib/db";
import { buildPlan, splitParts, type PlanReview, type PlanTopic } from "@/lib/core/planner";
import { addDays, today, keyFromDay } from "@/lib/core/dates";

export async function generatePlan(preparationId: string) {
  const prep = await db.preparation.findUnique({
    where: { id: preparationId },
    include: { user: true, subjects: { include: { topics: true } } },
  });
  if (!prep || prep.status !== "ACTIVE") return null;
  const tz = prep.user.timezone;
  const start = today(tz);
  const topicIds = prep.subjects.flatMap((s) => s.topics.map((t) => t.id));

  const [mastery, doneStudy, pendingReviews, doneToday] = await Promise.all([
    db.topicMastery.findMany({ where: { userId: prep.userId, topicId: { in: topicIds } } }),
    db.plannedSession.findMany({
      where: { topicId: { in: topicIds }, kind: "STUDY", status: "DONE" },
      orderBy: [{ date: "desc" }, { part: "desc" }],
    }),
    db.topicReview.findMany({ where: { userId: prep.userId, topicId: { in: topicIds }, doneAt: null } }),
    db.plannedSession.findMany({ where: { plan: { preparationId }, date: start, status: "DONE" } }),
  ]);
  const masteryBy = new Map(mastery.map((m) => [m.topicId, m]));

  const topics: PlanTopic[] = [];
  for (const s of prep.subjects) {
    for (const t of s.topics) {
      const m = masteryBy.get(t.id);
      if (m?.studyDone) continue;
      const newCount = splitParts(t.estimatedMinutes, prep.dailyMinutes).length;
      const lastDone = doneStudy.find((d) => d.topicId === t.id);
      const completedParts = lastDone ? Math.min(newCount - 1, Math.round((lastDone.part / lastDone.partCount) * newCount)) : 0;
      topics.push({
        id: t.id,
        subjectId: s.id,
        subjectWeight: s.weight,
        order: s.order * 10_000 + t.order,
        estimatedMinutes: t.estimatedMinutes,
        weight: t.weight,
        difficulty: t.difficulty,
        mastery: m?.status,
        completedParts,
      });
    }
  }

  const reviews: PlanReview[] = pendingReviews.map((r) => ({ topicId: r.topicId, reviewNumber: r.reviewNumber, dueDate: r.dueDate }));
  // Reforço extra para assuntos já estudados com desempenho crítico e sem revisão nos próximos dias.
  for (const m of mastery) {
    if (m.studyDone && m.status === "CRITICO" && !pendingReviews.some((r) => r.topicId === m.topicId && r.dueDate <= addDays(start, 3))) {
      reviews.push({ topicId: m.topicId, reviewNumber: 0, dueDate: start });
    }
  }

  const result = buildPlan({
    start,
    examDate: prep.examDate,
    studyDays: prep.studyDays,
    dailyMinutes: prep.dailyMinutes,
    reviewIntervals: prep.reviewIntervals,
    topics,
    reviews,
    usedMinutesToday: doneToday.reduce((s, d) => s + d.durationMin, 0),
  });

  const last = await db.studyPlan.findFirst({ where: { preparationId }, orderBy: { version: "desc" } });
  const notes =
    result.feasibility === "INSUFICIENTE"
      ? `Faltam cerca de ${Math.ceil(result.missingMinutes / 60)}h de conteúdo até a prova. O plano prioriza os assuntos de maior peso; para cobrir tudo, aumente o tempo diário ou os dias de estudo.`
      : result.feasibility === "APERTADO"
        ? "O plano cabe até a prova, mas com pouca folga. Evite faltar às sessões."
        : null;

  await db.$transaction(async (tx) => {
    // Sessões pendentes de dias anteriores viram "perdidas"; pendentes de hoje em diante são substituídas.
    await tx.plannedSession.updateMany({ where: { plan: { preparationId }, status: "PENDING", date: { lt: start } }, data: { status: "MISSED" } });
    await tx.plannedSession.deleteMany({ where: { plan: { preparationId }, status: "PENDING", date: { gte: start }, studySession: null } });
    const plan = await tx.studyPlan.create({
      data: {
        preparationId,
        version: (last?.version ?? 0) + 1,
        feasibility: result.feasibility,
        totalMinutes: result.totalMinutes,
        capacityMinutes: result.capacityMinutes,
        missingMinutes: result.missingMinutes,
        notes,
      },
    });
    // Sessões já iniciadas hoje (com StudySession) continuam; não duplicar o mesmo item.
    const kept = await tx.plannedSession.findMany({ where: { plan: { preparationId }, status: "PENDING", date: { gte: start } } });
    const keptKeys = new Set(kept.map((k) => `${k.kind}|${k.topicId}|${k.part}|${k.reviewNumber}`));
    const orderOffset = doneToday.length + kept.length;
    await tx.plannedSession.createMany({
      data: result.sessions
        .filter((s) => !keptKeys.has(`${s.kind}|${s.topicId}|${s.part}|${s.reviewNumber}`))
        .map((s) => ({
          planId: plan.id,
          date: s.date,
          durationMin: s.durationMin,
          kind: s.kind,
          topicId: s.topicId,
          part: s.part,
          partCount: s.partCount,
          reviewNumber: s.reviewNumber,
          order: keyFromDay(s.date) === keyFromDay(start) ? s.order + orderOffset : s.order,
        })),
    });
    await tx.preparation.update({ where: { id: preparationId }, data: { lastReplanDate: start } });
  });
  return result;
}

/** Replaneja se ainda não foi feito hoje (cobre faltas mesmo sem o job noturno). */
export async function ensurePlanFresh(prep: { id: string; lastReplanDate: Date | null }, tz: string) {
  if (!prep.lastReplanDate || keyFromDay(prep.lastReplanDate) !== keyFromDay(today(tz))) {
    await generatePlan(prep.id);
  }
}

export async function latestPlan(preparationId: string) {
  return db.studyPlan.findFirst({ where: { preparationId }, orderBy: { version: "desc" } });
}
