/** Pergunta de marcar do quiz da aula (5 alternativas, como no ENEM). `answer` é o índice da certa (0 = A). */
export type QuizChoice = { q: string; options: string[]; answer: number; explanation: string };
/** Pergunta de escrever: o aluno responde com as próprias palavras e a IA compara com a resposta esperada. */
export type QuizOpen = { q: string; expected: string };

/** Aula pronta do Estudar ENEM: texto em markdown (lido pelo robô), destaques e termos para entender. */
export type EnemLesson = {
  title: string;
  content: string;
  highlights: string[];
  keyPoints: { term: string; explanation: string }[];
  /**
   * Quiz da aula (sobre o que foi estudado): 5 de marcar + 1 a 3 de escrever. Aulas antigas sem quiz próprio
   * usam questões reais do ENEM da matéria.
   */
  quiz?: { choices: QuizChoice[]; open: QuizOpen[] };
  /** Aula de prática de redação: além do quiz, propõe escrever uma redação sobre este tema. */
  essay?: { theme: string; instructions: string };
};
