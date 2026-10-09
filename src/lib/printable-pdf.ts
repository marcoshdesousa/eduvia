// PDFs para imprimir: redação corrigida e simulado com as respostas do aluno.
// Marca d'água discreta, cabeçalho da instituição e rodapé "PDF gerado pelo Eduvia".
import { readFile } from "node:fs/promises";
import path from "node:path";
import { degrees, PDFDocument, rgb, StandardFonts, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";

const A4: [number, number] = [595.28, 841.89];
const M = 48; // margem
const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.42, 0.44, 0.5);
const LINE = rgb(0.82, 0.83, 0.86);
const ORANGE = rgb(0.976, 0.451, 0.086);
export const INSTITUTION = "Eduvia";

/** As fontes padrão do PDF só conhecem WinAnsi: troca o que não existe nela (aspas curvas, travessões, emojis). */
export function pdfSafe(s: string) {
  return s
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/[   ]/g, " ")
    .replace(/\t/g, "    ")
    .replace(/[^\n\x20-\x7E¡-ÿ]/g, "");
}

export function formatStamp(d: Date, tz = "America/Sao_Paulo") {
  return d.toLocaleString("pt-BR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Quebra o texto em linhas que cabem na largura (respeita quebras de linha do aluno). */
export function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of pdfSafe(text).split("\n")) {
    if (!para.trim()) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(/ +/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) {
        line = next;
        continue;
      }
      if (line) out.push(line);
      // palavra maior que a linha: corta
      let w = word;
      while (font.widthOfTextAtSize(w, size) > width) {
        let i = w.length;
        while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > width) i--;
        out.push(w.slice(0, i));
        w = w.slice(i);
      }
      line = w;
    }
    out.push(line);
  }
  return out;
}

type Ctx = { doc: PDFDocument; page: PDFPage; y: number; font: PDFFont; bold: PDFFont; logo: PDFImage | null; footer: string; watermark: string };

async function loadLogo(doc: PDFDocument) {
  try {
    return await doc.embedPng(await readFile(path.join(process.cwd(), "public", "icon-192.png")));
  } catch {
    return null;
  }
}

function decorate(c: Ctx, page: PDFPage) {
  const [w, h] = A4;
  // marca d'água discreta, na diagonal
  for (let i = 0; i < 3; i++) {
    page.drawText(pdfSafe(c.watermark), { x: 70, y: 160 + i * 250, size: 22, font: c.bold, color: ORANGE, opacity: 0.07, rotate: degrees(30) });
  }
  // rodapé
  page.drawLine({ start: { x: M, y: 40 }, end: { x: w - M, y: 40 }, thickness: 0.5, color: LINE });
  let x = M;
  if (c.logo) {
    page.drawImage(c.logo, { x, y: 22, width: 12, height: 12 });
    x += 16;
  }
  page.drawText(pdfSafe(c.footer), { x, y: 25, size: 8, font: c.font, color: MUTED });
  void h;
}

async function newDoc(title: string, footer: string, watermark: string): Promise<Ctx> {
  const doc = await PDFDocument.create();
  doc.setTitle(pdfSafe(title));
  doc.setCreator(INSTITUTION);
  doc.setProducer(INSTITUTION);
  const [font, bold] = await Promise.all([doc.embedFont(StandardFonts.Helvetica), doc.embedFont(StandardFonts.HelveticaBold)]);
  const logo = await loadLogo(doc);
  const c: Ctx = { doc, page: doc.addPage(A4), y: A4[1] - M, font, bold, logo, footer, watermark };
  decorate(c, c.page);
  return c;
}

function ensure(c: Ctx, need: number) {
  if (c.y - need >= 56) return;
  c.page = c.doc.addPage(A4);
  decorate(c, c.page);
  c.y = A4[1] - M;
}

function text(c: Ctx, s: string, opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) {
  const size = opts.size ?? 10.5;
  const font = opts.bold ? c.bold : c.font;
  const x = M + (opts.indent ?? 0);
  for (const line of wrap(s, font, size, A4[0] - x - M)) {
    ensure(c, size + 4);
    c.page.drawText(line, { x, y: c.y - size, size, font, color: opts.color ?? INK });
    c.y -= size + 4;
  }
  c.y -= opts.gap ?? 4;
}

