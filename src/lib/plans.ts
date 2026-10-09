// Planos e limites. Os valores abaixo são os padrões; os reais ficam na tabela Plan (editável no /admin).
// O Eduvia é focado no ENEM: o que muda entre os planos é quanto das aulas fica liberado e quantas atividades por dia/mês.

export type PlanLimits = {
  /** Parte das aulas de cada matéria liberada (%): 10 no Grátis, 50 no Básico, 100 no Completo. */
  lessonsPct: number;
  /** Testes rápidos (-1 = sem limite). Valem os dois: por dia e por mês. */
  gamesPerDay: number;
  gamesPerMonth: number;
  /** Simulados ENEM. */
  examsPerDay: number;
  examsPerMonth: number;
  /** Redações corrigidas. */
  essaysPerDay: number;
  essaysPerMonth: number;
  /** Perguntas ao Professor IA. */
  tutorMessagesPerDay: number;
  tutorMessagesPerMonth: number;
  /** Pode criar e participar de grupos de estudo. */
  groups: boolean;
  groupsOwned: number;
  /** Minutos de estudo no dia a partir dos quais sugerimos descansar. */
  restAfterMinutes: number;
};

export type PlanSlug = "gratis" | "basico" | "completo" | "indicacao";
export type PlanDef = { slug: PlanSlug; name: string; order: number; priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number; limits: PlanLimits; active?: boolean };

const FULL: PlanLimits = {
  lessonsPct: 100,
  gamesPerDay: -1,
  gamesPerMonth: -1,
  examsPerDay: 3,
  examsPerMonth: -1,
  essaysPerDay: 5,
  essaysPerMonth: -1,
  tutorMessagesPerDay: 30,
  tutorMessagesPerMonth: -1,
  groups: true,
  groupsOwned: 3,
  restAfterMinutes: 180,
};

/**
 * Grátis (para sempre, 10% das aulas e 1 de cada atividade por mês), Básico R$ 9,90 (metade das aulas),
 * Completo R$ 19,90 (tudo; R$ 14,90 nos 3 primeiros meses) e Indicação (tudo do Completo, pago com o preço de
 * indicação: R$ 7,90 depois de indicar 3 pessoas; nas próximas vezes, R$ 9,90 com 1 indicação nova).
 */
export const DEFAULT_PLANS: PlanDef[] = [
  {
    slug: "gratis",
    name: "Grátis",
    order: 0,
    priceWeekCents: 0,
    priceFortnightCents: 0,
    priceMonthCents: 0,
    limits: { lessonsPct: 10, gamesPerDay: -1, gamesPerMonth: 1, examsPerDay: -1, examsPerMonth: 1, essaysPerDay: -1, essaysPerMonth: 1, tutorMessagesPerDay: -1, tutorMessagesPerMonth: 5, groups: false, groupsOwned: 0, restAfterMinutes: 180 },
  },
  {
    slug: "basico",
    name: "Básico",
    order: 1,
    priceWeekCents: 0,
    priceFortnightCents: 0,
    priceMonthCents: 990,
    limits: { lessonsPct: 50, gamesPerDay: 3, gamesPerMonth: -1, examsPerDay: 1, examsPerMonth: -1, essaysPerDay: 2, essaysPerMonth: -1, tutorMessagesPerDay: 10, tutorMessagesPerMonth: -1, groups: false, groupsOwned: 0, restAfterMinutes: 180 },
  },
  { slug: "completo", name: "Completo", order: 2, priceWeekCents: 0, priceFortnightCents: 0, priceMonthCents: 1990, limits: FULL },
  { slug: "indicacao", name: "Indicação", order: 3, priceWeekCents: 0, priceFortnightCents: 0, priceMonthCents: 990, limits: FULL },
];

