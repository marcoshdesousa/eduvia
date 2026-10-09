import { describe, expect, it } from "vitest";
import { allocateBySubject } from "./exams";

describe("allocateBySubject", () => {
  it("distribui proporcionalmente ao peso e soma o total", () => {
    const a = allocateBySubject([{ id: "a", weight: 3 }, { id: "b", weight: 1 }], 20);
    expect(a.get("a")).toBe(15);
    expect(a.get("b")).toBe(5);
  });
  it("garante pelo menos 1 por disciplina sem passar do total", () => {
    const a = allocateBySubject([{ id: "a", weight: 10 }, { id: "b", weight: 0.1 }, { id: "c", weight: 0.1 }], 10);
    expect([...a.values()].reduce((x, y) => x + y, 0)).toBe(10);
    expect(a.get("b")).toBeGreaterThanOrEqual(1);
  });
});
