import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AREAS, ENEM_EXAMS, findLesson, lessonTopicId, MATERIAS } from "./catalog";
import type { BankQuestion } from "./bank";

const bank = JSON.parse(readFileSync("data/enem/questions.json", "utf8")) as BankQuestion[];

describe("Estudar ENEM", () => {
  it("todas as matérias têm aulas completas", () => {
    expect(MATERIAS.length).toBeGreaterThanOrEqual(13);
    const slugs = new Set(MATERIAS.map((m) => m.slug));
    expect(slugs.size).toBe(MATERIAS.length);
    for (const m of MATERIAS) {
      expect(m.lessons.length).toBeGreaterThanOrEqual(3);
      for (const [i, l] of m.lessons.entries()) {
        expect(l.content.length, `${m.slug} aula ${i + 1}`).toBeGreaterThan(1200);
        expect(l.highlights.length).toBeGreaterThanOrEqual(3);
        expect(l.keyPoints.length).toBeGreaterThanOrEqual(3);
        expect(findLesson(lessonTopicId(m.slug, i))?.lesson.title).toBe(l.title);
      }
    }
  });

  it("questões reais com 5 alternativas e gabarito, nas 4 áreas", () => {
    expect(bank.length).toBeGreaterThan(2500);
    for (const q of bank) {
      expect(q.options).toHaveLength(5);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(5);
      expect(q.id.startsWith("enem-")).toBe(true);
    }
    expect(new Set(bank.map((q) => q.id)).size).toBe(bank.length);
    for (const a of AREAS) expect(bank.filter((q) => q.area === a.key).length).toBeGreaterThan(400);
  });

  it("cada aula tem questões suficientes da sua área (inglês e espanhol só da própria língua)", () => {
    for (const m of MATERIAS) {
      const pool = bank.filter((q) => q.area === m.area && (m.lang ? q.lang === m.lang : !q.lang));
      expect(pool.length, m.slug).toBeGreaterThan(50);
    }
  });

  it("simulados com a quantidade e o tempo do ENEM", () => {
    const total = (k: keyof typeof ENEM_EXAMS) => ENEM_EXAMS[k].parts.reduce((s, p) => s + p.count, 0);
    expect(total("dia1-ingles")).toBe(90);
    expect(total("dia1-espanhol")).toBe(90);
    expect(total("dia2")).toBe(90);
    expect(ENEM_EXAMS["dia1-ingles"].minutes).toBe(330);
    expect(ENEM_EXAMS.dia2.minutes).toBe(300);
    for (const k of ["humanas", "natureza", "matematica", "linguagens-ingles"] as const) expect(total(k)).toBe(45);
  });
});
