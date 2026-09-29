// Catálogo de jogos (metadados, usado no servidor e no cliente).
// Para criar um jogo novo: adicione a definição aqui e o componente em src/games/components.tsx.

export type GameConfigField = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  default: string;
};

export type GameMeta = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  /** Quantas questões separar para uma partida. */
  questionCount: number;
  configFields: GameConfigField[];
};

export const GAMES: GameMeta[] = [
  {
    slug: "cobrinha",
    name: "Jogo da cobrinha",
    description: "A cobra persegue seu ratinho. Acerte para ela se afastar; demore ou erre e ela chega mais perto.",
    emoji: "🐍",
    questionCount: 30,
    configFields: [
      {
        key: "speed",
        label: "Velocidade da cobra",
        default: "normal",
        options: [
          { value: "lenta", label: "Lenta" },
          { value: "normal", label: "Normal" },
          { value: "rapida", label: "Rápida" },
        ],
      },
      {
        key: "maxErrors",
        label: "Erros permitidos",
        default: "3",
        options: [
          { value: "1", label: "1" },
          { value: "3", label: "3" },
          { value: "5", label: "5" },
        ],
      },
    ],
  },
];

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug) ?? null;
}

/** Valida a configuração recebida contra as opções do jogo. */
export function sanitizeConfig(game: GameMeta, raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of game.configFields) {
    const v = String(raw[f.key] ?? f.default);
    out[f.key] = f.options.some((o) => o.value === v) ? v : f.default;
  }
  return out;
}

/** Pontuação de uma resposta certa: 100 + bônus de rapidez (até +100 para respostas em menos de 2 s). */
export function answerPoints(timeMs: number) {
  return 100 + Math.max(0, Math.round(100 - Math.max(0, timeMs - 2000) / 100));
}
