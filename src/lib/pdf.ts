// Gerador de PDF simples (texto + tabelas leves), sem bibliotecas: fonte Helvetica com acentos (WinAnsi),
// marca d'água "Diária Paga" em todas as páginas e rodapé com a marca.

const WIN: Record<string, number> = { "€": 0x80, "‚": 0x82, "„": 0x84, "…": 0x85, "•": 0x95, "–": 0x96, "—": 0x97, "“": 0x93, "”": 0x94, "‘": 0x91, "’": 0x92, "−": 0x2d };

/** Texto → string literal de PDF (WinAnsi, com escapes). */
function lit(s: string) {
  let out = "";
  for (const ch of s) {
    const code = WIN[ch] ?? ch.codePointAt(0)!;
    if (code > 255) {
      out += "?";
      continue;
    }
    if (ch === "(" || ch === ")" || ch === "\\") out += `\\${ch}`;
    else if (code < 32 || code > 126) out += `\\${code.toString(8).padStart(3, "0")}`;
    else out += ch;
  }
  return `(${out})`;
}

// largura aproximada da Helvetica (em milésimos do tamanho da fonte) para alinhar à direita
const W = (ch: string) => (/[il.,:;'|!]/.test(ch) ? 260 : /[ftrjI]/.test(ch) ? 320 : /[mwMW]/.test(ch) ? 830 : /[A-Z0-9$]/.test(ch) ? 640 : ch === " " ? 278 : 540);
export const textWidth = (s: string, size: number) => ([...s].reduce((a, c) => a + W(c), 0) * size) / 1000;

export type PdfLine = { text: string; size?: number; bold?: boolean; right?: string; gray?: boolean; rule?: boolean; gap?: number };

/** Monta o PDF (A4) com as linhas dadas; quebra de página automática. */
export function buildPdf(title: string, lines: PdfLine[], footer: string): Buffer {
  const PW = 595, PH = 842, M = 50;
  const pages: string[] = [];
  let ops = "";
  let y = PH - M;
  const newPage = () => {
    if (ops) pages.push(ops);
    // marca d'água: grande, inclinada e bem clarinha, atrás de tudo
    ops = `q 0.93 g BT /F2 64 Tf 0.819 0.574 -0.574 0.819 190 170 Tm ${lit("Diária Paga")} Tj ET Q\n`;
    ops += `q 0.93 g BT /F2 64 Tf 0.819 0.574 -0.574 0.819 190 480 Tm ${lit("Diária Paga")} Tj ET Q\n`;
    ops += `q 0.45 g BT /F1 8 Tf ${M} 28 Td ${lit(footer)} Tj ET Q\n`;
    ops += `q 0.039 0.49 0.333 rg ${M} 40 ${PW - 2 * M} 0.8 re f Q\n`;
    y = PH - M;
  };
  newPage();
  for (const l of [{ text: title, size: 18, bold: true, gap: 8 } as PdfLine, ...lines]) {
    const size = l.size ?? 10;
    const h = size * 1.45 + (l.gap ?? 0);
    if (y - h < 60) newPage();
    y -= h;
    if (l.rule) {
      ops += `q 0.8 g ${M} ${y + size * 0.6} ${PW - 2 * M} 0.6 re f Q\n`;
      continue;
    }
    const font = l.bold ? "/F2" : "/F1";
    const color = l.gray ? "0.4 g" : "0 g";
    ops += `q ${color} BT ${font} ${size} Tf ${M} ${y} Td ${lit(l.text)} Tj ET Q\n`;
    if (l.right) ops += `q ${color} BT ${font} ${size} Tf ${PW - M - textWidth(l.right, size)} ${y} Td ${lit(l.right)} Tj ET Q\n`;
  }
  pages.push(ops);

  const objs: string[] = [];
  const add = (s: string) => objs.push(s) && objs.length;
  const catalog = add("");
  const pagesObj = add("");
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const kids: number[] = [];
  for (const content of pages) {
    const bytes = Buffer.from(content, "latin1");
    const c = add(`<< /Length ${bytes.length} >>\nstream\n${content}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`));
  }
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objs[pagesObj - 1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;
  let out = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info << /Title ${lit(title)} /Producer ${lit("Diária Paga")} >> >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}
