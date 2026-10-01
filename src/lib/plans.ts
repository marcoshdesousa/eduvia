// Planos e limites. Os valores abaixo são os padrões; os reais ficam na tabela Plan (editável no /admin).

export type PlanLimits = {
  /** Preparações ativas ao mesmo tempo (-1 = sem limite). */
  activePreparations: number;
  /** Guias de estudo (preparações) que dá para criar por mês. Apagar não devolve a vaga. */
  preparationsPerMonth: number;
  /** Arquivos de conteúdo guardados (PDF, DOCX, imagem, texto). */
  materials: number;
  /** Páginas enviadas por dia (soma de todos os arquivos que deram certo). */
  pagesPerDay: number;
  /** Páginas por arquivo (PDF). */
  pagesPerPdf: number;
  /** Páginas escaneadas (foto) por dia. */
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

export type PlanSlug = "gratis" | "eduvia" | "plus" | "pro" | "avancado" | "ilimitado";
export type PlanDef = { slug: PlanSlug; name: string; order: number; priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number; limits: PlanLimits; active?: boolean };

const PAID_BASE = { activePreparations: -1, materials: -1, pagesPerDay: -1, pagesPerPdf: -1, scannedPagesPerDay: -1, gamesPerDay: -1, groups: true, groupsOwned: 5, restAfterMinutes: 180 };

/** Três planos pagos (Básico, Avançado e Ilimitado), cada um com preço de 7, 15 e 30 dias. PDFs e páginas sem limite nos pagos. */
export const DEFAULT_PLANS: PlanDef[] = [
  {
    slug: "gratis",
    name: "Grátis",
    order: 0,
    priceWeekCents: 0,
    priceFortnightCents: 0,
    priceMonthCents: 0,
    limits: { activePreparations: 1, preparationsPerMonth: 1, materials: 1, pagesPerDay: -1, pagesPerPdf: 100, scannedPagesPerDay: -1, newSessionsPerDay: 1, gamesPerDay: 3, examsPerMonth: 0, essaysPerDay: 1, tutorMessagesPerDay: 5, groups: false, groupsOwned: 0, restAfterMinutes: 180 },
  },
  {
    slug: "eduvia",
    name: "Básico",
    order: 1,
    priceWeekCents: 700,
    priceFortnightCents: 1000,
    priceMonthCents: 1500,
    limits: { ...PAID_BASE, preparationsPerMonth: 6, newSessionsPerDay: 6, examsPerMonth: 15, essaysPerDay: 3, tutorMessagesPerDay: 40 },
  },
  {
    slug: "avancado",
    name: "Avançado",
    order: 2,
    priceWeekCents: 1200,
    priceFortnightCents: 1900,
    priceMonthCents: 3000,
    limits: { ...PAID_BASE, preparationsPerMonth: 15, newSessionsPerDay: 10, examsPerMonth: 40, essaysPerDay: 6, tutorMessagesPerDay: 100 },
  },
  {
    slug: "ilimitado",
    name: "Ilimitado",
    order: 3,
    priceWeekCents: 1800,
    priceFortnightCents: 3000,
    priceMonthCents: 5000,
    limits: { ...PAID_BASE, preparationsPerMonth: 35, newSessionsPerDay: -1, examsPerMonth: -1, essaysPerDay: -1, tutorMessagesPerDay: -1, groupsOwned: -1 },
  },
  // fora da vitrine (assinaturas antigas continuam valendo até o fim do período)
  { slug: "plus", name: "Plus", order: 8, active: false, priceWeekCents: 0, priceFortnightCents: 0, priceMonthCents: 2000, limits: { ...PAID_BASE, preparationsPerMonth: 8, newSessionsPerDay: 6, examsPerMonth: 20, essaysPerDay: 4, tutorMessagesPerDay: 60 } },
  { slug: "pro", name: "Pro", order: 9, active: false, priceWeekCents: 0, priceFortnightCents: 0, priceMonthCents: 2500, limits: { ...PAID_BASE, preparationsPerMonth: 12, newSessionsPerDay: 8, examsPerMonth: 30, essaysPerDay: 5, tutorMessagesPerDay: 80 } },
];

/** Plano pago de entrada. */
export const PAID_PLAN: PlanSlug = "eduvia";
/** Duração de cada período pago, em dias. */
export const PERIOD_DAYS = { WEEK: 7, FORTNIGHT: 15, MONTH: 30 } as const;
export type Interval = keyof typeof PERIOD_DAYS;
export const INTERVALS: { key: Interval; days: number; label: string; adjective: string }[] = [
  { key: "WEEK", days: 7, label: "7 dias", adjective: "semanal" },
  { key: "FORTNIGHT", days: 15, label: "15 dias", adjective: "quinzenal" },
  { key: "MONTH", days: 30, label: "30 dias", adjective: "mensal" },
];
type Priced = { priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number };
export function priceFor(plan: Priced, interval: Interval) {
  return interval === "WEEK" ? plan.priceWeekCents : interval === "FORTNIGHT" ? plan.priceFortnightCents : plan.priceMonthCents;
}
export const intervalInfo = (i: Interval) => INTERVALS.find((x) => x.key === i)!;

/** Máximo de pessoas por grupo de estudo. */
export const MAX_GROUP_MEMBERS = 30;

export const LIMIT_FIELDS: { key: keyof PlanLimits; label: string; kind: "number" | "boolean" }[] = [
  { key: "preparationsPerMonth", label: "Guias de estudo (preparações) por mês", kind: "number" },
  { key: "activePreparations", label: "Preparações ativas ao mesmo tempo", kind: "number" },
  { key: "materials", label: "Arquivos (PDFs) guardados", kind: "number" },
  { key: "pagesPerDay", label: "Páginas enviadas por dia", kind: "number" },
  { key: "pagesPerPdf", label: "Páginas por PDF", kind: "number" },
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
  const n = (v: number, one: string, many: string, unlimited: string) => (isUnlimited(v) ? unlimited : `${v} ${v === 1 ? one : many}`);
  return [
    `${n(l.preparationsPerMonth, "guia de estudo", "guias de estudo", "Guias de estudo à vontade")}${isUnlimited(l.preparationsPerMonth) ? "" : " por mês"}`,
    isUnlimited(l.materials) && isUnlimited(l.pagesPerPdf)
      ? "PDFs e páginas sem limite"
      : `${n(l.materials, "PDF", "PDFs", "PDFs sem limite")}${isUnlimited(l.pagesPerPdf) ? "" : ` de até ${l.pagesPerPdf} páginas`}`,
    l.newSessionsPerDay ? `${n(l.newSessionsPerDay, "sessão nova", "sessões novas", "Sessões à vontade")}${isUnlimited(l.newSessionsPerDay) ? "" : " por dia"} + revisões ilimitadas` : "Só revisões",
    l.gamesPerDay ? (isUnlimited(l.gamesPerDay) ? "Testes rápidos à vontade" : `${l.gamesPerDay} testes rápidos por dia`) : "Sem testes rápidos",
    l.examsPerMonth ? `${n(l.examsPerMonth, "simulado", "simulados", "Simulados à vontade")}${isUnlimited(l.examsPerMonth) ? "" : " por mês"}` : "Sem simulados",
    l.essaysPerDay ? `${n(l.essaysPerDay, "redação corrigida", "redações corrigidas", "Redações à vontade")}${isUnlimited(l.essaysPerDay) ? "" : " por dia"}` : "Sem correção de redação",
    l.tutorMessagesPerDay ? (isUnlimited(l.tutorMessagesPerDay) ? "Professor IA à vontade" : `Professor IA: ${l.tutorMessagesPerDay} mensagens por dia`) : "Sem Professor IA",
    l.groups ? "Grupos de estudo e torneios" : "Sem grupos",
  ];
}
