export type SourceRef = { label: string; materialId: string; title: string; pageStart: number; pageEnd: number; quote?: string };

/** Link para abrir a fonte dentro do app: o PDF na página certa, com o trecho grifado. */
export function sourceHref(r: { materialId: string; pageStart: number; quote?: string | null }) {
  const q = r.quote ? `&q=${encodeURIComponent(r.quote.replace(/\s+/g, " ").trim().slice(0, 180)).replace(/[()!'*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}` : "";
  return `/fonte/${r.materialId}?p=${r.pageStart}${q}`;
}

/**
 * Marcações de fonte que a IA escreve no texto: [T1], [T1, T3], [T1][T2], (T2), [Fonte: T4]...
 * Grupo entre colchetes/parênteses com um ou mais rótulos T<n>.
 */
const GROUP = /\s?[[(]\s*(?:fontes?\s*:?\s*)?T\d{1,3}(?:\s*(?:,|;|\/|-|e)\s*T\d{1,3})*\s*[\])]/gi;
const LABELS_IN = (s: string) => s.match(/T\d{1,3}/gi)?.map((x) => x.toUpperCase()) ?? [];

/**
 * Troca as marcações de fonte por links pequenos para a página do material ("p.3").
 * Rótulos soltos (ex.: "T13" sem colchetes) também viram link quando existem nas fontes da aula.
 */
export function linkSources(md: string, refs: SourceRef[]) {
  const byLabel = new Map(refs.map((r) => [r.label.toUpperCase(), r]));
  const link = (labels: string[]) => {
    const seen = new Set<number>();
    return labels
      .map((l) => byLabel.get(l))
      .filter((r): r is SourceRef => !!r && !seen.has(r.pageStart) && (seen.add(r.pageStart), true))
      .map((r) => ` [p.${r.pageStart}](${sourceHref(r)})`)
      .join("");
  };
  return md
    .replace(GROUP, (m) => link(LABELS_IN(m)))
    .replace(/(^|[\s(])T(\d{1,3})\b(?![^[]*\])/g, (m, pre: string, n: string) => (byLabel.has(`T${n}`) ? `${pre.trimEnd()}${link([`T${n}`])}` : m));
}

/** Remove as marcações de fonte (para ler em voz alta). Rótulos soltos só saem se forem fontes da aula. */
export function stripSources(text: string, labels: string[] = []) {
  const known = new Set(labels.map((l) => l.toUpperCase()));
  return text
    .replace(GROUP, "")
    .replace(/(^|[\s(])T(\d{1,3})\b/g, (m, pre: string, n: string) => (known.has(`T${n}`) ? pre : m))
    .replace(/\s+([.,;:!?])/g, "$1");
}