function header(c: Ctx, kind: string, rows: [string, string][]) {
  const [w] = A4;
  if (c.logo) c.page.drawImage(c.logo, { x: M, y: c.y - 30, width: 30, height: 30 });
  c.page.drawText(INSTITUTION, { x: M + 38, y: c.y - 14, size: 16, font: c.bold, color: ORANGE });
  c.page.drawText(pdfSafe(kind), { x: M + 38, y: c.y - 28, size: 9, font: c.font, color: MUTED });
  c.y -= 44;
  for (const [k, v] of rows) {
    ensure(c, 14);
    c.page.drawText(pdfSafe(`${k}:`), { x: M, y: c.y - 10, size: 9.5, font: c.bold, color: INK });
    c.page.drawText(pdfSafe(v), { x: M + 110, y: c.y - 10, size: 9.5, font: c.font, color: INK });
    c.y -= 14;
  }
  c.y -= 6;
  c.page.drawLine({ start: { x: M, y: c.y }, end: { x: w - M, y: c.y }, thickness: 0.6, color: LINE });
  c.y -= 14;
}

function scoreBox(c: Ctx, label: string, score: string, rows: [string, string][]) {
  const [w] = A4;
  const h = 36 + Math.ceil(rows.length / 2) * 14 + 8;
  ensure(c, h + 10);
  const top = c.y;
  c.page.drawRectangle({ x: M, y: top - h, width: w - 2 * M, height: h, borderColor: ORANGE, borderWidth: 1.2, color: rgb(1, 0.97, 0.94) });
  c.page.drawText(pdfSafe(label), { x: M + 12, y: top - 18, size: 9, font: c.font, color: MUTED });
  c.page.drawText(pdfSafe(score), { x: M + 12, y: top - 34, size: 16, font: c.bold, color: INK });
  const colW = (w - 2 * M - 24) / 2;
  rows.forEach(([k, v], i) => {
    const x = M + 12 + (i % 2) * colW;
    const y = top - 50 - Math.floor(i / 2) * 14;
    const val = pdfSafe(v);
    c.page.drawText(pdfSafe(k).slice(0, 48), { x, y, size: 8.5, font: c.font, color: INK });
    c.page.drawText(val, { x: x + colW - 14 - c.bold.widthOfTextAtSize(val, 8.5), y, size: 8.5, font: c.bold, color: INK });
  });
  c.y = top - h - 14;
}

function section(c: Ctx, title: string) {
  ensure(c, 30);
  c.y -= 4;
  text(c, title, { size: 11.5, bold: true, color: ORANGE, gap: 2 });
}

// ───────────── Redação ─────────────

export type EssayPdfInput = {
  student: { name: string; handle: string | null };
  theme: string;
  rubricLabel: string;
  text: string;
  score: number | null;
  maxScore: number | null;
  criteria: { name: string; score: number; max: number }[];
  errors: { category: string; quote: string; message: string; suggestion: string }[];
  createdAt: Date;
  evaluatedAt: Date | null;
  timeLimitMin: number | null;
  tz: string;
};

