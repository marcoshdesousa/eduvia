import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, type Stats } from "./achievements";
import { levelFromXp, levelTitle } from "./gamification";

const zero: Stats = { sessions: 0, longestStreak: 0, attempts: 0, resolvedErrors: 0, bestGame: 0, bestGameCorrect: 0, exams: 0, bestExam: 0, essays: 0, bestEnem: 0, goodTopics: 0, groups: 0, xp: 0 };

describe("conquistas", () => {
  it("têm identificadores únicos", () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.slug)).size).toBe(ACHIEVEMENTS.length);
  });
  it("nenhuma é liberada sem atividade", () => {
    expect(ACHIEVEMENTS.filter((a) => a.test(zero))).toEqual([]);
  });
  it("liberam conforme as estatísticas", () => {
    const got = ACHIEVEMENTS.filter((a) => a.test({ ...zero, sessions: 12, longestStreak: 7, groups: 1 })).map((a) => a.slug);
    expect(got).toEqual(expect.arrayContaining(["primeira-sessao", "sessoes-10", "sequencia-3", "sequencia-7", "em-grupo"]));
    expect(got).not.toContain("sessoes-50");
  });
});

describe("níveis", () => {
  it("calcula nível e título pelo XP", () => {
    expect(levelFromXp(0)).toMatchObject({ level: 1, title: "Iniciante" });
    expect(levelFromXp(200).level).toBe(3);
    expect(levelTitle(3)).toBe("Estudante");
    expect(levelTitle(12)).toBe("Mestre");
  });
});
