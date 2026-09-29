// Tarefas de IA do Eduvia. Cada função tem uma versão real (Gemini, com a chave do aluno) e uma simulada (modo mock).
import { callStructured, isMockAi } from "./client";
import * as mock from "./mock";
import {
  GradeSchema,
  OcrSchema,
  QuestionSetSchema,
  type QuestionSet,
  EssayThemeSchema,
  EssayEvaluationSchema,
  type EssayTheme,
  type EssayEvaluation,
  OutlineSchema,
  SessionContentSchema,
  SyllabusSchema,
  type Grade,
  type Outline,
  type SessionContent,
  type Syllabus,
} from "./schemas";

export const PROMPT_VERSION = "v1";

const BASE = `Você é o motor pedagógico do Eduvia, uma plataforma de estudos em português do Brasil.
Regras gerais:
- Escreva sempre em português do Brasil.
- Use SOMENTE o conteúdo fornecido pelo aluno. Não invente fatos, leis, datas ou números que não estejam no material.
- Se o material for insuficiente para algo, diga isso de forma breve em vez de inventar.`;

// ───────────── Índice do material ─────────────

export async function extractOutline(input: {
  userId: string;
  materialTitle: string;
  subjectHint: string | null;
  existingSubjects: string[];
  pages: { page: number; text: string }[];
}): Promise<Outline> {
  if (isMockAi()) return mock.extractOutline(input);
  const view = condensedView(input.pages);
  return callStructured({
    task: "outline",
    userId: input.userId,
    schema: OutlineSchema,
    maxTokens: 16000,
    system: `${BASE}
Tarefa: montar o índice de estudo de um material enviado pelo aluno.
- Divida o conteúdo em tópicos estudáveis (cada um com 5 a 40 páginas, conforme a densidade), seguindo o sumário/títulos do material quando existirem.
- Informe pageStart/pageEnd reais (os marcadores [p.N] indicam a página).
- Ignore capa, sumário, referências e páginas em branco.
- "subject" é a disciplina. Se o aluno já indicou a disciplina, use exatamente esse nome em todos os tópicos. Prefira reutilizar disciplinas existentes.
- "books": para cada disciplina do material, 2 ou 3 livros conhecidos e reais (título e autor) para o aluno ler nos momentos de descanso. Só indique livros que você tem certeza de que existem.`,
    content: `Material: "${input.materialTitle}"
Disciplina indicada pelo aluno: ${input.subjectHint ?? "(não indicada)"}
Disciplinas já existentes na preparação: ${input.existingSubjects.join(", ") || "(nenhuma)"}

Conteúdo (páginas iniciais completas; demais páginas resumidas pelo início):
${view}`,
  });
}

/** Primeiras páginas completas (sumário) + início das demais (títulos). Controla custo em PDFs grandes. */
function condensedView(pages: { page: number; text: string }[]): string {
  const FULL = 12;
  const HEAD = 350;
  const MAX = 240_000;
  let out = "";
  for (const p of pages) {
    const t = p.page <= FULL ? p.text.slice(0, 6000) : p.text.slice(0, HEAD);
    out += `\n[p.${p.page}]\n${t.trim()}\n`;
    if (out.length > MAX) break;
  }
  return out;
}

// ───────────── Edital / ementa / matriz ─────────────

export async function analyzeSyllabus(input: {
  userId: string;
  role: "EDITAL" | "EMENTA";
  studentTypeLabel: string;
  text: string;
}): Promise<Syllabus> {
  if (isMockAi()) return mock.analyzeSyllabus(input.text);
  return callStructured({
    task: "edital",
    userId: input.userId,
    schema: SyllabusSchema,
    maxTokens: 32000,
    system: `${BASE}
Tarefa: ler um ${input.role === "EDITAL" ? "edital de concurso" : "documento de conteúdo programático (ementa, matriz ou programa)"} e extrair a estrutura do que será cobrado.
- Liste cada disciplina com seus assuntos exatamente como aparecem (quebre listas longas em assuntos individuais, sem perder nenhum).
- weight: se o edital trouxer número de questões e/ou peso, use nº de questões × peso; caso contrário use 1.
- questionStyle: CERTO_ERRADO se a prova for de julgamento de itens (ex.: Cebraspe/CESPE); senão MULTIPLA_ESCOLHA.
- difficulty: estimativa de 1 a 5 para um estudante do perfil "${input.studentTypeLabel}".
- Se houver vários cargos, use o conteúdo comum + o do primeiro cargo listado e informe esse cargo.`,
    content: input.text.slice(0, 400_000),
  });
}

// ───────────── Sessão de estudo ─────────────

export type RetrievedChunk = { label: string; materialTitle: string; pageStart: number; pageEnd: number; content: string };

