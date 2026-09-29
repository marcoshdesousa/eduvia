// Gerador local usado quando não há chave da Anthropic (AI_MODE=mock).
// Não é inteligente: serve para rodar e testar o fluxo completo do app sem custo.
import type { EssayEvaluation, EssayTheme, Grade, Outline, SessionContent, Syllabus } from "./schemas";
import type { RetrievedChunk } from "./tasks";

const sentencesOf = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 400);

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function extractOutline(input: { subjectHint: string | null; pages: { page: number; text: string }[]; materialTitle: string }): Outline {
  const pages = input.pages.filter((p) => p.text.trim().length > 30);
  if (!pages.length) return { topics: [], books: [] };
  const size = pages.length <= 3 ? pages.length : 4;
  const topics: Outline["topics"] = [];
  for (let i = 0; i < pages.length; i += size) {
    const group = pages.slice(i, i + size);
    const firstLine = group[0].text.split("\n").map((l) => l.trim()).find((l) => l.length > 3 && l.length < 90);
    topics.push({
      subject: input.subjectHint ?? "Geral",
      title: firstLine ?? `${input.materialTitle} — parte ${topics.length + 1}`,
      description: sentencesOf(group.map((g) => g.text).join(" "))[0] ?? "",
      pageStart: group[0].page,
      pageEnd: group[group.length - 1].page,
      difficulty: 3,
    });
  }
  const subject = input.subjectHint ?? "Geral";
  return { topics, books: [{ subject, title: `Guia de estudos de ${subject}`, author: "Autor de exemplo" }] };
}

export function analyzeSyllabus(text: string): Syllabus {
  // Heurística: linhas em MAIÚSCULAS (ou terminadas em ":") viram disciplinas; itens seguintes viram assuntos.
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const subjects: Syllabus["subjects"] = [];
  for (const raw of lines) {
    let line = raw;
    // "DISCIPLINA: 1. assunto. 2. assunto." na mesma linha
    const inline = line.match(/^([^:]{3,80}):\s*(.+)$/);
    if (inline && inline[1] === inline[1].toUpperCase() && /\p{L}/u.test(inline[1])) {
      subjects.push({ name: titleCase(inline[1].replace(/^[\d.\s-]+/, "")), weight: 1, topics: [] });
      line = inline[2];
    }
    const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, "");
    const isHeader = line === raw && !/edital|concurso p[uú]blico/i.test(line) && ((letters.length > 3 && letters === letters.toUpperCase() && line.length < 80) || /:\s*$/.test(line));
    if (isHeader) {
      subjects.push({ name: titleCase(line.replace(/[:.\d]+\s*$/g, "").replace(/^[\d.\s-]+/, "")), weight: 1, topics: [] });
      continue;
    }
    const current = subjects[subjects.length - 1];
    if (!current) continue;
    for (const item of line.split(/;|\.\s+(?=\d)|\s(?=\d+\.\d*\s)/)) {
      const t = item.replace(/^[\d.\s)-]+/, "").replace(/[.;]\s*$/, "").trim();
      if (t.length > 3) current.topics.push({ title: t.slice(0, 160), difficulty: 3 });
    }
  }
  const valid = subjects.filter((s) => s.topics.length);
  const banca = /cebraspe|cespe/i.test(text) ? "Cebraspe" : /fgv/i.test(text) ? "FGV" : /fcc|carlos chagas/i.test(text) ? "FCC" : null;
  return {
    banca,
    cargo: null,
    questionStyle: banca === "Cebraspe" ? "CERTO_ERRADO" : "MULTIPLA_ESCOLHA",
    examDate: null,
    subjects: valid.length ? valid : [{ name: "Conteúdo geral", weight: 1, topics: [{ title: "Conteúdo do documento", difficulty: 3 }] }],
  };
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m) => m.toUpperCase()).trim();
}

export function generateSessionContent(input: {
  topicTitle: string;
  chunks: RetrievedChunk[];
  objectiveCount: number;
  recallCount: number;
  questionStyle: "MULTIPLE_CHOICE" | "CERTO_ERRADO";
  optionsCount: number;
}): SessionContent {
  const withLabel = input.chunks.flatMap((c) => sentencesOf(c.content).map((s) => ({ s, label: c.label })));
  const text = withLabel.length ? withLabel : [{ s: `O material ainda não tem texto suficiente sobre ${input.topicTitle}.`, label: "T1" }];
  const words = [...new Set(text.flatMap(({ s }) => s.split(/[^\p{L}]+/u)).filter((w) => w.length >= 6))];

  const studyText = [
    `## ${input.topicTitle}`,
    "> *Modo de demonstração: sem chave de IA configurada, este texto é montado com frases do seu material.*",
    ...chunkArray(text.slice(0, 12), 3).map((group) => group.map(({ s, label }) => `${s} [${label}]`).join(" ")),
  ].join("\n\n");

  const objectiveQuestions: SessionContent["objectiveQuestions"] = [];
  for (const { s, label } of text) {
    if (objectiveQuestions.length >= input.objectiveCount) break;
    const target = s.split(/[^\p{L}]+/u).filter((w) => w.length >= 6).sort((a, b) => b.length - a.length)[0];
    if (!target) continue;
    if (input.questionStyle === "CERTO_ERRADO") {
      const falseVersion = objectiveQuestions.length % 2 === 1;
      const other = words.find((w) => norm(w) !== norm(target)) ?? "incorreto";
      objectiveQuestions.push({
        statement: falseVersion ? s.replace(target, other) : s,
        options: ["Certo", "Errado"],
        correctIndex: falseVersion ? 1 : 0,
        explanation: `No material: "${s}"`,
        difficulty: 3,
        source: label,
      });
      continue;
    }
    const distractors = shuffle(words.filter((w) => norm(w) !== norm(target))).slice(0, input.optionsCount - 1);
    if (distractors.length < input.optionsCount - 1) continue;
    const correctIndex = objectiveQuestions.length % input.optionsCount;
    const options = [...distractors];
    options.splice(correctIndex, 0, target);
    objectiveQuestions.push({
      statement: `Complete a lacuna: "${s.replace(target, "_____")}"`,
      options,
      correctIndex,
      explanation: `A frase original do material é: "${s}"`,
      difficulty: 3,
      source: label,
    });
  }

  const recallQuestions = text.slice(0, input.recallCount).map(({ s, label }) => ({
    question: `Sem olhar o material, explique com suas palavras: ${s.split(" ").slice(0, 8).join(" ")}...`,
    expectedAnswer: s,
    source: label,
  }));

  return {
    studyText,
    highlights: [...text].sort((a, b) => b.s.length - a.s.length).slice(0, 3).map((t) => t.s),
    keyPoints: words.slice(0, 4).map((w) => ({ term: w, explanation: text.find((t) => t.s.includes(w))?.s ?? "" })),
    recallQuestions,
    objectiveQuestions,
    sources: [...new Set(text.map((t) => t.label))],
  };
}

