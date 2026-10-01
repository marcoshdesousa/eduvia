// Garante que os assuntos de um material cobrem o PDF inteiro, sem buracos entre eles.

export type PageRange = { pageStart: number; pageEnd: number };

/**
 * Ordena os assuntos e estende as faixas de páginas para ficarem contíguas, da página 1 até a última:
 * o que a IA deixou de fora entra no assunto vizinho (nada do material fica sem aula).
 */
export function coverAllPages<T extends PageRange>(topics: T[], totalPages: number): T[] {
  const sorted = topics
    .map((t) => ({ ...t, pageStart: Math.max(1, Math.min(t.pageStart, t.pageEnd)), pageEnd: Math.max(t.pageStart, t.pageEnd) }))
    .sort((a, b) => a.pageStart - b.pageStart || a.pageEnd - b.pageEnd);
  if (!sorted.length || totalPages < 1) return sorted;
  sorted[0].pageStart = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const next = sorted[i + 1];
    // buraco entre um assunto e o próximo: o anterior vai até a página antes do próximo
    if (next.pageStart > sorted[i].pageEnd + 1) sorted[i].pageEnd = next.pageStart - 1;
  }
  const last = sorted[sorted.length - 1];
  last.pageEnd = Math.max(last.pageEnd, totalPages);
  return sorted;
}
