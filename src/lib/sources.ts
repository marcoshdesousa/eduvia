export type SourceRef = { label: string; materialId: string; title: string; pageStart: number; pageEnd: number };

/** Troca [T1] no texto por links para a página do material de origem. */
export function linkSources(md: string, refs: SourceRef[]) {
  const byLabel = new Map(refs.map((r) => [r.label, r]));
  return md.replace(/\[(T\d+)\]/g, (_m, label: string) => {
    const r = byLabel.get(label);
    return r ? `[↗ p.${r.pageStart}](/api/materials/${r.materialId}/file?page=${r.pageStart})` : "";
  });
}
