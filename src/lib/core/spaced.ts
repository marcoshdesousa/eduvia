import type { MasteryStatus } from "@/generated/prisma/enums";
import { addDays } from "./dates";

/** Intervalos (dias) da repetição por questão. Erro volta em 1 dia; acertos vão espaçando. */
export const QUESTION_STEPS = [1, 3, 7, 15, 30, 60];
/** Acertos seguidos necessários para uma questão sair do banco de erros. */
export const ERROR_BANK_EXIT_STREAK = 1;
/** Primeiro acerto já entra num degrau mais espaçado: acertos voltam com menos frequência que erros. */
const FIRST_CORRECT_STEP = 2;

export type ReviewState = {
  step: number;
  lapses: number;
  correctCount: number;
  inErrorBank: boolean;
};

export type ReviewUpdate = ReviewState & {
  dueAt: Date;
  lastResult: boolean;
  resolved: boolean;
};

/** Próximo estado de uma questão após uma resposta. `prev` nulo = primeira vez. */
export function nextReview(prev: ReviewState | null, correct: boolean, today: Date): ReviewUpdate {
  if (!correct) {
    return {
      step: 0,
      lapses: (prev?.lapses ?? 0) + 1,
      correctCount: 0,
      inErrorBank: true,
      dueAt: addDays(today, QUESTION_STEPS[0]),
      lastResult: false,
      resolved: false,
    };
  }
  const step = prev ? Math.min(prev.step + 1, QUESTION_STEPS.length - 1) : FIRST_CORRECT_STEP;
  const correctCount = (prev?.correctCount ?? 0) + 1;
  const leavesBank = !!prev?.inErrorBank && correctCount >= ERROR_BANK_EXIT_STREAK;
  return {
    step,
    lapses: prev?.lapses ?? 0,
    correctCount,
    inErrorBank: !!prev?.inErrorBank && !leavesBank,
    dueAt: addDays(today, QUESTION_STEPS[step]),
    lastResult: true,
    resolved: leavesBank,
  };
}

/** Datas das revisões do assunto (R1..Rn) a partir da conclusão. */
export function topicReviewDates(completedOn: Date, intervals: number[]): { reviewNumber: number; dueDate: Date }[] {
  return intervals.map((days, i) => ({ reviewNumber: i + 1, dueDate: addDays(completedOn, days) }));
}

export const MIN_ATTEMPTS_FOR_STATUS = 3;

export function masteryStatus(attempts: number, accuracy: number): MasteryStatus {
  if (attempts < MIN_ATTEMPTS_FOR_STATUS) return "SEM_DADOS";
  if (accuracy < 0.5) return "CRITICO";
  if (accuracy < 0.75) return "EM_DESENVOLVIMENTO";
  return "BOM";
}

export const MASTERY_LABEL: Record<MasteryStatus, string> = {
  SEM_DADOS: "Sem dados",
  CRITICO: "Crítico",
  EM_DESENVOLVIMENTO: "Em desenvolvimento",
  BOM: "Bom",
};
