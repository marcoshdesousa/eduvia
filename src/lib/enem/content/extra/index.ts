import type { EnemLesson } from "../types";
import { MATEMATICA_1 } from "./matematica-1";
import { MATEMATICA_2 } from "./matematica-2";
import { MATEMATICA_3 } from "./matematica-3";
import { BIOLOGIA_1 } from "./biologia-1";
import { BIOLOGIA_2 } from "./biologia-2";
import { FISICA_1 } from "./fisica-1";
import { QUIMICA_1 } from "./quimica-1";
import { HISTORIA_1 } from "./historia-1";
import { GEOGRAFIA_1 } from "./geografia-1";
import { PORTUGUES_1 } from "./portugues-1";
import { LITERATURA_1 } from "./literatura-1";
import { FILOSOFIA_1 } from "./filosofia-1";
import { SOCIOLOGIA_1 } from "./sociologia-1";
import { INGLES_1 } from "./ingles-1";
import { ESPANHOL_1 } from "./espanhol-1";
import { ARTES_1 } from "./artes-1";

/** Aulas novas de cada matéria (entram no fim da lista: o número e o id das aulas antigas não mudam). */
export const EXTRA: Record<string, EnemLesson[]> = {
  matematica: [...MATEMATICA_1, ...MATEMATICA_2, ...MATEMATICA_3],
  biologia: [...BIOLOGIA_1, ...BIOLOGIA_2],
  fisica: [...FISICA_1],
  quimica: [...QUIMICA_1],
  historia: [...HISTORIA_1],
  geografia: [...GEOGRAFIA_1],
  portugues: [...PORTUGUES_1],
  literatura: [...LITERATURA_1],
  filosofia: [...FILOSOFIA_1],
  sociologia: [...SOCIOLOGIA_1],
  ingles: [...INGLES_1],
  espanhol: [...ESPANHOL_1],
  artes: [...ARTES_1],
};
