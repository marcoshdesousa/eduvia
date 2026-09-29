import { describe, expect, it } from "vitest";
import { analyzeSyllabus } from "./mock";

describe("edital (modo simulado)", () => {
  it("extrai disciplinas, assuntos e banca", () => {
    const s = analyzeSyllabus(`EDITAL Nº 1/2026 — CONCURSO PÚBLICO
Banca FGV.
LÍNGUA PORTUGUESA: 1. Ortografia oficial. 2. Concordância verbal e nominal.
BIOLOGIA: 1. Fotossíntese. 2. Respiração celular e fermentação.`);
    expect(s.banca).toBe("FGV");
    expect(s.subjects.map((x) => x.name)).toEqual(["Língua Portuguesa", "Biologia"]);
    expect(s.subjects[1].topics.map((t) => t.title)).toEqual(["Fotossíntese", "Respiração celular e fermentação"]);
  });
});
