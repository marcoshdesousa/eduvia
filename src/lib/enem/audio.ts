// Pré-preparo da voz das aulas do Estudar ENEM: as aulas são iguais para todo mundo, então o servidor deixa
// pronto (e guardado) o começo de cada aula. Assim o robô começa a falar na hora para qualquer aluno.
// Só trabalha quando ninguém está usando a voz, para nunca atrasar quem quer ouvir.
import { setTimeout as sleep } from "node:timers/promises";
import { speak } from "@/lib/ai/tts";
import { piperBusy, piperRecentlyUsed } from "@/lib/ai/piper";
import { toBlocks, toSpeech } from "@/lib/speech-text";
import { MATERIAS } from "./catalog";

/** Quantos pedaços do começo de cada aula ficam prontos (o resto é baixado enquanto o robô fala). */
const BLOCKS_PER_LESSON = 2;

export async function prewarmEnemAudio() {
  await sleep(120_000); // deixa o servidor terminar de subir
  let made = 0;
  // uma aula de cada matéria por vez: as primeiras aulas de todas ficam prontas primeiro
  const longest = Math.max(...MATERIAS.map((m) => m.lessons.length));
  for (let li = 0; li < longest; li++) {
    for (const m of MATERIAS) {
      const lesson = m.lessons[li];
      if (!lesson) continue;
      for (const b of toBlocks(toSpeech(lesson.content)).slice(0, BLOCKS_PER_LESSON)) {
        while (piperBusy() || piperRecentlyUsed()) await sleep(15_000);
        try {
          await speak(b.text, "low"); // já pronto: só lê do disco
          made++;
        } catch (e) {
          console.error("[voz] pré-preparo ENEM", (e as Error).message);
          return;
        }
      }
    }
  }
  console.log(`[voz] começo das aulas do ENEM pronto (${made} trechos)`);
}
