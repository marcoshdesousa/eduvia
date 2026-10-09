import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AREAS, ENEM_EXAMS, findLesson, lessonTopicId, MATERIAS } from "./catalog";
import type { BankQuestion } from "./bank";

const bank = JSON.parse(readFileSync("data/enem/questions.json", "utf8")) as BankQuestion[];

describe("Estudar ENEM", () => {
  it("todas as matérias têm aulas completas", () => {
    expect(MATERIAS.length).toBeGreaterThanOrEqual(13);
    expect(MATERIAS.every((m) => m.lessons.length >= 6)).toBe(true);
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

  it("quiz próprio das aulas: 5 de marcar (5 alternativas, gabarito válido) e 1 a 3 de escrever", () => {
    const withQuiz = MATERIAS.flatMap((m) => m.lessons.map((l, i) => ({ id: `${m.slug} aula ${i + 1}`, l })).filter((x) => x.l.quiz));
    expect(withQuiz.length).toBeGreaterThan(0);
    for (const { id, l } of withQuiz) {
      const q = l.quiz!;
      expect(q.choices, id).toHaveLength(5);
      expect(q.open.length, id).toBeGreaterThanOrEqual(1);
      expect(q.open.length, id).toBeLessThanOrEqual(3);
      for (const c of q.choices) {
        expect(c.options, `${id}: ${c.q}`).toHaveLength(5);
        expect(new Set(c.options).size, `${id}: alternativas repetidas em "${c.q}"`).toBe(5);
        expect(c.answer, id).toBeGreaterThanOrEqual(0);
        expect(c.answer, id).toBeLessThan(5);
        expect(c.explanation.length, id).toBeGreaterThan(5);
      }
      for (const o of q.open) expect(o.expected.length, id).toBeGreaterThan(30);
    }
  });

  it("a Redação é uma matéria com prática de redação", () => {
    const r = MATERIAS.find((m) => m.slug === "redacao")!;
    expect(r.lessons.length).toBeGreaterThanOrEqual(10);
    expect(r.lessons.some((l) => l.essay)).toBe(true);
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
