// Critérios de correção de redação por tipo (ENEM, discursiva de concurso, geral).
import type { StudentType } from "@/generated/prisma/enums";

export type RubricKey = "ENEM" | "DISCURSIVA" | "GERAL";
export type Criterion = { key: string; name: string; max: number; description: string; step?: number };

export const RUBRICS: Record<RubricKey, { label: string; total: number; criteria: Criterion[]; genre: string }> = {
  ENEM: {
    label: "Redação ENEM (5 competências)",
    total: 1000,
    genre: "texto dissertativo-argumentativo em prosa, com proposta de intervenção",
    criteria: [
      { key: "C1", name: "Competência 1 — Norma culta", max: 200, step: 40, description: "Domínio da modalidade escrita formal da língua portuguesa." },
      { key: "C2", name: "Competência 2 — Tema e tipo textual", max: 200, step: 40, description: "Compreender a proposta e desenvolver o tema no tipo dissertativo-argumentativo, com repertório." },
      { key: "C3", name: "Competência 3 — Argumentação", max: 200, step: 40, description: "Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista." },
      { key: "C4", name: "Competência 4 — Coesão", max: 200, step: 40, description: "Conhecimento dos mecanismos linguísticos para a argumentação." },
      { key: "C5", name: "Competência 5 — Proposta de intervenção", max: 200, step: 40, description: "Proposta detalhada (agente, ação, meio, finalidade, detalhamento) respeitando os direitos humanos." },
    ],
  },
  DISCURSIVA: {
    label: "Discursiva de concurso",
    total: 100,
    genre: "resposta discursiva/dissertativa objetiva, como em provas de concurso",
    criteria: [
      { key: "CONTEUDO", name: "Conteúdo e domínio do tema", max: 60, description: "Abordagem correta e completa dos pontos pedidos, com precisão técnica." },
      { key: "ESTRUTURA", name: "Estrutura e coesão", max: 20, description: "Organização em parágrafos, progressão lógica e conectivos." },
      { key: "LINGUAGEM", name: "Linguagem (norma culta)", max: 20, description: "Ortografia, acentuação, pontuação, concordância, regência e clareza." },
    ],
  },
  GERAL: {
    label: "Teste de português",
    total: 10,
    genre: "texto livre",
    criteria: [
      { key: "ORTOGRAFIA", name: "Ortografia e acentuação", max: 2, description: "Palavras escritas e acentuadas corretamente." },
      { key: "PONTUACAO", name: "Pontuação", max: 2, description: "Uso de vírgulas, pontos e demais sinais." },
      { key: "CONCORDANCIA", name: "Concordância e regência", max: 2, description: "Concordância verbal e nominal, regência." },
      { key: "COESAO", name: "Coesão e coerência", max: 2, description: "Ligação entre as ideias e sentido do texto." },
      { key: "TEMA", name: "Adequação ao tema e à estrutura", max: 2, description: "Responde ao tema e segue a estrutura pedida." },
    ],
  },
};

export function defaultRubric(type: StudentType | null): RubricKey {
  if (type === "ENEM_VESTIBULAR" || type === "MEDIO") return "ENEM";
  if (type === "CONCURSO") return "DISCURSIVA";
  return "GERAL";
}

export const ANNOTATION_CATEGORIES = ["ORTOGRAFIA", "PONTUACAO", "CONCORDANCIA", "COESAO", "COERENCIA", "ESTRUTURA", "TEMA", "ESTILO"] as const;
export type AnnotationCategory = (typeof ANNOTATION_CATEGORIES)[number];
export const CATEGORY_LABEL: Record<AnnotationCategory, string> = {
  ORTOGRAFIA: "Ortografia",
  PONTUACAO: "Pontuação",
  CONCORDANCIA: "Concordância",
  COESAO: "Coesão",
  COERENCIA: "Coerência",
  ESTRUTURA: "Estrutura",
  TEMA: "Tema",
  ESTILO: "Estilo",
};

/** Ajusta a nota de cada critério ao máximo (e ao passo, no ENEM) e recalcula o total. */
export function normalizeScores(rubric: RubricKey, raw: { key: string; score: number; comment: string }[]) {
  const r = RUBRICS[rubric];
  const criteria = r.criteria.map((c) => {
    const found = raw.find((x) => x.key === c.key);
    let score = Math.max(0, Math.min(c.max, Number(found?.score) || 0));
    // ENEM em múltiplos de 40; notas até 10 em meios pontos; demais em inteiros
    score = c.step ? Math.round(score / c.step) * c.step : c.max <= 10 ? Math.round(score * 2) / 2 : Math.round(score);
    return { key: c.key, name: c.name, max: c.max, score, comment: found?.comment ?? "" };
  });
  return { criteria, total: Math.round(criteria.reduce((s, c) => s + c.score, 0) * 10) / 10, max: r.total };
}

export type Annotation = { quote: string; category: AnnotationCategory; message: string; suggestion: string };
export type PlacedAnnotation = Annotation & { start: number; end: number };

/** Localiza cada trecho citado pela IA no texto do aluno (sem sobreposição). Os não encontrados voltam à parte. */
export function placeAnnotations(text: string, annotations: Annotation[]): { placed: PlacedAnnotation[]; unplaced: Annotation[] } {
  const placed: PlacedAnnotation[] = [];
  const unplaced: Annotation[] = [];
  const lower = text.toLowerCase();
  for (const a of annotations) {
    const quote = a.quote.trim();
    if (!quote) {
      unplaced.push(a);
      continue;
    }
    let from = 0;
    let found = -1;
    while (true) {
      const idx = lower.indexOf(quote.toLowerCase(), from);
      if (idx === -1) break;
      const end = idx + quote.length;
      if (!placed.some((p) => idx < p.end && end > p.start)) {
        found = idx;
        break;
      }
      from = idx + 1;
    }
    if (found === -1) unplaced.push(a);
    else placed.push({ ...a, start: found, end: found + quote.length });
  }
  placed.sort((x, y) => x.start - y.start);
  return { placed, unplaced };
}

export function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
