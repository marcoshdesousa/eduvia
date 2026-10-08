// Texto da aula → slides do "modo vídeo". Cada pedaço do slide sabe quais frases do robô são dele
// (a lista de frases é exatamente a mesma do toSpeech, então o áudio já pronto da aula serve para o vídeo).
import { stripSources } from "@/lib/sources";
import { lineParts, plainSpeech } from "@/lib/speech-text";

/** Um pedaço do slide. from/to: frases do robô que são dele (to fora). */
export type SlideEl =
  | { kind: "text" | "bullet" | "num" | "label" | "quote" | "enem" | "eq"; md: string; n?: string; from: number; to: number }
  | { kind: "table"; rows: string[][]; from: number; to: number };

/** Um slide: título da parte, os pedaços e as frases do robô (from/to). cont = continuação da mesma parte. */
export type Slide = { title: string; section: number; cont: number; enem: boolean; from: number; to: number; els: SlideEl[] };

export type LessonVideo = { parts: string[]; slides: Slide[]; sections: { title: string; slide: number }[]; summary: string[] };

/** Quanto cabe num slide (em letras e em pedaços): o resto vai para o próximo slide da mesma parte. */
const SLIDE_CHARS = 380;
const SLIDE_ELS = 4;
/** Parágrafo grande é cortado (entre frases) em pedaços deste tamanho, cada um no seu slide. */
const PARA_CHARS = 300;

const visible = (md: string) => md.replace(/\*\*|__|`/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const size = (el: SlideEl) => (el.kind === "table" ? el.rows.reduce((s, r) => s + r.join(" ").length + 12, 0) : visible(el.md).length + 30);
/** Partes que falam do ENEM ganham o selo "Cai muito no ENEM". */
const ENEM_TITLE = /\bENEM\b|dicas?|pegadinha|aten[çc][ãa]o|cuidado|armadilha/i;
/** Linha em negrito que é fórmula/equação (vira destaque grande no meio do slide). */
const isFormula = (t: string) => /[=→⇌⇄×÷]|->|\s\+\s/.test(t) && /[0-9A-Z]/.test(t) && t.length <= 90;

/** Corta um parágrafo grande entre frases (sem quebrar um negrito no meio). */
function splitParagraph(md: string): string[] {
  if (visible(md).length <= PARA_CHARS + 60) return [md];
  const out: string[] = [];
  let cur = "";
  let i = 0;
  for (const m of md.matchAll(/[.!?]["”)]?\s+(?=[\p{Lu}0-9"“(*])/gu)) {
    const end = m.index! + m[0].length;
    const piece = md.slice(i, end);
    const candidate = cur + piece;
    const bold = (candidate.match(/\*\*/g) ?? []).length % 2 === 0;
    if (cur && bold && (cur.match(/\*\*/g) ?? []).length % 2 === 0 && visible(candidate).length > PARA_CHARS) {
      out.push(cur.trim());
      cur = piece;
    } else cur = candidate;
    i = end;
  }
  cur += md.slice(i);
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function lessonVideo(content: string, title: string, labels: string[] = []): LessonVideo {
  const parts: string[] = [];
  const speak = (md: string) => {
    const from = parts.length;
    parts.push(...plainSpeech(md).split("\n").flatMap(lineParts));
    return { from, to: parts.length };
  };

  type Section = { title: string; from: number; els: SlideEl[] };
  const sections: Section[] = [];
  let sec: Section | null = null;
  const open = (t: string, from: number) => {
    sec = { title: t, from, els: [] };
    sections.push(sec);
  };
  const add = (el: SlideEl) => {
    if (!sec) open(title, el.from);
    sec!.els.push(el);
  };

  const lines = stripSources(content, labels).split("\n");
  for (let li = 0; li < lines.length; li++) {
    const raw = lines[li];
    const t = raw.trim();
    if (!t) continue;
    if (/^##?\s/.test(t)) {
      const r = speak(raw);
      open(visible(t.replace(/^#+\s*/, "")), r.from);
      continue;
    }
    if (/^#{3,6}\s/.test(t)) {
      add({ kind: "label", md: t.replace(/^#+\s*/, ""), ...speak(raw) });
      continue;
    }
    if (t.startsWith("|")) {
      // tabela: junta as linhas seguidas; a linha "|---|" não é falada nem mostrada
      const from = parts.length;
      const rows: string[][] = [];
      for (; li < lines.length && lines[li].trim().startsWith("|"); li++) {
        speak(lines[li]);
        const cells = lines[li].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
      }
      li--;
      add({ kind: "table", rows, from, to: parts.length });
      continue;
    }
    const bullet = /^\s*[-•]\s+(.*)$/.exec(raw);
    if (bullet) {
      add({ kind: "bullet", md: bullet[1], ...speak(raw) });
      continue;
    }
    const num = /^(\d+)[.)]\s+(.*)$/.exec(t);
    if (num) {
      add({ kind: "num", n: num[1], md: num[2], ...speak(raw) });
      continue;
    }
    if (t.startsWith(">")) {
      add({ kind: "quote", md: t.replace(/^>\s*/, ""), ...speak(raw) });
      continue;
    }
    const boldLine = /^\*\*([^*]+)\*\*$/.exec(t);
    if (boldLine) {
      add({ kind: isFormula(boldLine[1]) ? "eq" : "label", md: boldLine[1], ...speak(raw) });
      continue;
    }
    for (const piece of splitParagraph(t)) add({ kind: /\bENEM\b/.test(piece) ? "enem" : "text", md: piece, ...speak(piece) });
  }

  // cada parte vira um ou mais slides (o que não cabe vai para a continuação)
  const slides: Slide[] = [];
  const index: LessonVideo["sections"] = [];
  sections.forEach((s, si) => {
    index.push({ title: s.title, slide: slides.length });
    let cur: Slide = { title: s.title, section: si, cont: 0, enem: ENEM_TITLE.test(s.title), from: s.from, to: s.from, els: [] };
    let used = 0;
    for (const el of s.els) {
      const sz = size(el);
      // um rótulo ("Tipos de sujeito:") não fica sozinho no fim do slide: vai junto com o que ele apresenta
      const last = cur.els[cur.els.length - 1];
      if (cur.els.length && (cur.els.length >= SLIDE_ELS || used + sz > SLIDE_CHARS)) {
        const carry = last && (last.kind === "label") && cur.els.length > 1 ? cur.els.pop()! : null;
        if (carry) cur.to = carry.from;
        slides.push(cur);
        cur = { ...cur, cont: cur.cont + 1, from: carry ? carry.from : el.from, els: carry ? [carry] : [] };
        used = carry ? size(carry) : 0;
      }
      cur.els.push(el);
      cur.to = el.to;
      used += sz;
    }
    cur.to = Math.max(cur.to, (s.els[s.els.length - 1]?.to ?? cur.to));
    slides.push(cur);
  });
  // as frases ficam com algum slide: o fim de cada slide é o começo do próximo
  for (let i = 0; i < slides.length; i++) slides[i].to = i + 1 < slides.length ? slides[i + 1].from : parts.length;

  const resumo = sections.find((s) => /^resum/i.test(s.title));
  const summary = resumo ? resumo.els.flatMap((e) => (e.kind === "table" ? [] : [e.md])) : [];
  return { parts, slides, sections: index, summary };
}

/** Em qual slide está a frase p. */
export function slideOfPart(v: LessonVideo, p: number) {
  let lo = 0;
  let hi = v.slides.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (v.slides[mid].from <= p) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
