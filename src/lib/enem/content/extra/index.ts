import type { EnemLesson } from "../types";
import { MATEMATICA_1 } from "./matematica-1";
import { MATEMATICA_2 } from "./matematica-2";
import { MATEMATICA_3 } from "./matematica-3";

/** Aulas novas de cada matéria (entram no fim da lista: o número e o id das aulas antigas não mudam). */
export const EXTRA: Record<string, EnemLesson[]> = {
  matematica: [...MATEMATICA_1, ...MATEMATICA_2, ...MATEMATICA_3],
};
