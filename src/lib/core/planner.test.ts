import { describe, expect, it } from "vitest";
import { buildPlan, orderTopics, splitParts, type PlanTopic } from "./planner";
import { addDays, dayFromKey, weekday } from "./dates";

const topic = (id: string, subjectId: string, minutes: number, extra: Partial<PlanTopic> = {}): PlanTopic => ({
  id, subjectId, subjectWeight: 1, order: 0, estimatedMinutes: minutes, weight: 1, difficulty: 3, completedParts: 0, ...extra,
});

const MON = dayFromKey("2026-10-05"); // segunda-feira
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

describe("splitParts", () => {
  it("divide em blocos que cabem no tempo diário", () => {
    expect(splitParts(60, 15)).toEqual([15, 15, 15, 15]);
    expect(splitParts(40, 15)).toEqual([15, 15, 10]);
    expect(splitParts(8, 15)).toEqual([10]);
    expect(splitParts(120, 240)).toEqual([50, 50, 20]);
  });
});

describe("buildPlan", () => {
  it("respeita o tempo diário e os dias da semana", () => {
    const plan = buildPlan({
      start: MON, studyDays: [1, 3, 5], dailyMinutes: 15, reviewIntervals: [1, 7, 15, 30],
      topics: [topic("a", "s1", 45)], reviews: [],
    });
    const study = plan.sessions.filter((s) => s.kind === "STUDY");
    expect(study).toHaveLength(3);
    for (const s of plan.sessions) expect([1, 3, 5]).toContain(weekday(s.date));
    const perDay = new Map<string, number>();
    for (const s of plan.sessions) perDay.set(s.date.toISOString(), (perDay.get(s.date.toISOString()) ?? 0) + s.durationMin);
    for (const m of perDay.values()) expect(m).toBeLessThanOrEqual(15);
  });

  it("agenda R1..R4 depois de concluir o assunto", () => {
    const plan = buildPlan({
      start: MON, studyDays: ALL_DAYS, dailyMinutes: 30, reviewIntervals: [1, 7, 15, 30],
      topics: [topic("a", "s1", 30)], reviews: [],
    });
    const reviews = plan.sessions.filter((s) => s.kind === "REVIEW");
    expect(reviews.map((r) => r.reviewNumber)).toEqual([1, 2, 3, 4]);
    expect(reviews.map((r) => r.date.toISOString().slice(0, 10))).toEqual(["2026-10-06", "2026-10-12", "2026-10-20", "2026-11-04"]);
  });

  it("avisa quando o tempo até a prova não é suficiente e prioriza o que tem mais peso", () => {
    const plan = buildPlan({
      start: MON, examDate: addDays(MON, 3), studyDays: ALL_DAYS, dailyMinutes: 15, reviewIntervals: [1],
      topics: [topic("leve", "s1", 30, { weight: 1 }), topic("pesado", "s2", 30, { weight: 3, subjectWeight: 3 })],
      reviews: [],
    });
    expect(plan.feasibility).toBe("INSUFICIENTE");
    expect(plan.missingMinutes).toBeGreaterThan(0);
    expect(plan.sessions[0].topicId).toBe("pesado");
    expect(plan.unscheduledTopicIds).toContain("leve");
    for (const s of plan.sessions) expect(s.date < addDays(MON, 3)).toBe(true);
  });

  it("continua de onde parou e desconta o que já foi estudado hoje", () => {
    const plan = buildPlan({
      start: MON, studyDays: ALL_DAYS, dailyMinutes: 30, reviewIntervals: [],
      topics: [topic("a", "s1", 90, { completedParts: 1 })], reviews: [], usedMinutesToday: 30,
    });
    const study = plan.sessions.filter((s) => s.kind === "STUDY");
    expect(study[0].part).toBe(2);
    expect(study[0].date.toISOString().slice(0, 10)).toBe("2026-10-06");
  });

  it("encaixa revisões vencidas antes de conteúdo novo", () => {
    const plan = buildPlan({
      start: MON, studyDays: ALL_DAYS, dailyMinutes: 60, reviewIntervals: [],
      topics: [topic("novo", "s1", 45)],
      reviews: [{ topicId: "antigo", reviewNumber: 2, dueDate: addDays(MON, -2) }],
    });
    expect(plan.sessions[0]).toMatchObject({ kind: "REVIEW", topicId: "antigo", reviewNumber: 2 });
    expect(plan.sessions[1]).toMatchObject({ kind: "STUDY", topicId: "novo" });
  });
});

describe("orderTopics", () => {
  it("intercala disciplinas proporcionalmente ao peso", () => {
    const topics = [
      ...["a1", "a2", "a3", "a4"].map((id) => topic(id, "A", 30, { subjectWeight: 3 })),
      ...["b1", "b2"].map((id) => topic(id, "B", 30, { subjectWeight: 1 })),
    ];
    const ids = orderTopics(topics).map((t) => t.subjectId).join("");
    expect(ids.slice(0, 4)).toContain("B");
    expect(ids.startsWith("A")).toBe(true);
  });
});
