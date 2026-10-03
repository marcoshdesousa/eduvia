import { describe, expect, it } from "vitest";
import { linkSources, stripSources, type SourceRef } from "./sources";

const refs: SourceRef[] = [
  { label: "T1", materialId: "m", title: "Apostila", pageStart: 3, pageEnd: 3 },
  { label: "T2", materialId: "m", title: "Apostila", pageStart: 5, pageEnd: 6 },
  { label: "T13", materialId: "m", title: "Apostila", pageStart: 20, pageEnd: 20 },
];

describe("marcações de fonte", () => {
  it("vira link pequeno de página em todos os formatos que a IA escreve", () => {
    expect(linkSources("Fotossíntese [T1].", refs)).toBe("Fotossíntese [p.3](/fonte/m?p=3).");
    expect(linkSources("Calvin [T1, T2] e mais", refs)).toBe("Calvin [p.3](/fonte/m?p=3) [p.5](/fonte/m?p=5) e mais");
    expect(linkSources("Água (T2).", refs)).toBe("Água [p.5](/fonte/m?p=5).");
    expect(linkSources("Rubisco T13 fixa", refs)).toBe("Rubisco [p.20](/fonte/m?p=20) fixa");
    expect(linkSources("linfócitos T4 atuam", refs)).toBe("linfócitos T4 atuam"); // não é fonte da aula
  });
  it("o robô não lê as marcações", () => {
    expect(stripSources("Calvin [T1, T2] e água (T2) e T13.", ["T1", "T2", "T13"])).toBe("Calvin e água e.");
    expect(stripSources("linfócitos T4 atuam", ["T1"])).toBe("linfócitos T4 atuam");
  });
  it("o link não quebra quando o trecho tem parênteses", () => {
    const md = linkSources("Bolívia [T1].", [{ label: "T1", materialId: "m", title: "x", pageStart: 12, pageEnd: 12, quote: "Prof. George (então diretor) e Monroe" }]);
    const url = md.match(/\]\((\S+)\)\.$/)![1];
    expect(url).not.toMatch(/[()]/);
    expect(new URLSearchParams(url.split("?")[1]).get("q")).toBe("Prof. George (então diretor) e Monroe");
  });
});
