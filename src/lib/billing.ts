// Assinatura manual: o aluno paga pelo WhatsApp e um admin libera o plano em /admin.
// Cada plano (grátis, essencial, completo, intensivo) tem preço semanal/mensal e limites próprios.
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/core/dates";
import {
  DEFAULT_PLANS,
  ESSAY_SAFETY_PER_DAY,
  isUnlimited,
  normalizeLimits,
  TRIAL_PLAN,
  type PlanLimits,
  type PlanSlug,
} from "@/lib/plans";

export const TRIAL_DAYS = 3;

type UserLike = { id: string; trialEndsAt: Date | null; timezone?: string };

export type PlanRow = { slug: string; name: string; order: number; priceWeekCents: number; priceMonthCents: number; limits: PlanLimits; active: boolean };

/** Planos do banco (com os padrões como reserva). */
export async function listPlans(): Promise<PlanRow[]> {
  const rows = await db.plan.findMany({ orderBy: { order: "asc" } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged = DEFAULT_PLANS.map((d) => {
    const r = bySlug.get(d.slug);
    return r
      ? { slug: r.slug, name: r.name, order: r.order, priceWeekCents: r.priceWeekCents, priceMonthCents: r.priceMonthCents, limits: normalizeLimits(r.limits, r.slug), active: r.active }
      : { ...d, active: true };
  });
  return merged.sort((a, b) => a.order - b.order);
}

export async function getPlan(slug: string): Promise<PlanRow | null> {
  return (await listPlans()).find((p) => p.slug === slug) ?? null;
}

/** Número de WhatsApp que recebe os pedidos de assinatura (DDI + DDD + número, só dígitos). */
export function whatsappNumber() {
  return (process.env.WHATSAPP_NUMBER || "5562992067369").replace(/\D/g, "");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function subscribeMessage(plan: { name: string; priceWeekCents: number; priceMonthCents: number }, interval: "WEEK" | "MONTH", user: { name: string; handle: string | null }) {
  const price = interval === "WEEK" ? `${formatBRL(plan.priceWeekCents)}/semana` : `${formatBRL(plan.priceMonthCents)}/mês`;
  return `Olá! Quero assinar o plano ${plan.name} ${interval === "WEEK" ? "semanal" : "mensal"} do Eduvia (${price}).\nNome: ${user.name}\nUsuário: @${user.handle}`;
}

export function trialEnd(from = new Date()) {
  return addDays(from, TRIAL_DAYS);
}

/** Com BILLING_ENFORCED=false (só para desenvolvimento) todo mundo tem o plano mais alto. */
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

export type Access = { planSlug: PlanSlug; planName: string; limits: PlanLimits } & (
  | { mode: "full"; reason: "subscription"; until: Date; interval: "WEEK" | "MONTH" }
  | { mode: "full"; reason: "trial"; until: Date }
  | { mode: "full"; reason: "dev" }
  | { mode: "limited"; reason: "expired" }
);

export async function getAccess(user: UserLike): Promise<Access> {
  const plans = await listPlans();
  const plan = (slug: string) => plans.find((p) => p.slug === slug) ?? plans[0];
  const sub = await activeSubscription(user.id);
  if (sub) {
    const p = plan(sub.planSlug);
    return { mode: "full", reason: "subscription", until: sub.currentPeriodEnd, interval: sub.interval, planSlug: p.slug as PlanSlug, planName: p.name, limits: p.limits };
  }
  if (user.trialEndsAt && user.trialEndsAt > new Date()) {
    const p = plan(TRIAL_PLAN);
    return { mode: "full", reason: "trial", until: user.trialEndsAt, planSlug: p.slug as PlanSlug, planName: p.name, limits: p.limits };
  }
  if (!billingEnforced()) {
    const p = plans[plans.length - 1];
    return { mode: "full", reason: "dev", planSlug: p.slug as PlanSlug, planName: p.name, limits: p.limits };
  }
  const free = plan("gratis");
  return { mode: "limited", reason: "expired", planSlug: "gratis", planName: free.name, limits: free.limits };
}

export async function hasAccess(user: UserLike) {
  return (await getAccess(user)).mode === "full";
}

// ───────────── Uso atual (para aplicar limites e mostrar ao aluno) ─────────────

export async function usage(user: UserLike) {
  const tz = user.timezone ?? "America/Sao_Paulo";
  const dayStart = localDayStart(tz);
  const monthStart = localMonthStart(tz);
  const [activePreparations, materials, pages, newSessionsToday, gamesToday, examsThisMonth, essaysToday, tutorThisMonth, groupsOwned] = await Promise.all([
    db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } }),
    db.material.count({ where: { preparation: { userId: user.id }, role: "CONTENT", status: { not: "ERROR" } } }),
    db.material.findMany({
      where: { uploaderId: user.id, createdAt: { gte: monthStart }, status: { not: "ERROR" } },
      select: { blob: { select: { pageCount: true } } },
    }),
    db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: dayStart } } }),
    db.gameRun.count({ where: { userId: user.id, startedAt: { gte: dayStart } } }),
    db.exam.count({ where: { ownerId: user.id, createdAt: { gte: monthStart } } }),
    db.essay.count({ where: { userId: user.id, status: { not: "DRAFT" }, createdAt: { gte: dayStart } } }),
    db.tutorMessage.count({ where: { role: "user", createdAt: { gte: monthStart }, thread: { userId: user.id } } }),
    db.group.count({ where: { ownerId: user.id } }),
  ]);
  return {
    activePreparations,
    materials,
    pagesThisMonth: pages.reduce((s, m) => s + (m.blob?.pageCount ?? 0), 0),
    newSessionsToday,
    gamesToday,
    examsThisMonth,
    essaysToday,
    tutorThisMonth,
    groupsOwned,
  };
}

