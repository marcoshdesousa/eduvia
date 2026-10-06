// Estudar ENEM: preparação fixa da plataforma (igual para todo mundo, sem IA). Cada aluno tem o próprio progresso.
// As aulas são textos prontos (com o robô narrador) e as perguntas são questões reais das provas do ENEM (INEP, 2009–2023).
import type { EnemLesson } from "./content/types";
import { LINGUAGENS } from "./content/linguagens";
import { HUMANAS } from "./content/humanas";
import { NATUREZA } from "./content/natureza";
import { MATEMATICA } from "./content/matematica";

export const ENEM_PREP_ID = "enem";
/** Dono técnico da preparação fixa (não é uma conta de verdade: sem CPF, não entra em listas nem no login). */
export const SYSTEM_USER_ID = "sistema-eduvia";
export const ENEM_TITLE = "Estudar ENEM";

export type AreaKey = "linguagens" | "humanas" | "natureza" | "matematica";

/** As quatro áreas da prova, como o ENEM corrige. Cada uma tem um "banco" com as questões reais. */
export const AREAS: { key: AreaKey; name: string; short: string; subjectId: string; topicId: string }[] = [
  { key: "linguagens", name: "Linguagens, Códigos e suas Tecnologias", short: "Linguagens", subjectId: "enem-area-linguagens", topicId: "enem-banco-linguagens" },
  { key: "humanas", name: "Ciências Humanas e suas Tecnologias", short: "Ciências Humanas", subjectId: "enem-area-humanas", topicId: "enem-banco-humanas" },
  { key: "natureza", name: "Ciências da Natureza e suas Tecnologias", short: "Ciências da Natureza", subjectId: "enem-area-natureza", topicId: "enem-banco-natureza" },
  { key: "matematica", name: "Matemática e suas Tecnologias", short: "Matemática", subjectId: "enem-area-matematica", topicId: "enem-banco-matematica" },
];
export const areaOf = (key: AreaKey) => AREAS.find((a) => a.key === key)!;

export type Materia = {
  slug: string;
  name: string;
  area: AreaKey;
  /** língua estrangeira: as perguntas vêm só das questões de inglês ou de espanhol */
  lang?: "ingles" | "espanhol";
  lessons: EnemLesson[];
};

export const MATERIAS: Materia[] = [...LINGUAGENS, ...HUMANAS, ...NATUREZA, ...MATEMATICA];

export const materiaSubjectId = (slug: string) => `enem-m-${slug}`;
export const lessonTopicId = (materia: string, lesson: number) => `enem-a-${materia}-${lesson + 1}`;
export const findMateria = (slug: string) => MATERIAS.find((m) => m.slug === slug) ?? null;

/** Aula pelo id do assunto (ex.: enem-a-biologia-2). */
export function findLesson(topicId: string) {
  for (const m of MATERIAS) {
    const i = m.lessons.findIndex((_, n) => lessonTopicId(m.slug, n) === topicId);
    if (i >= 0) return { materia: m, index: i, lesson: m.lessons[i] };
  }
  return null;
}

export const isEnemQuestion = (questionId: string) => questionId.startsWith("enem-");

/** Perguntas por aula (questões do ENEM da matéria, não só do que foi estudado). */
export const LESSON_QUESTIONS = 10;
/** Tempo estimado de cada aula (texto + 10 questões). */
export const LESSON_MINUTES = 25;

// ───────────── Simulado ENEM: como a prova real ─────────────

export type EnemExamKind = "dia1-ingles" | "dia1-espanhol" | "dia2" | "linguagens-ingles" | "linguagens-espanhol" | "humanas" | "natureza" | "matematica";

/**
 * Provas do simulado. Os dias seguem o ENEM: 1º dia com 90 questões (5 de língua estrangeira, 40 de Linguagens
 * e 45 de Ciências Humanas) em 5h30; 2º dia com 90 questões (45 de Ciências da Natureza e 45 de Matemática) em 5h.
 * Por área: as 45 questões da área, com metade do tempo do dia dela.
 */
export const ENEM_EXAMS: Record<EnemExamKind, { title: string; minutes: number; parts: { area: AreaKey; count: number; lang?: "ingles" | "espanhol" | null }[] }> = {
  "dia1-ingles": { title: "Simulado ENEM — 1º dia (Inglês)", minutes: 330, parts: [{ area: "linguagens", count: 5, lang: "ingles" }, { area: "linguagens", count: 40, lang: null }, { area: "humanas", count: 45 }] },
  "dia1-espanhol": { title: "Simulado ENEM — 1º dia (Espanhol)", minutes: 330, parts: [{ area: "linguagens", count: 5, lang: "espanhol" }, { area: "linguagens", count: 40, lang: null }, { area: "humanas", count: 45 }] },
  dia2: { title: "Simulado ENEM — 2º dia", minutes: 300, parts: [{ area: "natureza", count: 45 }, { area: "matematica", count: 45 }] },
  "linguagens-ingles": { title: "Simulado ENEM — Linguagens (Inglês)", minutes: 165, parts: [{ area: "linguagens", count: 5, lang: "ingles" }, { area: "linguagens", count: 40, lang: null }] },
  "linguagens-espanhol": { title: "Simulado ENEM — Linguagens (Espanhol)", minutes: 165, parts: [{ area: "linguagens", count: 5, lang: "espanhol" }, { area: "linguagens", count: 40, lang: null }] },
  humanas: { title: "Simulado ENEM — Ciências Humanas", minutes: 165, parts: [{ area: "humanas", count: 45 }] },
  natureza: { title: "Simulado ENEM — Ciências da Natureza", minutes: 150, parts: [{ area: "natureza", count: 45 }] },
  matematica: { title: "Simulado ENEM — Matemática", minutes: 150, parts: [{ area: "matematica", count: 45 }] },
};
export const isEnemExamKind = (k: string): k is EnemExamKind => k in ENEM_EXAMS;
