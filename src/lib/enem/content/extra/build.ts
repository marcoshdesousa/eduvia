import type { EnemLesson } from "../types";

/** Pergunta de marcar: [enunciado, 5 alternativas, índice da certa (0 = A), explicação]. */
export type C = [string, [string, string, string, string, string], number, string];
/** Pergunta de escrever: [enunciado, resposta esperada]. */
export type O = [string, string];

/** Monta uma aula no formato do Estudar ENEM (forma curta para escrever muitas aulas). */
export function aula(
  title: string,
  content: string,
  highlights: string[],
  keyPoints: [string, string][],
  choices: C[],
  open: O[],
  essay?: { theme: string; instructions: string },
): EnemLesson {
  return {
    title,
    content: content.trim(),
    highlights,
    keyPoints: keyPoints.map(([term, explanation]) => ({ term, explanation })),
    quiz: {
      choices: choices.map(([q, options, answer, explanation]) => ({ q, options: [...options], answer, explanation })),
      open: open.map(([q, expected]) => ({ q, expected })),
    },
    ...(essay ? { essay } : {}),
  };
}
