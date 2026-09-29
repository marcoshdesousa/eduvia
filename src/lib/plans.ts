// Planos e limites. Os valores abaixo são os padrões; os reais ficam na tabela Plan (editável no /admin).

export type PlanLimits = {
  /** Preparações ativas ao mesmo tempo (arquivar/excluir libera a vaga). */
  activePreparations: number;
  /** Arquivos de conteúdo guardados (PDF, DOCX, imagem, texto). Edital/ementa não contam. */
  materials: number;
  /** Páginas enviadas no mês (soma de todos os arquivos). */
  pagesPerMonth: number;
  /** Sessões de estudo com conteúdo novo por dia (revisões são ilimitadas). */
  newSessionsPerDay: number;
  gamesPerDay: number;
  examsPerMonth: number;
  /** Correção de redação liberada (ilimitada, com trava de segurança diária). */
  essays: boolean;
  tutorMessagesPerMonth: number;
  /** Pode criar e participar de grupos. */
  groups: boolean;
  groupsOwned: number;
};

export type PlanSlug = "gratis" | "essencial" | "completo" | "intensivo";
export type PlanDef = { slug: PlanSlug; name: string; order: number; priceWeekCents: number; priceMonthCents: number; limits: PlanLimits };

export const DEFAULT_PLANS: PlanDef[] = [
  {
    slug: "gratis",
    name: "Grátis",
    order: 0,
    priceWeekCents: 0,
    priceMonthCents: 0,
    limits: { activePreparations: 1, materials: 0, pagesPerMonth: 0, newSessionsPerDay: 0, gamesPerDay: 1, examsPerMonth: 0, essays: false, tutorMessagesPerMonth: 0, groups: false, groupsOwned: 0 },
  },
  {
    slug: "essencial",
    name: "Essencial",
    order: 1,
    priceWeekCents: 990,
    priceMonthCents: 2990,
    limits: { activePreparations: 5, materials: 5, pagesPerMonth: 500, newSessionsPerDay: 1, gamesPerDay: 5, examsPerMonth: 4, essays: true, tutorMessagesPerMonth: 100, groups: true, groupsOwned: 5 },
  },
  {
    slug: "completo",
    name: "Completo",
    order: 2,
    priceWeekCents: 1490,
    priceMonthCents: 4990,
    limits: { activePreparations: 10, materials: 10, pagesPerMonth: 700, newSessionsPerDay: 2, gamesPerDay: 10, examsPerMonth: 8, essays: true, tutorMessagesPerMonth: 200, groups: true, groupsOwned: 5 },
  },
  {
    slug: "intensivo",
    name: "Intensivo",
    order: 3,
    priceWeekCents: 2990,
    priceMonthCents: 9990,
    limits: { activePreparations: 25, materials: 25, pagesPerMonth: 900, newSessionsPerDay: 4, gamesPerDay: 15, examsPerMonth: 16, essays: true, tutorMessagesPerMonth: 300, groups: true, groupsOwned: 5 },
  },
];

/** Durante o teste grátis de 3 dias o aluno usa os limites deste plano. */
export const TRIAL_PLAN: PlanSlug = "completo";
/** Trava anti-abuso para a redação "ilimitada". */
export const ESSAY_SAFETY_PER_DAY = 30;

export const LIMIT_FIELDS: { key: keyof PlanLimits; label: string; kind: "number" | "boolean" }[] = [
  { key: "activePreparations", label: "Preparações ativas", kind: "number" },
  { key: "materials", label: "Arquivos (PDFs) guardados", kind: "number" },
  { key: "pagesPerMonth", label: "Páginas enviadas por mês", kind: "number" },
  { key: "newSessionsPerDay", label: "Sessões novas por dia", kind: "number" },
  { key: "gamesPerDay", label: "Jogos por dia", kind: "number" },
  { key: "examsPerMonth", label: "Simulados por mês", kind: "number" },
  { key: "essays", label: "Correção de redação ilimitada", kind: "boolean" },
  { key: "tutorMessagesPerMonth", label: "Mensagens ao Professor IA por mês", kind: "number" },
  { key: "groups", label: "Criar e participar de grupos", kind: "boolean" },
  { key: "groupsOwned", label: "Grupos que pode criar", kind: "number" },
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
  const n = (v: number, one: string, many: string) => (isUnlimited(v) ? `${many} ilimitados` : `${v} ${v === 1 ? one : many}`);
  const items = [
    `${n(l.activePreparations, "preparação ativa", "preparações ativas")}`,
    l.materials ? `${n(l.materials, "PDF/arquivo", "PDFs/arquivos")} · ${formatLimit(l.pagesPerMonth)} páginas por mês` : "Sem envio de novos materiais",
    l.newSessionsPerDay ? `${n(l.newSessionsPerDay, "sessão nova", "sessões novas")} por dia + revisões ilimitadas` : "Só revisões (sem sessões novas)",
    `${n(l.gamesPerDay, "jogo", "jogos")} por dia`,
    l.examsPerMonth ? `${n(l.examsPerMonth, "simulado", "simulados")} por mês` : "Sem simulados",
    l.essays ? "Correção de redação ilimitada" : "Sem correção de redação",
    l.tutorMessagesPerMonth ? `Professor IA: ${formatLimit(l.tutorMessagesPerMonth)} mensagens por mês` : "Sem Professor IA",
    l.groups ? `Grupos: cria até ${formatLimit(l.groupsOwned)} e entra em quantos quiser` : "Sem grupos",
  ];
  return items;
}
