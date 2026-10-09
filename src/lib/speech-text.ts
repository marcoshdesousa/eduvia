// Texto da aula → frases para o robô ler (usado no navegador e no servidor, que prepara o áudio antes).
import { stripSources } from "@/lib/sources";

/** Tamanho de cada pedaço de áudio: pequeno, para a porcentagem andar e o primeiro pedaço ficar pronto logo. */
export const BLOCK_CHARS = 900;

/** Tira a marcação de Markdown de um texto (linha por linha: cada linha continua sendo uma linha). */
export function plainSpeech(markdown: string) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`>|]/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\n{2,}/g, "\n");
}

/** Frases de uma linha de texto já sem marcação (as muito longas são cortadas em pedaços de até 200 letras). */
export function lineParts(line: string): string[] {
  const parts: string[] = [];
  for (const s of line.match(/[^.!?;:]+[.!?;:]*/g) ?? []) {
    const t = s.trim();
    if (!t) continue;
    if (t.length <= 220) parts.push(t);
    else parts.push(...(t.match(/.{1,200}(\s|$)/g) ?? [t]).map((x) => x.trim()));
  }
  return parts.filter((p) => /[\p{L}\p{N}]/u.test(p));
}

/** Tira a marcação do texto (Markdown e marcações de fonte como [T1]) e separa em frases para ler em voz alta. */
export function toSpeech(markdown: string, labels: string[] = []): string[] {
  return plainSpeech(stripSources(markdown, labels)).split("\n").flatMap(lineParts);
}

/** Os primeiros pedaços são menores: o primeiro fica pronto em poucos segundos e o robô já começa a falar. */
export const FIRST_BLOCKS = [260, 600];

/** Junta frases em blocos para a voz natural (poucos pedidos). Guarda quais frases estão em cada bloco. */
export function toBlocks(parts: string[], max = BLOCK_CHARS, first: number[] = FIRST_BLOCKS): { text: string; from: number; to: number }[] {
  const blocks: { text: string; from: number; to: number }[] = [];
  let cur = "";
  let from = 0;
  const limit = () => Math.min(max, first[blocks.length] ?? max);
  parts.forEach((p, i) => {
    if (cur && cur.length + p.length + 1 > limit()) {
      blocks.push({ text: cur, from, to: i - 1 });
      cur = "";
      from = i;
    }
    cur = cur ? `${cur}\n${p}` : p; // uma frase por linha: a voz faz uma pausa clara entre as frases
  });
  if (cur) blocks.push({ text: cur, from, to: parts.length - 1 });
  return blocks;
}
