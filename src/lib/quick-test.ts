// Teste rápido: perguntas cronometradas sobre o material do aluno (substitui os antigos jogos).
// Cada teste é salvo e não pode ser refeito; os erros vão para o banco de erros e acertos tiram de lá.

export const QUICK_TEST_SLUG = "teste-rapido";
export const QUICK_COUNTS = [10, 15, 20] as const;
export const QUICK_SECONDS = [10, 15, 20, 30] as const;
/** Fração máxima de perguntas que o aluno já acertou antes (o foco é o que errou e o que é novo). */
export const QUICK_MAX_CORRECT_SHARE = 0.1;

export type QuickQuestion = { id: string; type: "MULTIPLE_CHOICE" | "CERTO_ERRADO" | "OPEN_RECALL"; statement: string; options: string[] };
export type QuickAnswerResult = { isCorrect: boolean; correctAnswer: string; explanation: string };
export type QuickConfig = { count: number; seconds: number };

export function parseQuickConfig(raw: unknown): QuickConfig {
  const c = (raw ?? {}) as Record<string, unknown>;
  const count = Number(c.count);
  const seconds = Number(c.seconds);
  return {
    count: (QUICK_COUNTS as readonly number[]).includes(count) ? count : 10,
    seconds: (QUICK_SECONDS as readonly number[]).includes(seconds) ? seconds : 20,
  };
}