/** Nível do plano (para subir/descer). Completo e Indicação liberam a mesma coisa: são o mesmo nível. */
export const PLAN_RANK: Record<string, number> = { gratis: 0, basico: 1, completo: 2, indicacao: 2 };
/** Planos antigos (antes do foco no ENEM): quem ainda tem um deles usa os limites do plano novo equivalente. */
export const LEGACY_PLANS: Record<string, PlanSlug> = { eduvia: "basico", avancado: "completo", ilimitado: "completo" };
export const planRank = (slug: string) => PLAN_RANK[LEGACY_PLANS[slug] ?? slug] ?? 0;

/** Plano por indicação: preço da primeira vez (depois de 3 indicações). Nas próximas vale o preço do plano (R$ 9,90). */
export const REFERRAL_FIRST_CENTS = 790;
/** Indicações necessárias: 3 na primeira vez; depois, 1 nova a cada pagamento. */
export const REFERRALS_FIRST = 3;
export const REFERRALS_NEXT = 1;

/**
 * Promoção de entrada: nos primeiros meses pagos do Completo, a pessoa paga menos (R$ 14,90 nos 3 primeiros meses,
 * contados pelo CPF); depois, o preço normal (R$ 19,90).
 */
export const PROMOS: Partial<Record<string, { priceCents: number; months: number }>> = {
  completo: { priceCents: 1490, months: 3 },
};

/** Preço do mês para quem já pagou `paidMonths` meses desse plano (promoção nos primeiros meses). */
export function monthPrice(plan: { slug: string; priceMonthCents: number }, paidMonths: number) {
  const promo = PROMOS[plan.slug];
  if (promo && paidMonths < promo.months && promo.priceCents < plan.priceMonthCents) {
    return { priceCents: promo.priceCents, promo: { month: paidMonths + 1, months: promo.months, normalCents: plan.priceMonthCents } };
  }
  return { priceCents: plan.priceMonthCents, promo: null };
}

/** Plano liberado para administradores (para testar e dar suporte). */
export const PAID_PLAN: PlanSlug = "completo";
/** Duração de cada período pago, em dias. */
export const PERIOD_DAYS = { WEEK: 7, FORTNIGHT: 15, MONTH: 30 } as const;
export type Interval = keyof typeof PERIOD_DAYS;
/** Planos só mensais. (7 e 15 dias continuam reconhecidos só para assinaturas antigas.) */
export const INTERVALS: { key: Interval; days: number; label: string; adjective: string }[] = [{ key: "MONTH", days: 30, label: "30 dias", adjective: "mensal" }];
const ALL_INTERVALS: typeof INTERVALS = [
  { key: "WEEK", days: 7, label: "7 dias", adjective: "semanal" },
  { key: "FORTNIGHT", days: 15, label: "15 dias", adjective: "quinzenal" },
  ...INTERVALS,
];
type Priced = { priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number };
export function priceFor(plan: Priced, interval: Interval) {
  return interval === "WEEK" ? plan.priceWeekCents : interval === "FORTNIGHT" ? plan.priceFortnightCents : plan.priceMonthCents;
}
export const intervalInfo = (i: Interval) => ALL_INTERVALS.find((x) => x.key === i)!;

/** Máximo de pessoas por grupo de estudo. */
export const MAX_GROUP_MEMBERS = 30;

export const LIMIT_FIELDS: { key: keyof PlanLimits; label: string; kind: "number" | "boolean" }[] = [
  { key: "lessonsPct", label: "Aulas liberadas de cada matéria (%)", kind: "number" },
  { key: "gamesPerDay", label: "Testes rápidos por dia", kind: "number" },
  { key: "gamesPerMonth", label: "Testes rápidos por mês", kind: "number" },
  { key: "examsPerDay", label: "Simulados por dia", kind: "number" },
  { key: "examsPerMonth", label: "Simulados por mês", kind: "number" },
  { key: "essaysPerDay", label: "Redações por dia", kind: "number" },
  { key: "essaysPerMonth", label: "Redações por mês", kind: "number" },
  { key: "tutorMessagesPerDay", label: "Perguntas ao Professor IA por dia", kind: "number" },
  { key: "tutorMessagesPerMonth", label: "Perguntas ao Professor IA por mês", kind: "number" },
  { key: "groups", label: "Criar e participar de grupos", kind: "boolean" },
  { key: "groupsOwned", label: "Grupos que pode criar", kind: "number" },
  { key: "restAfterMinutes", label: "Sugerir descanso após (minutos de estudo no dia)", kind: "number" },
];

