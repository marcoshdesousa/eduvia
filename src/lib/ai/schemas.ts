import { z } from "zod";

export const OutlineSchema = z.object({
  topics: z.array(
    z.object({
      subject: z.string().describe("Disciplina/matéria a que o tópico pertence"),
      title: z.string(),
      description: z.string().describe("Uma frase sobre o que o tópico cobre"),
      pageStart: z.number().int(),
      pageEnd: z.number().int(),
      difficulty: z.number().int().describe("1 (fácil) a 5 (difícil)"),
    }),
  ),
});
export type Outline = z.infer<typeof OutlineSchema>;

export const SyllabusSchema = z.object({
  banca: z.string().nullable().describe("Banca organizadora, se houver"),
  cargo: z.string().nullable(),
  questionStyle: z.enum(["MULTIPLA_ESCOLHA", "CERTO_ERRADO"]),
  examDate: z.string().nullable().describe("Data da prova no formato AAAA-MM-DD, se informada"),
  subjects: z.array(
    z.object({
      name: z.string(),
      weight: z.number().describe("Peso relativo: nº de questões × peso por questão, ou 1 se não houver"),
      topics: z.array(z.object({ title: z.string(), difficulty: z.number().int().describe("1 a 5") })),
    }),
  ),
});
export type Syllabus = z.infer<typeof SyllabusSchema>;

export const SessionContentSchema = z.object({
  studyText: z.string().describe("Texto de estudo em Markdown, com subtítulos (##), listas e exemplos"),
  highlights: z.array(z.string()).describe("3 a 5 destaques: frases essenciais para memorizar"),
  keyPoints: z.array(z.object({ term: z.string(), explanation: z.string() })).describe("Para entender: conceitos-chave"),
  recallQuestions: z.array(
    z.object({
      question: z.string().describe("Pergunta aberta para responder sem consultar o material"),
      expectedAnswer: z.string().describe("Resposta-modelo com os pontos essenciais"),
      source: z.string().describe("Rótulo do trecho usado, ex.: T3"),
    }),
  ),
  objectiveQuestions: z.array(
    z.object({
      statement: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number().int(),
      explanation: z.string().describe("Por que a correta está certa e as outras erradas"),
      difficulty: z.number().int().describe("1 a 5"),
      source: z.string().describe("Rótulo do trecho usado, ex.: T3"),
    }),
  ),
  sources: z.array(z.string()).describe("Rótulos dos trechos usados no texto de estudo"),
});
export type SessionContent = z.infer<typeof SessionContentSchema>;

export const GradeSchema = z.object({
  score: z.number().describe("0 a 1"),
  verdict: z.enum(["CORRETA", "PARCIAL", "INCORRETA"]),
  feedback: z.string().describe("Feedback curto, direto ao aluno, em 2ª pessoa"),
  missingPoints: z.array(z.string()),
});
export type Grade = z.infer<typeof GradeSchema>;

export const OcrSchema = z.object({
  pages: z.array(z.object({ page: z.number().int(), text: z.string() })),
});