export function gradeOpenAnswer(input: { expectedAnswer: string; answer: string }): Grade {
  const tokens = (s: string) => new Set(norm(s).split(/[^a-z0-9]+/).filter((w) => w.length > 3));
  const expected = tokens(input.expectedAnswer);
  const given = tokens(input.answer);
  const hit = [...expected].filter((w) => given.has(w)).length;
  const score = expected.size ? Math.min(1, hit / Math.max(3, expected.size * 0.6)) : 0;
  const verdict = score >= 0.75 ? "CORRETA" : score >= 0.4 ? "PARCIAL" : "INCORRETA";
  return {
    score,
    verdict,
    feedback:
      verdict === "CORRETA"
        ? "Boa! Você lembrou os pontos principais."
        : verdict === "PARCIAL"
          ? "Você lembrou parte do conteúdo. Compare com a resposta-modelo."
          : "Ainda não foi dessa vez. Releia a resposta-modelo e tente de novo na revisão.",
    missingPoints: [...expected].filter((w) => !given.has(w)).slice(0, 5),
  };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  // determinístico (para cache e testes): rotação simples
  return arr.length ? [...arr.slice(arr.length / 2), ...arr.slice(0, arr.length / 2)] : arr;
}

const THEMES = [
  "Os desafios da educação digital no Brasil",
  "O impacto das redes sociais na saúde mental dos jovens",
  "A importância da leitura na formação do cidadão",
  "Caminhos para reduzir o desperdício de alimentos no Brasil",
];

export function suggestEssayTheme(rubricLabel: string): EssayTheme {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  return { theme, instructions: `Escreva um texto (${rubricLabel}) de 20 a 30 linhas sobre o tema "${theme}". (Modo de demonstração: tema escolhido de uma lista fixa.)` };
}

// Erros comuns detectáveis sem IA (modo de demonstração).
const RULES: { re: RegExp; category: EssayEvaluation["annotations"][number]["category"]; message: string; fix: (m: string) => string }[] = [
  { re: /\s+,/g, category: "PONTUACAO", message: "Não use espaço antes da vírgula.", fix: (m) => m.trim() },
  { re: /\b[Aa] gente vamos\b/g, category: "CONCORDANCIA", message: "\"A gente\" pede o verbo na 3ª pessoa do singular.", fix: (m) => m.replace(/vamos/, "vai") },
  { re: /\bhaviam\b/gi, category: "CONCORDANCIA", message: "O verbo haver no sentido de existir é impessoal.", fix: () => "havia" },
  { re: /\bmenas\b/gi, category: "ORTOGRAFIA", message: "A palavra \"menos\" não varia.", fix: () => "menos" },
  { re: /\bpra\b/gi, category: "ESTILO", message: "Em texto formal, use \"para\".", fix: () => "para" },
  { re: /\bconcerteza\b/gi, category: "ORTOGRAFIA", message: "Escreve-se separado.", fix: () => "com certeza" },
  { re: /\bmais porém\b/gi, category: "COESAO", message: "Redundância: use só \"porém\" ou \"mas\".", fix: () => "porém" },
  { re: /[.!?]\s+[a-zà-ú]\w*/g, category: "ORTOGRAFIA", message: "Inicie a frase com letra maiúscula.", fix: (m) => m.replace(/([.!?]\s+)(\p{Ll})/u, (_, p, c) => p + c.toUpperCase()) },
];

export function evaluateEssay(input: { text: string; criteria: { key: string; max: number; step?: number }[] }): EssayEvaluation {
  const annotations: EssayEvaluation["annotations"] = [];
  for (const r of RULES) {
    for (const m of input.text.matchAll(r.re)) {
      annotations.push({ quote: m[0].trim() || m[0], category: r.category, message: r.message, suggestion: r.fix(m[0]).trim() });
      if (annotations.length >= 20) break;
    }
  }
  const words = input.text.trim().split(/\s+/).length;
  const quality = Math.max(0.2, Math.min(1, (words / 250) * 0.6 + 0.6 - annotations.length * 0.05));
  return {
    criteria: input.criteria.map((c) => ({ key: c.key, score: c.max * quality, comment: "Avaliação automática de demonstração (configure a IA para uma correção real)." })),
    annotations,
    strengths: ["Você concluiu o texto e se manteve no assunto."],
    tips: ["Revise a pontuação antes de entregar.", "Varie os conectivos entre os parágrafos.", "Configure a chave da IA para uma correção completa."],
    summary: `Modo de demonstração: encontramos ${annotations.length} ponto(s) de atenção com regras simples.`,
  };
}
