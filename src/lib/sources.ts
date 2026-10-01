export type SourceRef = { label: string; materialId: string; title: string; pageStart: number; pageEnd: number; quote?: string };

/** Link para abrir a fonte dentro do app: o PDF na página certa, com o trecho grifado. */
export function sourceHref(r: { materialId: string; pageStart: number; quote?: string | null }) {
  const q = r.quote ? `&q=${encodeURIComponent(r.quote.replace(/\s+/g, " ").trim().slice(0, 180))}` : "";
  return `/fonte/${r.materialId}?p=${r.pageStart}${q}`;
}

/** Troca [T1] no texto por links para a página do material de origem. */
export function linkSources(md: string, refs: SourceRef[]) {
  const byLabel = new Map(refs.map((r) => [r.label, r]));
  return md.replace(/\[(T\d+)\]/g, (_m, label: string) => {
    const r = byLabel.get(label);
    return r ? `[↗ p.${r.pageStart}](${sourceHref(r)})` : "";
  });
}
