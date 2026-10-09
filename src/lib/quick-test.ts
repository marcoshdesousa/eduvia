// Teste rápido: questões reais do ENEM, cronometradas (as mesmas do banco dos simulados).
// Cada teste é salvo e não pode ser refeito; os erros vão para o banco de erros e acertos tiram de lá.

export const QUICK_TEST_SLUG = "teste-rapido";
export const QUICK_COUNTS = [10, 15, 20] as const;
/** Tempo por pergunta (as questões do ENEM têm texto para ler): 1, 2 ou 3 minutos. */
export const QUICK_SECONDS = [60, 120, 180] as const;
/** Áreas do teste rápido ("todas" mistura as quatro). */
export const QUICK_AREAS = [
  { key: "todas", label: "Todas as áreas" },
  { key: "linguagens", label: "Linguagens" },
  { key: "humanas", label: "Ciências Humanas" },
  { key: "natureza", label: "Ciências da Natureza" },
  { key: "matematica", label: "Matemática" },
] as const;
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
    // testes antigos tinham 10 a 30 s por pergunta: continuam com o tempo deles
    seconds: Number.isFinite(seconds) && seconds >= 5 && seconds <= 600 ? seconds : 120,
  };
}
