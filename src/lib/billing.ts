// Assinatura: o aluno paga pelo Pix (SyncPay, libera sozinho) ou o admin libera o plano em /admin.
// Plano Grátis para sempre (10% das aulas e 1 de cada atividade por mês) e os planos mensais Básico, Completo e Indicação.
import { db } from "@/lib/db";
import { addDays, diffDays, today } from "@/lib/core/dates";
import {
  DEFAULT_PLANS,
  isUnlimited,
  LEGACY_PLANS,
  lessonsAllowed,
  normalizeLimits,
  PAID_PLAN,
  PERIOD_DAYS,
  planRank,
  type Interval,
  type PlanLimits,
  type PlanSlug,
} from "@/lib/plans";

type UserLike = { id: string; timezone?: string; isAdmin?: boolean };

export type PlanRow = { slug: string; name: string; order: number; priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number; limits: PlanLimits; active: boolean };

/** Planos do banco (com os padrões como reserva). Os antigos (antes do foco no ENEM) vêm no fim, desligados. */
export async function listPlans(): Promise<PlanRow[]> {
  const rows = await db.plan.findMany({ orderBy: { order: "asc" } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged: PlanRow[] = DEFAULT_PLANS.map((d) => {
    const r = bySlug.get(d.slug);
    return r
      ? { slug: r.slug, name: r.name, order: r.order, priceWeekCents: r.priceWeekCents, priceFortnightCents: r.priceFortnightCents, priceMonthCents: r.priceMonthCents, limits: normalizeLimits(r.limits, r.slug), active: r.active }
      : { ...d, active: d.active ?? true };
  });
  const legacy = rows
    .filter((r) => LEGACY_PLANS[r.slug])
    .map((r) => ({ slug: r.slug, name: r.name, order: 10 + r.order, priceWeekCents: r.priceWeekCents, priceFortnightCents: r.priceFortnightCents, priceMonthCents: r.priceMonthCents, limits: normalizeLimits(r.limits, r.slug), active: false }));
  return [...merged.sort((a, b) => a.order - b.order), ...legacy];
}

export async function getPlan(slug: string): Promise<PlanRow | null> {
  return (await listPlans()).find((p) => p.slug === slug) ?? null;
}

/** Com BILLING_ENFORCED=false (só para desenvolvimento) todo mundo tem o plano completo. */
export function billingEnforced() {
  return process.env.BILLING_ENFORCED !== "false";
}

export async function activeSubscription(userId: string) {
  return db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { gt: new Date() } },
    include: { plan: true },
    orderBy: { currentPeriodEnd: "desc" },
  });
}

export type Access = { planSlug: PlanSlug | string; planName: string; limits: PlanLimits } & (
  | { mode: "full"; reason: "subscription"; until: Date; interval: Interval }
  | { mode: "full"; reason: "dev" }
  /** plano Grátis; `ended`: o plano pago venceu há pouco (aparece o aviso para renovar) */
  | { mode: "limited"; reason: "free"; ended?: { planName: string; slug: string; at: Date } }
);

/** Aviso de renovação: começa 2 dias antes do vencimento (pelo calendário do aluno). */
export const RENEW_NOTICE_DAYS = 2;
/** Depois que o plano vence, o aviso de renovar continua por 7 dias (o aluno volta para o Grátis). */
export const ENDED_NOTICE_DAYS = 7;

/** Quantos dias do calendário faltam até o vencimento (0 = vence hoje). */
export function daysLeft(until: Date, tz = "America/Sao_Paulo", now = new Date()) {
  return diffDays(today(tz, until), today(tz, now));
}

/** Plano pago perto de vencer (mostra o aviso para pagar). */
export function renewSoon(a: Access, tz?: string) {
  return a.reason === "subscription" && daysLeft(a.until, tz) <= RENEW_NOTICE_DAYS;
}

/** Tudo liberado (plano Completo/Indicação ou administrador)? */
export const hasFullAccess = (a: Access) => a.limits.lessonsPct >= 100;

