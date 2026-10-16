// Curso técnico: Alinhamento a laser com a TKSA 41 (SKF). Todo o conteúdo dos 30 slides do material do instrutor
// Geonilson Costa, com as imagens, em 5 aulas de 10 perguntas cada e um simulado final de 100 perguntas.
// É um curso de estudo separado: não entra nos simulados nem no teste rápido do ENEM, e não depende do plano.
import type { EnemLesson, QuizChoice } from "../types";
import { TKSA_AULA_1, TKSA_AULA_2 } from "./tksa41-aulas-1-2";
import { TKSA_AULA_3, TKSA_AULA_4 } from "./tksa41-aulas-3-4";
import { TKSA_AULA_5 } from "./tksa41-aula-5";
import { TKSA_SIMULADO_EXTRA } from "./tksa41-simulado";

/**
 * Gabarito espalhado entre A e E: a resposta certa de cada pergunta vai para uma letra diferente (em rodízio) e as
 * outras alternativas ficam na mesma ordem relativa. Assim ninguém acerta "chutando sempre a mesma letra".
 */
function spread(choices: QuizChoice[], start: number): QuizChoice[] {
  return choices.map((c, i) => {
    const target = (start + i * 3) % 5;
    const wrong = c.options.filter((_, k) => k !== c.answer);
    const options = [...wrong.slice(0, target), c.options[c.answer], ...wrong.slice(target)];
    return { ...c, options, answer: target };
  });
}

const AULAS: EnemLesson[] = [TKSA_AULA_1, TKSA_AULA_2, TKSA_AULA_3, TKSA_AULA_4, TKSA_AULA_5].map((a, n) => ({
  ...a,
  quiz: { choices: spread(a.quiz!.choices, n), open: [] },
}));

/** Mistura sempre igual (a ordem das perguntas do simulado não muda entre um deploy e outro). */
function mix<T>(list: T[]): T[] {
  const out = [...list];
  let seed = 41;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** As 50 perguntas das aulas + 50 novas = 100 perguntas do simulado final. */
const SIMULADO_CHOICES: QuizChoice[] = mix([
  ...AULAS.flatMap((a) => a.quiz!.choices),
  ...spread(TKSA_SIMULADO_EXTRA.map(([q, options, answer, explanation]) => ({ q, options: [...options], answer, explanation })), 2),
]);

const SIMULADO: EnemLesson = {
  title: "Simulado final: 100 perguntas",
  content: "## Simulado final\n\nSimulado com 100 perguntas de marcar sobre todo o conteúdo do alinhamento a laser com a TKSA 41.",
  highlights: ["100 perguntas de marcar.", "Cobre as 5 aulas do curso.", "Tire 75% ou mais para concluir o curso."],
  keyPoints: [
    { term: "Simulado final", explanation: "Prova com 100 perguntas sobre todo o curso." },
    { term: "75%", explanation: "Nota mínima para concluir." },
    { term: "Refazer", explanation: "Pode refazer quantas vezes quiser." },
  ],
  quiz: { choices: SIMULADO_CHOICES, open: [] },
  exam: true,
};

export const CURSO_TKSA41 = {
  slug: "tksa41",
  name: "Alinhamento a Laser · TKSA 41",
  area: "natureza" as const,
  course: {
    tagline: "Curso técnico: procedimentos de alinhamento a laser de máquinas rotativas com o modelo SKF TKSA 41.",
  },
  lessons: [...AULAS, SIMULADO],
};