export async function generateSessionContent(input: {
  userId: string;
  voice: string;
  topicTitle: string;
  subjectName: string;
  part: number;
  partCount: number;
  minutes: number;
  questionStyle: "MULTIPLE_CHOICE" | "CERTO_ERRADO";
  optionsCount: number;
  chunks: RetrievedChunk[];
}): Promise<SessionContent> {
  const readingMinutes = Math.max(3, Math.round(input.minutes * 0.55));
  const objectiveCount = clamp(Math.round(input.minutes / 3), 3, 10);
  const recallCount = clamp(Math.round(input.minutes / 12), 1, 3);
  if (isMockAi()) return mock.generateSessionContent({ ...input, objectiveCount, recallCount });

  const styleRule =
    input.questionStyle === "CERTO_ERRADO"
      ? `Questões objetivas no formato CERTO/ERRADO: cada item é uma afirmação e options = ["Certo", "Errado"].`
      : `Questões objetivas de múltipla escolha com exatamente ${input.optionsCount} alternativas, uma só correta, distratores plausíveis. Não prefixe as alternativas com letras.`;

  return callStructured({
    task: "session",
    userId: input.userId,
    schema: SessionContentSchema,
    maxTokens: 24000,
    system: `${BASE}
Tarefa: montar uma sessão de estudo a partir dos trechos do material do aluno (rotulados T1, T2...).
- studyText: explicação clara e bem organizada, para ~${readingMinutes} minutos de leitura. Não copie o material: explique, organize, dê exemplos. Cite o rótulo do trecho entre colchetes quando usar uma informação específica, ex.: [T2].
- highlights: 3 a 5 frases essenciais.
- keyPoints: 3 a 6 conceitos-chave com explicação curta.
- recallQuestions: ${recallCount} pergunta(s) de recuperação ativa (resposta aberta curta, sem consultar).
- objectiveQuestions: ${objectiveCount} questões. ${styleRule} Varie a posição da resposta correta.
- Todas as questões precisam ser respondíveis com base nos trechos fornecidos.`,
    content: [
      {
        type: "text",
        text: `Perfil do aluno: ${input.voice}
Disciplina: ${input.subjectName}
Assunto: ${input.topicTitle}${input.partCount > 1 ? ` (parte ${input.part} de ${input.partCount})` : ""}
Duração da sessão: ${input.minutes} minutos.

Trechos do material:
${input.chunks.map((c) => `<trecho rotulo="${c.label}" arquivo="${c.materialTitle}" paginas="${c.pageStart}-${c.pageEnd}">\n${c.content}\n</trecho>`).join("\n")}`,
      },
    ],
  });
}

// ───────────── Correção de resposta aberta ─────────────

export async function gradeOpenAnswer(input: {
  userId: string;
  voice: string;
  question: string;
  expectedAnswer: string;
  answer: string;
}): Promise<Grade> {
  if (!input.answer.trim()) {
    return { score: 0, verdict: "INCORRETA", feedback: "Você não respondeu. Tente escrever o que lembrar, mesmo que incompleto.", missingPoints: [] };
  }
  if (isMockAi()) return mock.gradeOpenAnswer(input);
  return callStructured({
    task: "grade",
    userId: input.userId,
    schema: GradeSchema,
    maxTokens: 4000,
    system: `${BASE}
Tarefa: avaliar a resposta aberta de um aluno numa pergunta de recuperação ativa.
- Compare com a resposta-modelo. Avalie o conteúdo, não a gramática nem as palavras exatas.
- score de 0 a 1. CORRETA (>= 0.75), PARCIAL (0.4 a 0.74), INCORRETA (< 0.4).
- feedback: 1 a 3 frases, encorajador e específico, dizendo o que faltou ou estava errado.`,
    content: `Perfil do aluno: ${input.voice}
Pergunta: ${input.question}
Resposta-modelo: ${input.expectedAnswer}
Resposta do aluno: ${input.answer}`,
  });
}

// ───────────── OCR de páginas escaneadas ─────────────

export async function ocrPdfPages(input: { userId: string; pdfBase64: string; pageNumbers: number[] }) {
  if (isMockAi()) return input.pageNumbers.map((page) => ({ page, text: "" }));
  const res = await callStructured({
    task: "ocr",
    userId: input.userId,
    schema: OcrSchema,
    maxTokens: 32000,
    system: `Transcreva fielmente o texto das páginas do documento, na ordem de leitura. Mantenha títulos e listas. Descreva tabelas em texto corrido. Não resuma nem corrija.`,
    content: [
      { type: "pdf", data: input.pdfBase64 },
      { type: "text", text: `O documento contém as páginas originais ${input.pageNumbers.join(", ")} (nesta ordem). Retorne o texto de cada uma usando esses números.` },
    ],
  });
  return res.pages;
}