export async function getAccess(user: UserLike): Promise<Access> {
  const plans = await listPlans();
  const plan = (slug: string) => plans.find((p) => p.slug === slug) ?? plans[0];
  const sub = await activeSubscription(user.id);
  if (sub) {
    const p = plan(sub.planSlug);
    return { mode: "full", reason: "subscription", until: sub.currentPeriodEnd, interval: sub.interval, planSlug: p.slug, planName: p.name, limits: p.limits };
  }
  // administradores usam tudo (para testar e dar suporte)
  if (!billingEnforced() || user.isAdmin) {
    const p = plan(PAID_PLAN);
    return { mode: "full", reason: "dev", planSlug: p.slug, planName: p.name, limits: p.limits };
  }
  const free = plan("gratis");
  // plano pago que venceu há pouco: volta para o Grátis e aparece o aviso para renovar
  const last = await db.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { lte: new Date(), gt: addDays(new Date(), -ENDED_NOTICE_DAYS) } },
    include: { plan: true },
    orderBy: { currentPeriodEnd: "desc" },
  });
  const ended = last ? { planName: plan(last.planSlug).name, slug: last.planSlug, at: last.currentPeriodEnd } : undefined;
  return { mode: "limited", reason: "free", ended, planSlug: "gratis", planName: free.name, limits: free.limits };
}

// ───────────── Uso (para aplicar limites e mostrar ao aluno) ─────────────

export async function usage(user: UserLike) {
  const tz = user.timezone ?? "America/Sao_Paulo";
  const dayStart = localDayStart(tz);
  const monthStart = localMonthStart(tz);
  const count = (since: Date) =>
    Promise.all([
      db.gameRun.count({ where: { userId: user.id, startedAt: { gte: since } } }),
      db.exam.count({ where: { ownerId: user.id, createdAt: { gte: since } } }),
      db.essay.count({ where: { userId: user.id, status: { not: "DRAFT" }, createdAt: { gte: since } } }),
      db.tutorMessage.count({ where: { role: "user", createdAt: { gte: since }, thread: { userId: user.id } } }),
    ]);
  const [[gamesToday, examsToday, essaysToday, tutorToday], [gamesThisMonth, examsThisMonth, essaysThisMonth, tutorThisMonth], groupsOwned, studyDay] = await Promise.all([
    count(dayStart),
    count(monthStart),
    db.group.count({ where: { ownerId: user.id } }),
    db.studyDay.findUnique({ where: { userId_date: { userId: user.id, date: today(tz) } } }),
  ]);
  return {
    gamesToday,
    gamesThisMonth,
    examsToday,
    examsThisMonth,
    essaysToday,
    essaysThisMonth,
    tutorToday,
    tutorThisMonth,
    groupsOwned,
    studyMinutesToday: studyDay?.minutes ?? 0,
  };
}

const over = (used: number, max: number) => !isUnlimited(max) && used >= max;

function upgradeHint(a: Access) {
  if (a.reason === "free") return a.ended ? " Seu plano venceu: renove para liberar tudo de novo." : " Assine um plano para liberar mais.";
  return a.reason === "subscription" && !hasFullAccess(a) ? " O plano Completo libera mais." : "";
}

/** Mensagem de limite do dia atingido (a tela mostra o convite para descansar). */
function dailyLimit(a: Access, what: string) {
  return `Você chegou ao limite de hoje: ${what}. Descanse um pouco! Amanhã libera de novo.${upgradeHint(a)}`;
}

// ───────────── Regras (devolvem a mensagem de bloqueio ou null) ─────────────

/** O Eduvia agora é só ENEM: preparações próprias e envio de arquivos não existem mais. */
export const ENEM_ONLY_MESSAGE = "O Eduvia agora é focado no ENEM: as aulas, as questões e os simulados já vêm prontos. Não é preciso criar preparações nem enviar arquivos.";
export async function activePreparationLimitError(_user: UserLike) {
  return ENEM_ONLY_MESSAGE;
}
export async function preparationLimitError(_user: UserLike) {
  return ENEM_ONLY_MESSAGE;
}
export async function uploadLimitError(_user: UserLike, _role: "CONTENT" | "EDITAL" | "EMENTA" = "CONTENT") {
  return ENEM_ONLY_MESSAGE;
}
export async function pageQuotaError(_userId: string, _materialId: string, _pages: number) {
  return ENEM_ONLY_MESSAGE;
}
export async function scannedQuotaError(_userId: string, _materialId: string, _pages: number) {
  return ENEM_ONLY_MESSAGE;
}
export async function sessionLimitError(_user: UserLike & { timezone: string }) {
  return ENEM_ONLY_MESSAGE;
}

