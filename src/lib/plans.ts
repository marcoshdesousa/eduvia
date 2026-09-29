// Planos e limites. Os valores abaixo são os padrões; os reais ficam na tabela Plan (editável no /admin).

export type PlanLimits = {
  /** Preparações ativas ao mesmo tempo (excluir libera a vaga). */
  activePreparations: number;
  /** Arquivos de conteúdo guardados (PDF, DOCX, imagem, texto). Edital/ementa não contam. */
  materials: number;
  /** Páginas enviadas por dia (soma de todos os arquivos). */
  pagesPerDay: number;
  /** Páginas escaneadas (foto) por dia: a IA precisa ler cada uma, gasta bem mais. */
  scannedPagesPerDay: number;
  /** Sessões de estudo com conteúdo novo por dia (revisões são ilimitadas). */
  newSessionsPerDay: number;
  /** Testes rápidos por dia. */
  gamesPerDay: number;
  examsPerMonth: number;
  essaysPerDay: number;
  tutorMessagesPerDay: number;
  /** Pode criar e participar de grupos. */
  groups: boolean;
  groupsOwned: number;
  /** Minutos de estudo no dia a partir dos quais sugerimos descansar. */
  restAfterMinutes: number;
};

export type PlanSlug = "gratis" | "eduvia";
export type PlanDef = { slug: PlanSlug; name: string; order: number; priceWeekCents: number; priceMonthCents: number; limits: PlanLimits };

/** Limites por dia pensados para caber na cota grátis da chave Gemini do aluno. */
export const DEFAULT_PLANS: PlanDef[] = [
  {
    slug: "gratis",
    name: "Grátis",
    order: 0,
    priceWeekCents: 0,
    priceMonthCents: 0,
    limits: { activePreparations: 1, materials: 1, pagesPerDay: 30, scannedPagesPerDay: 5, newSessionsPerDay: 1, gamesPerDay: 3, examsPerMonth: 0, essaysPerDay: 1, tutorMessagesPerDay: 5, groups: false, groupsOwned: 0, restAfterMinutes: 180 },
  },
  {
    slug: "eduvia",
    name: "Eduvia",
    order: 1,
    priceWeekCents: 700,
    priceMonthCents: 1500,
    limits: { activePreparations: -1, materials: -1, pagesPerDay: 700, scannedPagesPerDay: 150, newSessionsPerDay: 6, gamesPerDay: -1, examsPerMonth: 8, essaysPerDay: 3, tutorMessagesPerDay: 40, groups: true, groupsOwned: 5, restAfterMinutes: 180 },
  },
];

/** O plano pago (único). */
export const PAID_PLAN: PlanSlug = "eduvia";
/** Duração de cada período pago, em dias. */
export const PERIOD_DAYS = { WEEK: 7, MONTH: 30 } as const;

export const LIMIT_FIELDS: { key: keyof PlanLimits; label: string; kind: "number" | "boolean" }[] = [
  { key: "activePreparations", label: "Preparações ativas", kind: "number" },
  { key: "materials", label: "Arquivos (PDFs) guardados", kind: "number" },
  { key: "pagesPerDay", label: "Páginas enviadas por dia", kind: "number" },
  { key: "scannedPagesPerDay", label: "Páginas escaneadas por dia", kind: "number" },
  { key: "newSessionsPerDay", label: "Sessões novas por dia", kind: "number" },
  { key: "gamesPerDay", label: "Testes rápidos por dia", kind: "number" },
  { key: "examsPerMonth", label: "Simulados por mês", kind: "number" },
  { key: "essaysPerDay", label: "Redações por dia", kind: "number" },
  { key: "tutorMessagesPerDay", label: "Mensagens ao Professor IA por dia", kind: "number" },
  { key: "groups", label: "Criar e participar de grupos", kind: "boolean" },
  { key: "groupsOwned", label: "Grupos que pode criar", kind: "number" },
  { key: "restAfterMinutes", label: "Sugerir descanso após (minutos de estudo no dia)", kind: "number" },
];

/** Completa limites vindos do banco com os padrões (campos novos, JSON antigo). */
export function normalizeLimits(raw: unknown, slug: string): PlanLimits {
  const base = (DEFAULT_PLANS.find((p) => p.slug === slug) ?? DEFAULT_PLANS[0]).limits;
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...base } as Record<string, number | boolean>;
  for (const f of LIMIT_FIELDS) {
    const v = obj[f.key];
    if (f.kind === "boolean" && typeof v === "boolean") out[f.key] = v;
    if (f.kind === "number" && typeof v === "number" && Number.isFinite(v)) out[f.key] = Math.max(-1, Math.round(v));
  }
  return out as PlanLimits;
}

/** -1 = ilimitado. */
export const isUnlimited = (n: number) => n < 0;
export const formatLimit = (n: number) => (isUnlimited(n) ? "ilimitado" : String(n));

/** Lista de benefícios para mostrar no card do plano. */
export function planFeatures(l: PlanLimits): string[] {
  const n = (v: number, one: string, many: string) => (isUnlimited(v) ? `${many} à vontade` : `${v} ${v === 1 ? one : many}`);
  return [
    n(l.activePreparations, "preparação", "preparações"),
    l.pagesPerDay ? `${n(l.materials, "PDF/arquivo", "PDFs/arquivos")} · até ${formatLimit(l.pagesPerDay)} páginas por dia` : "Sem envio de materiais",
    l.newSessionsPerDay ? `${n(l.newSessionsPerDay, "sessão nova", "sessões novas")} por dia + revisões ilimitadas` : "Só revisões",
    isUnlimited(l.gamesPerDay) ? "Testes rápidos à vontade" : l.gamesPerDay ? `${n(l.gamesPerDay, "teste rápido", "testes rápidos")} por dia` : "Sem testes rápidos",
    l.examsPerMonth ? `${n(l.examsPerMonth, "simulado", "simulados")} por mês` : "Sem simulados",
    l.essaysPerDay ? `${n(l.essaysPerDay, "redação corrigida", "redações corrigidas")} por dia` : "Sem correção de redação",
    l.tutorMessagesPerDay ? `Professor IA: ${formatLimit(l.tutorMessagesPerDay)} mensagens por dia` : "Sem Professor IA",
    l.groups ? `Grupos: cria até ${formatLimit(l.groupsOwned)} e entra em quantos quiser` : "Sem grupos",
  ];
}
