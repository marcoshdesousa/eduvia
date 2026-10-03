import type { StudentType } from "@/generated/prisma/enums";

export type StudentProfile = {
  label: string;
  description: string;
  /** Instruções de linguagem/nível para a IA. */
  voice: string;
  /** Multiplicador do tempo estimado de estudo por volume de conteúdo. */
  paceFactor: number;
  defaultQuestionType: "MULTIPLE_CHOICE" | "CERTO_ERRADO";
  optionsCount: number;
};

export const PROFILES: Record<StudentType, StudentProfile> = {
  FUNDAMENTAL: {
    label: "Ensino fundamental",
    description: "Do 1º ao 9º ano",
    voice:
      "O aluno está no ensino fundamental. Use frases curtas, vocabulário simples, exemplos do cotidiano e tom encorajador. Explique qualquer termo técnico.",
    paceFactor: 1.3,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 4,
  },
  MEDIO: {
    label: "Ensino médio",
    description: "1º ao 3º ano",
    voice:
      "O aluno está no ensino médio. Explique com clareza e didática, com exemplos e sem jargão desnecessário.",
    paceFactor: 1.15,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 5,
  },
  ENEM_VESTIBULAR: {
    label: "Vestibular / ENEM",
    description: "Provas de ingresso no ensino superior",
    voice:
      "O aluno se prepara para ENEM/vestibular. Explique de forma didática e contextualizada, ligando o conteúdo a situações-problema como nas provas. Questões no estilo ENEM: texto-base curto quando fizer sentido e 5 alternativas (A–E).",
    paceFactor: 1,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 5,
  },
  FACULDADE: {
    label: "Faculdade",
    description: "Matéria de graduação",
    voice:
      "O aluno está na graduação. Use linguagem técnica adequada à disciplina, com rigor conceitual e profundidade.",
    paceFactor: 1,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 5,
  },
  CONCURSO: {
    label: "Concurso público",
    description: "Com base no edital",
    voice:
      "O aluno se prepara para concurso público. Seja objetivo e preciso, destaque literalidade de lei, exceções e pegadinhas comuns de banca. Imite o estilo da banca quando informado.",
    paceFactor: 0.9,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 5,
  },
  CURSINHO: {
    label: "Cursinho / curso livre",
    description: "Cursos preparatórios e livres",
    voice: "O aluno faz um cursinho ou curso livre. Explique com clareza e objetividade.",
    paceFactor: 1,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 4,
  },
  LIVRE: {
    label: "Outro / estudo livre",
    description: "Qualquer outro objetivo",
    voice: "O aluno estuda por conta própria. Explique com clareza, exemplos e boa didática.",
    paceFactor: 1,
    defaultQuestionType: "MULTIPLE_CHOICE",
    optionsCount: 4,
  },
};

export const STUDENT_TYPES = Object.keys(PROFILES) as StudentType[];

/** Voz completa para a IA, incluindo detalhes específicos da preparação. */
export function profileVoice(type: StudentType, details: Record<string, unknown>, banca?: string | null): string {
  const parts = [PROFILES[type].voice];
  const d = details as Record<string, string | undefined>;
  if (d.grade) parts.push(`Série/ano: ${d.grade}.`);
  if (d.schoolSubject) parts.push(`Matéria: ${d.schoolSubject}.`);
  if (d.exam) parts.push(`Prova alvo: ${d.exam}.`);
  if (d.course) parts.push(`Curso: ${d.course}.`);
  if (d.discipline) parts.push(`Disciplina: ${d.discipline}.`);
  if (d.cargo) parts.push(`Cargo: ${d.cargo}.`);
  if (banca) parts.push(`Banca: ${banca}. Imite o estilo de questões dessa banca.`);
  return parts.join(" ");
}