export async function ocrImage(input: { userId: string; base64: string; mediaType: "image/png" | "image/jpeg" | "image/webp" }) {
  if (isMockAi()) return "";
  const res = await callStructured({
    task: "ocr",
    userId: input.userId,
    schema: OcrSchema,
    maxTokens: 16000,
    system: `Transcreva fielmente o texto da imagem, na ordem de leitura. Não resuma.`,
    content: [
      { type: "image", mediaType: input.mediaType, data: input.base64 },
      { type: "text", text: "Retorne como página 1." },
    ],
  });
  return res.pages.map((p) => p.text).join("\n");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// ───────────── Banco de questões (jogos e simulados) ─────────────

export async function generateQuestionSet(input: {
  userId: string;
  voice: string;
  topicTitle: string;
  subjectName: string;
  count: number;
  questionStyle: "MULTIPLE_CHOICE" | "CERTO_ERRADO";
  optionsCount: number;
  avoid: string[];
  chunks: RetrievedChunk[];
  purpose: "jogo" | "simulado";
}): Promise<QuestionSet> {
  if (isMockAi()) {
    const c = mock.generateSessionContent({ ...input, objectiveCount: input.count, recallCount: 0 });
    return { questions: c.objectiveQuestions.filter((q) => !input.avoid.includes(q.statement)) };
  }
  const styleRule =
    input.questionStyle === "CERTO_ERRADO"
      ? `Formato CERTO/ERRADO: cada item é uma afirmação e options = ["Certo", "Errado"]. Equilibre itens certos e errados.`
      : `Múltipla escolha com exatamente ${input.optionsCount} alternativas, uma só correta, distratores plausíveis, sem letras no início. Varie a posição da correta.`;
  const purposeRule =
    input.purpose === "jogo"
      ? "As questões são para um jogo de rapidez: enunciados CURTOS (até 2 linhas) e alternativas curtas, respondíveis em poucos segundos por quem estudou."
      : "As questões são para um simulado: nível de prova real, com enunciados completos e contextualizados quando fizer sentido.";
  return callStructured({
    task: "questions",
    userId: input.userId,
    schema: QuestionSetSchema,
    maxTokens: 24000,
    system: `${BASE}
Tarefa: criar questões objetivas a partir dos trechos do material do aluno (rotulados T1, T2...).
- ${purposeRule}
- ${styleRule}
- Todas as questões precisam ser respondíveis com base nos trechos. Cubra pontos diferentes do conteúdo.
- Não repita nem reformule levemente as questões listadas como já existentes.`,
    content: `Perfil do aluno: ${input.voice}
Disciplina: ${input.subjectName}
Assunto: ${input.topicTitle}
Quantidade: ${input.count} questões.
Questões já existentes (não repetir):
${input.avoid.slice(0, 40).map((a) => `- ${a.slice(0, 160)}`).join("\n") || "(nenhuma)"}

Trechos do material:
${input.chunks.map((c) => `<trecho rotulo="${c.label}" arquivo="${c.materialTitle}" paginas="${c.pageStart}-${c.pageEnd}">\n${c.content}\n</trecho>`).join("\n")}`,
  });
}

// ───────────── Redação ─────────────

export async function suggestEssayTheme(input: { userId: string; voice: string; rubricLabel: string; genre: string; context: string }): Promise<EssayTheme> {
  if (isMockAi()) return mock.suggestEssayTheme(input.rubricLabel);
  return callStructured({
    task: "essay",
    userId: input.userId,
    schema: EssayThemeSchema,
    maxTokens: 4000,
    system: `${BASE}
Tarefa: propor um tema de redação no estilo "${input.rubricLabel}" (gênero: ${input.genre}).
- Tema atual, relevante e adequado ao perfil do aluno. Se houver contexto do que ele estuda, aproveite.
- instructions: como numa prova real (o que deve ser feito, extensão sugerida) e, se fizer sentido, um texto motivador curto escrito por você.`,
    content: `Perfil do aluno: ${input.voice}\nO que o aluno estuda: ${input.context || "(não informado)"}`,
  });
}

export async function evaluateEssay(input: {
  userId: string;
  voice: string;
  rubricLabel: string;
  genre: string;
  criteria: { key: string; name: string; max: number; description: string; step?: number }[];
  theme: string;
  instructions: string | null;
  text: string;
}): Promise<EssayEvaluation> {
  if (isMockAi()) return mock.evaluateEssay(input);
  return callStructured({
    task: "essay",
    userId: input.userId,
    schema: EssayEvaluationSchema,
    maxTokens: 24000,
    system: `${BASE}
Tarefa: corrigir uma redação como um corretor experiente e justo, no padrão "${input.rubricLabel}" (gênero esperado: ${input.genre}).
Critérios (devolva exatamente estas chaves em "criteria", com nota e comentário de 1 a 3 frases):
${input.criteria.map((c) => `- ${c.key} — ${c.name} (0 a ${c.max}${c.step ? `, em múltiplos de ${c.step}` : ""}): ${c.description}`).join("\n")}
Anotações:
- Marque problemas concretos: ortografia, acentuação, pontuação (vírgulas!), concordância, regência, coesão, coerência, estrutura, fuga ao tema, estilo.
- "quote" deve ser um trecho copiado EXATAMENTE do texto do aluno, curto, para podermos destacá-lo. Um problema por anotação.
- "suggestion" mostra o trecho reescrito corretamente.
- Até 25 anotações, priorizando as mais importantes.
Também: 2 a 4 pontos fortes, 3 a 5 dicas práticas de melhoria e um resumo geral (2 a 3 frases). Fale diretamente com o aluno, em tom encorajador.`,
    content: `Perfil do aluno: ${input.voice}
Tema: ${input.theme}
${input.instructions ? `Instruções da proposta: ${input.instructions}\n` : ""}
<redacao>
${input.text}
</redacao>`,
  });
}
