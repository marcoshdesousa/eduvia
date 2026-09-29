"use client";
import type { ComponentType } from "react";
import type { GameProps } from "./types";
import { SnakeGame } from "./cobrinha/snake-game";

/** Componente de cada jogo do catálogo (src/games/catalog.ts). */
export const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  cobrinha: SnakeGame,
};