/** Completa limites vindos do banco com os padrões (campos novos, JSON antigo). */
export function normalizeLimits(raw: unknown, slug: string): PlanLimits {
  const def = LEGACY_PLANS[slug] ?? slug;
  const base = (DEFAULT_PLANS.find((p) => p.slug === def) ?? DEFAULT_PLANS[0]).limits;
  // planos antigos: os limites guardados eram de outro formato, valem os do plano novo equivalente
  if (LEGACY_PLANS[slug]) return { ...base };
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...base } as Record<string, number | boolean>;
  for (const f of LIMIT_FIELDS) {
    const v = obj[f.key];
    if (f.kind === "boolean" && typeof v === "boolean") out[f.key] = v;
    if (f.kind === "number" && typeof v === "number" && Number.isFinite(v)) out[f.key] = Math.max(-1, Math.round(v));
  }
  out.lessonsPct = Math.max(1, Math.min(100, (out.lessonsPct as number) < 0 ? 100 : (out.lessonsPct as number)));
  return out as PlanLimits;
}

/** -1 = ilimitado. */
export const isUnlimited = (n: number) => n < 0;
export const formatLimit = (n: number) => (isUnlimited(n) ? "ilimitado" : String(n));

/** Quantas aulas de uma matéria o plano libera (pelo menos 1). */
export function lessonsAllowed(total: number, pct: number) {
  if (pct >= 100) return total;
  return Math.min(total, Math.max(1, Math.ceil((total * pct) / 100)));
}

/** "1 simulado por mês", "3 por dia", "à vontade" (o menor dos dois limites é o que aparece). */
function perPeriod(day: number, month: number, one: string, many: string, unlimited: string) {
  if (isUnlimited(day) && isUnlimited(month)) return unlimited;
  const n = (v: number) => `${v} ${v === 1 ? one : many}`;
  if (!isUnlimited(day) && (isUnlimited(month) || day <= month)) return day === 0 ? "" : `${n(day)} por dia`;
  return month === 0 ? "" : `${n(month)} por mês`;
}

/** Lista de benefícios para mostrar no card do plano. */
export function planFeatures(l: PlanLimits): string[] {
  const lessons = l.lessonsPct >= 100 ? "Todas as aulas de todas as matérias" : l.lessonsPct >= 50 ? "Todas as matérias, com metade das aulas" : `Todas as matérias, com ${l.lessonsPct}% das aulas`;
  const exams = perPeriod(l.examsPerDay, l.examsPerMonth, "simulado ENEM", "simulados ENEM", "Simulados ENEM à vontade");
  const essays = perPeriod(l.essaysPerDay, l.essaysPerMonth, "redação corrigida", "redações corrigidas", "Redações corrigidas à vontade");
  const games = perPeriod(l.gamesPerDay, l.gamesPerMonth, "teste rápido", "testes rápidos", "Testes rápidos à vontade");
  const tutor = perPeriod(l.tutorMessagesPerDay, l.tutorMessagesPerMonth, "pergunta", "perguntas", "à vontade");
  return [
    lessons,
    "Questões reais do ENEM (2009 a 2025)",
    exams || "Sem simulados",
    essays || "Sem correção de redação",
    games || "Sem testes rápidos",
    tutor ? `Professor IA: ${tutor}` : "Sem Professor IA",
    l.groups ? "Grupos de estudo e torneios" : "Sem grupos de estudo",
  ];
}
