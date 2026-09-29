export type GameQuestion = {
  id: string;
  type: "MULTIPLE_CHOICE" | "CERTO_ERRADO" | "OPEN_RECALL";
  statement: string;
  options: string[];
};

export type GameAnswerResult = { isCorrect: boolean; correctAnswer: string; explanation: string };

export type GameEndReason = "caught" | "errors" | "finished" | "quit";

export type GameProps = {
  questions: GameQuestion[];
  config: Record<string, string>;
  onAnswer: (questionId: string, answer: string, timeMs: number) => Promise<GameAnswerResult | null>;
  onFinish: (reason: GameEndReason) => void;
};
