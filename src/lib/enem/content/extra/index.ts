import type { EnemLesson } from "../types";
import { MATEMATICA_1 } from "./matematica-1";
import { MATEMATICA_2 } from "./matematica-2";
import { MATEMATICA_3 } from "./matematica-3";
import { BIOLOGIA_1 } from "./biologia-1";
import { BIOLOGIA_2 } from "./biologia-2";
import { FISICA_1 } from "./fisica-1";
import { QUIMICA_1 } from "./quimica-1";

/** Aulas novas de cada matéria (entram no fim da lista: o número e o id das aulas antigas não mudam). */
export const EXTRA: Record<string, EnemLesson[]> = {
  matematica: [...MATEMATICA_1, ...MATEMATICA_2, ...MATEMATICA_3],
  biologia: [...BIOLOGIA_1, ...BIOLOGIA_2],
  fisica: [...FISICA_1],
  quimica: [...QUIMICA_1],
};