const over = (used: number, max: number) => !isUnlimited(max) && used >= max;

function upgradeHint(a: Access) {
  return a.reason === "expired" ? " Assine um plano para liberar." : a.planSlug === "intensivo" ? "" : " Faça upgrade do plano para aumentar.";
}

// ───────────── Regras (devolvem a mensagem de bloqueio ou null) ─────────────

export async function preparationLimitError(user: UserLike) {
  const a = await getAccess(user);
  const used = await db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } });
  return over(used, a.limits.activePreparations)
    ? `Seu plano ${a.planName} permite ${a.limits.activePreparations} preparação(ões) ativa(s). Arquive ou exclua uma para criar outra.${upgradeHint(a)}`
    : null;
}

/** Envio de arquivo de conteúdo (conta PDFs guardados e páginas do mês). Edital/ementa só contam páginas. */
export async function uploadLimitError(user: UserLike, role: "CONTENT" | "EDITAL" | "EMENTA" = "CONTENT") {
  const a = await getAccess(user);
  if (a.limits.pagesPerMonth === 0) return `Seu plano ${a.planName} não inclui envio de materiais.${upgradeHint(a)}`;
  const u = await usage(user);
  if (role === "CONTENT" && over(u.materials, a.limits.materials)) {
    return `Você chegou ao limite de ${a.limits.materials} arquivos do plano ${a.planName}. Exclua um material para enviar outro.${upgradeHint(a)}`;
  }
  if (over(u.pagesThisMonth, a.limits.pagesPerMonth)) {
    return `Você já enviou ${u.pagesThisMonth} de ${a.limits.pagesPerMonth} páginas este mês no plano ${a.planName}.${upgradeHint(a)}`;
  }
  return null;
}

