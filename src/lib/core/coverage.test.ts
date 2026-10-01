import { describe, expect, it } from "vitest";
import { coverAllPages } from "./coverage";

describe("cobertura do PDF inteiro", () => {
  it("fecha os buracos e vai da página 1 até a última", () => {
    const out = coverAllPages(
      [
        { title: "B", pageStart: 10, pageEnd: 14 },
        { title: "A", pageStart: 3, pageEnd: 6 },
        { title: "C", pageStart: 20, pageEnd: 25 },
      ],
      30,
    );
    expect(out.map((t) => [t.title, t.pageStart, t.pageEnd])).toEqual([
      ["A", 1, 9],
      ["B", 10, 19],
      ["C", 20, 30],
    ]);
  });
  it("mantém assuntos que se sobrepõem", () => {
    const out = coverAllPages([{ pageStart: 1, pageEnd: 5 }, { pageStart: 4, pageEnd: 8 }], 8);
    expect(out).toEqual([{ pageStart: 1, pageEnd: 5 }, { pageStart: 4, pageEnd: 8 }]);
  });
});