export async function essayPdf(e: EssayPdfInput): Promise<Uint8Array> {
  const now = new Date();
  const c = await newDoc(`Redação - ${e.theme}`, `PDF gerado pelo ${INSTITUTION} em ${formatStamp(now, e.tz)} · Correção feita por inteligência artificial`, `${INSTITUTION} · ${formatStamp(e.evaluatedAt ?? now, e.tz)}`);
  header(c, "Folha de redação corrigida", [
    ["Instituição", INSTITUTION],
    ["Estudante", `${e.student.name}${e.student.handle ? ` (@${e.student.handle})` : ""}`],
    ["Avaliador", "IA (inteligência artificial)"],
    ["Data e hora", formatStamp(e.evaluatedAt ?? e.createdAt, e.tz)],
    ["Modelo", e.rubricLabel],
    ...(e.timeLimitMin ? ([["Tempo escolhido", e.timeLimitMin >= 60 ? `${e.timeLimitMin / 60} h` : `${e.timeLimitMin} min`]] as [string, string][]) : []),
  ]);
  scoreBox(
    c,
    "Nota final",
    e.score != null ? `${e.score.toLocaleString("pt-BR")} de ${e.maxScore}` : "Sem nota",
    e.criteria.map((k) => [k.name.replace(/^Competência (\d) — /, "C$1 - "), `${k.score.toLocaleString("pt-BR")}/${k.max}`]),
  );
  section(c, "Tema");
  text(c, e.theme, { bold: true, gap: 8 });
  section(c, "Texto do estudante");
  // linhas numeradas, como numa folha de redação
  const size = 10.5;
  let n = 1;
  for (const line of wrap(e.text, c.font, size, A4[0] - 2 * M - 26)) {
    ensure(c, size + 5);
    c.page.drawText(String(n).padStart(2, "0"), { x: M, y: c.y - size, size: 8, font: c.font, color: MUTED });
    c.page.drawText(line, { x: M + 26, y: c.y - size, size, font: c.font, color: INK });
    c.page.drawLine({ start: { x: M + 24, y: c.y - size - 3 }, end: { x: A4[0] - M, y: c.y - size - 3 }, thickness: 0.3, color: LINE });
    c.y -= size + 5;
    n++;
  }
  c.y -= 8;
  if (e.errors.length) {
    section(c, `Erros apontados (${e.errors.length})`);
    e.errors.forEach((er, i) => {
      text(c, `${i + 1}. [${er.category}] "${er.quote}"`, { size: 9.5, bold: true, gap: 0 });
      text(c, er.message, { size: 9.5, indent: 12, gap: 0 });
      if (er.suggestion) text(c, `Sugestão: ${er.suggestion}`, { size: 9.5, indent: 12, color: MUTED, gap: 0 });
      c.y -= 4;
    });
  }
  return c.doc.save();
}

// ───────────── Simulado ─────────────

export type ExamPdfInput = {
  student: { name: string; handle: string | null };
  title: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  questions: { statement: string; options: string[] | null; answer: string | null }[];
  tz: string;
};

/** Caderno do simulado com as respostas que o aluno marcou (sem indicar certo ou errado). */
export async function examPdf(e: ExamPdfInput): Promise<Uint8Array> {
  const now = new Date();
  const c = await newDoc(`Simulado - ${e.title}`, `PDF gerado pelo ${INSTITUTION} em ${formatStamp(now, e.tz)}`, `${INSTITUTION} · ${formatStamp(now, e.tz)}`);
  const answered = e.questions.filter((q) => q.answer != null && q.answer !== "").length;
  header(c, "Caderno do simulado com as suas respostas", [
    ["Instituição", INSTITUTION],
    ["Estudante", `${e.student.name}${e.student.handle ? ` (@${e.student.handle})` : ""}`],
    ["Simulado", e.title],
    ["Data e hora", formatStamp(e.finishedAt ?? e.startedAt ?? now, e.tz)],
    ["Respondidas", `${answered} de ${e.questions.length}`],
  ]);
  const letters = "ABCDEFGH";
  e.questions.forEach((q, i) => {
    ensure(c, 60);
    text(c, `Questão ${i + 1}`, { size: 10, bold: true, color: ORANGE, gap: 0 });
    text(c, q.statement, { size: 10, gap: 2 });
    if (q.options?.length) {
      q.options.forEach((o, j) => {
        const mine = q.answer === String(j) || q.answer === letters[j] || q.answer === o;
        text(c, `${mine ? "(X)" : "( )"} ${letters[j]}) ${o}`, { size: 9.5, indent: 10, bold: mine, gap: 0 });
      });
    } else {
      text(c, `Sua resposta: ${q.answer || "(em branco)"}`, { size: 9.5, indent: 10, gap: 0 });
    }
    if (q.answer == null || q.answer === "") text(c, "Não respondida", { size: 9, indent: 10, color: MUTED, gap: 0 });
    c.y -= 8;
  });
  return c.doc.save();
}