/** Checagem feita no processamento, quando já se sabe quantas páginas o arquivo tem (antes de gastar IA). */
export async function pageQuotaError(userId: string, materialId: string, pages: number) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const a = await getAccess(user);
  if (isUnlimited(a.limits.pagesPerMonth)) return null;
  const monthStart = localMonthStart(user.timezone);
  const others = await db.material.findMany({
    where: { uploaderId: userId, id: { not: materialId }, createdAt: { gte: monthStart }, status: { not: "ERROR" } },
    select: { blob: { select: { pageCount: true } } },
  });
  const used = others.reduce((s, m) => s + (m.blob?.pageCount ?? 0), 0);
  const left = Math.max(0, a.limits.pagesPerMonth - used);
  return pages > left
    ? `Este arquivo tem ${pages} páginas, mas restam ${left} das ${a.limits.pagesPerMonth} páginas do mês no plano ${a.planName}. Divida o PDF ou faça upgrade do plano.`
    : null;
}

/** Sessões de estudo com conteúdo novo (revisões não contam). */
export async function sessionLimitError(user: UserLike & { timezone: string }) {
  const a = await getAccess(user);
  const used = await db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: localDayStart(user.timezone) } } });
  if (a.limits.newSessionsPerDay === 0) return `No plano ${a.planName} você pode fazer revisões e o banco de erros, mas não sessões novas.${upgradeHint(a)}`;
  return over(used, a.limits.newSessionsPerDay)
    ? `Você já fez ${used} sessão(ões) nova(s) hoje (limite do plano ${a.planName}). Revisões continuam liberadas.${upgradeHint(a)}`
    : null;
}

export type Feature = "game" | "exam" | "essay" | "tutor";

/** Jogos (por dia), simulados (por mês), redação e Professor IA (por mês). */
export async function featureLimitError(user: UserLike & { timezone: string }, feature: Feature) {
  const a = await getAccess(user);
  const u = await usage(user);
  const l = a.limits;
  switch (feature) {
    case "game":
      if (l.gamesPerDay === 0) return `Jogos não fazem parte do plano ${a.planName}.${upgradeHint(a)}`;
      return over(u.gamesToday, l.gamesPerDay) ? `Você jogou ${u.gamesToday} partida(s) hoje, o limite do plano ${a.planName}. Volte amanhã!${upgradeHint(a)}` : null;
    case "exam":
      if (l.examsPerMonth === 0) return `Simulados não fazem parte do plano ${a.planName}.${upgradeHint(a)}`;
      return over(u.examsThisMonth, l.examsPerMonth) ? `Você já criou ${u.examsThisMonth} simulado(s) este mês, o limite do plano ${a.planName}. Refazer simulados continua liberado.${upgradeHint(a)}` : null;
    case "essay":
      if (!l.essays) return `A correção de redação não faz parte do plano ${a.planName}.${upgradeHint(a)}`;
      return u.essaysToday >= ESSAY_SAFETY_PER_DAY ? "Você corrigiu muitas redações hoje. Volte amanhã!" : null;
    case "tutor":
      if (l.tutorMessagesPerMonth === 0) return `O Professor IA não faz parte do plano ${a.planName}.${upgradeHint(a)}`;
      return over(u.tutorThisMonth, l.tutorMessagesPerMonth) ? `Você usou as ${l.tutorMessagesPerMonth} mensagens do mês do plano ${a.planName}.${upgradeHint(a)}` : null;
  }
}

export async function groupCreateError(user: UserLike) {
  const a = await getAccess(user);
  if (!a.limits.groups) return `Grupos fazem parte dos planos pagos.${upgradeHint(a)}`;
  const owned = await db.group.count({ where: { ownerId: user.id } });
  return over(owned, a.limits.groupsOwned) ? `Você já criou ${owned} grupo(s), o máximo do seu plano.` : null;
}

export async function groupAccessError(user: UserLike) {
  const a = await getAccess(user);
  return a.limits.groups ? null : `Grupos fazem parte dos planos pagos.${upgradeHint(a)}`;
}

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

/** Soma um período de cobrança (semana ou mês calendário). */
export function addPeriod(from: Date, interval: "WEEK" | "MONTH"): Date {
  const d = new Date(from);
  if (interval === "WEEK") {
    d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