/**
 * Aula do ENEM fora do plano? Cada plano libera uma parte das aulas de cada matéria (Grátis 10%, Básico 50%,
 * Completo 100%). Devolve o nome do plano que libera a aula, ou null se já está liberada.
 */
export function lessonPlanLock(access: Access, index: number, total: number): { needs: "Básico" | "Completo" } | null {
  if (index < lessonsAllowed(total, access.limits.lessonsPct)) return null;
  return { needs: index < lessonsAllowed(total, 50) ? "Básico" : "Completo" };
}

export type Feature = "game" | "exam" | "essay" | "tutor";

const FEATURE: Record<Feature, { day: keyof PlanLimits; month: keyof PlanLimits; usedDay: "gamesToday" | "examsToday" | "essaysToday" | "tutorToday"; usedMonth: "gamesThisMonth" | "examsThisMonth" | "essaysThisMonth" | "tutorThisMonth"; none: string; one: string; many: string }> = {
  game: { day: "gamesPerDay", month: "gamesPerMonth", usedDay: "gamesToday", usedMonth: "gamesThisMonth", none: "Testes rápidos não fazem parte", one: "teste rápido", many: "testes rápidos" },
  exam: { day: "examsPerDay", month: "examsPerMonth", usedDay: "examsToday", usedMonth: "examsThisMonth", none: "Simulados não fazem parte", one: "simulado", many: "simulados" },
  essay: { day: "essaysPerDay", month: "essaysPerMonth", usedDay: "essaysToday", usedMonth: "essaysThisMonth", none: "A correção de redação não faz parte", one: "redação corrigida", many: "redações corrigidas" },
  tutor: { day: "tutorMessagesPerDay", month: "tutorMessagesPerMonth", usedDay: "tutorToday", usedMonth: "tutorThisMonth", none: "O Professor IA não faz parte", one: "pergunta ao Professor IA", many: "perguntas ao Professor IA" },
};

/** Testes rápidos, simulados, redação e Professor IA: limite por dia e por mês (vale o que acabar primeiro). */
export async function featureLimitError(user: UserLike & { timezone: string }, feature: Feature) {
  const a = await getAccess(user);
  const f = FEATURE[feature];
  const perDay = a.limits[f.day] as number;
  const perMonth = a.limits[f.month] as number;
  if (perDay === 0 || perMonth === 0) return `${f.none} do plano ${a.planName}.${upgradeHint(a)}`;
  const u = await usage(user);
  const n = (v: number) => `${v} ${v === 1 ? f.one : f.many}`;
  if (over(u[f.usedMonth], perMonth)) {
    return `Você já usou ${n(perMonth)} deste mês no plano ${a.planName}. No mês que vem libera de novo.${upgradeHint(a)}`;
  }
  if (over(u[f.usedDay], perDay)) return dailyLimit(a, n(perDay));
  return null;
}

export async function groupCreateError(user: UserLike) {
  const a = await getAccess(user);
  if (!a.limits.groups) return `Grupos de estudo fazem parte do plano Completo.${upgradeHint(a)}`;
  const owned = await db.group.count({ where: { ownerId: user.id } });
  return over(owned, a.limits.groupsOwned) ? `Você já criou ${owned} grupo(s), o máximo do plano.` : null;
}

export async function groupAccessError(user: UserLike) {
  const a = await getAccess(user);
  return a.limits.groups ? null : `Grupos de estudo fazem parte do plano Completo.${upgradeHint(a)}`;
}

/** Nível do plano atual (0 Grátis, 1 Básico, 2 Completo/Indicação). */
export const accessRank = (a: Access) => (a.reason === "dev" ? 2 : a.reason === "free" ? 0 : planRank(a.planSlug));

// ───────────── Datas ─────────────

/** Início do dia local do aluno, como instante UTC (ex.: 00:00 em São Paulo = 03:00 UTC). */
export function localDayStart(tz: string, now = new Date()) {
  return localMidnight(today(tz, now), tz);
}

/** Início do mês local do aluno. */
export function localMonthStart(tz: string, now = new Date()) {
  const day = today(tz, now);
  return localMidnight(new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1)), tz);
}

function localMidnight(day: Date, tz: string) {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" }).formatToParts(day).find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  const offsetMin = m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
  return new Date(day.getTime() - offsetMin * 60_000);
}

/** Soma um período de cobrança: 7, 15 ou 30 dias. */
export function addPeriod(from: Date, interval: Interval): Date {
  return addDays(from, PERIOD_DAYS[interval]);
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
