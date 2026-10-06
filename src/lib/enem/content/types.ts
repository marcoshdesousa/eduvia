/** Aula pronta do Estudar ENEM: texto em markdown (lido pelo robô), destaques e termos para entender. */
export type EnemLesson = {
  title: string;
  content: string;
  highlights: string[];
  keyPoints: { term: string; explanation: string }[];
};
