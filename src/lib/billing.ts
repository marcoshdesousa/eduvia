// Assinatura manual: o aluno paga pelo WhatsApp e um admin libera o plano em /admin.
// Um plano pago (Eduvia: 7 ou 30 dias) e o plano Grátis, bem limitado, para testar. Limites são por dia.
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/core/dates";
import { DEFAULT_PLANS, isUnlimited, normalizeLimits, PAID_PLAN, PERIOD_DAYS, type PlanLimits, type PlanSlug } from "@/lib/plans";

type UserLike = { id: string; timezone?: string; isAdmin?: boolean };

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
  return (process.env.WHATSAPP_NUMBER || "5562992097369").replace(/\D/g, "");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function subscribeMessage(plan: { name: string; priceWeekCents: number; priceMonthCents: number }, interval: "WEEK" | "MONTH", user: { name: string; handle: string | null }) {
  const period = interval === "WEEK" ? `semanal (7 dias) por ${formatBRL(plan.priceWeekCents)}` : `mensal (30 dias) por ${formatBRL(plan.priceMonthCents)}`;
  return `Olá! Quero assinar o plano ${plan.name} ${period}.\nNome: ${user.name}\nUsuário: @${user.handle}`;
}

/** Com BILLING_ENFORCED=false (só para desenvolvimento) todo mundo tem o plano pago. */
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
  | { mode: "full"; reason: "dev" }
  | { mode: "limited"; reason: "free" }
);

export async function getAccess(user: UserLike): Promise<Access> {
  const plans = await listPlans();
  const plan = (slug: string) => plans.find((p) => p.slug === slug) ?? plans[plans.length - 1];
  const sub = await activeSubscription(user.id);
  if (sub) {
    const p = plan(sub.planSlug);
    return { mode: "full", reason: "subscription", until: sub.currentPeriodEnd, interval: sub.interval, planSlug: p.slug as PlanSlug, planName: p.name, limits: p.limits };
  }
  // administradores usam tudo do plano pago (para testar e dar suporte)
  if (!billingEnforced() || user.isAdmin) {
    const p = plan(PAID_PLAN);
    return { mode: "full", reason: "dev", planSlug: p.slug as PlanSlug, planName: p.name, limits: p.limits };
  }
  const free = plan("gratis");
  return { mode: "limited", reason: "free", planSlug: "gratis", planName: free.name, limits: free.limits };
}

// ───────────── Uso de hoje (para aplicar limites e mostrar ao aluno) ─────────────

/** Páginas enviadas hoje (todas) e páginas escaneadas lidas pela IA hoje. */
async function pagesToday(userId: string, dayStart: Date, exceptMaterialId?: string) {
  const mats = await db.material.findMany({
    where: { uploaderId: userId, createdAt: { gte: dayStart }, status: { not: "ERROR" }, ...(exceptMaterialId ? { id: { not: exceptMaterialId } } : {}) },
    select: { blobId: true, blob: { select: { pageCount: true } } },
  });
  const blobIds = mats.flatMap((m) => (m.blobId ? [m.blobId] : []));
  const scanned = blobIds.length ? await db.materialPage.count({ where: { blobId: { in: blobIds }, ocr: true } }) : 0;
  return { pages: mats.reduce((s, m) => s + (m.blob?.pageCount ?? 0), 0), scanned };
}

export async function usage(user: UserLike) {
  const tz = user.timezone ?? "America/Sao_Paulo";
  const dayStart = localDayStart(tz);
  const [activePreparations, materials, pages, newSessionsToday, gamesToday, examsToday, essaysToday, tutorToday, groupsOwned, studyDay] = await Promise.all([
    db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } }),
    db.material.count({ where: { preparation: { userId: user.id }, role: "CONTENT", status: { not: "ERROR" } } }),
    pagesToday(user.id, dayStart),
    db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: dayStart } } }),
    db.gameRun.count({ where: { userId: user.id, startedAt: { gte: dayStart } } }),
    db.exam.count({ where: { ownerId: user.id, createdAt: { gte: dayStart } } }),
    db.essay.count({ where: { userId: user.id, status: { not: "DRAFT" }, createdAt: { gte: dayStart } } }),
    db.tutorMessage.count({ where: { role: "user", createdAt: { gte: dayStart }, thread: { userId: user.id } } }),
    db.group.count({ where: { ownerId: user.id } }),
    db.studyDay.findUnique({ where: { userId_date: { userId: user.id, date: today(tz) } } }),
  ]);
  return {
    activePreparations,
    materials,
    pagesToday: pages.pages,
    scannedToday: pages.scanned,
    newSessionsToday,
    gamesToday,
    examsToday,
    essaysToday,
    tutorToday,
    groupsOwned,
    studyMinutesToday: studyDay?.minutes ?? 0,
  };
}

const over = (used: number, max: number) => !isUnlimited(max) && used >= max;

function upgradeHint(a: Access) {
  return a.reason === "free" ? " Assine o Eduvia para liberar mais." : "";
}

/** Mensagem de limite do dia atingido (a tela mostra o convite para descansar). */
function dailyLimit(a: Access, what: string) {
  return `Você chegou ao limite de hoje: ${what}. Descanse um pouco! Amanhã libera de novo.${upgradeHint(a)}`;
}

// ───────────── Regras (devolvem a mensagem de bloqueio ou null) ─────────────

export async function preparationLimitError(user: UserLike) {
  const a = await getAccess(user);
  const used = await db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } });
  return over(used, a.limits.activePreparations)
    ? `O plano ${a.planName} permite ${a.limits.activePreparations} preparação(ões) ativa(s). Arquive ou exclua uma para criar outra.${upgradeHint(a)}`
    : null;
}

/** Envio de arquivo de conteúdo (conta PDFs guardados e páginas do dia). Edital/ementa só contam páginas. */
export async function uploadLimitError(user: UserLike, role: "CONTENT" | "EDITAL" | "EMENTA" = "CONTENT") {
  const a = await getAccess(user);
  if (a.limits.pagesPerDay === 0) return `O plano ${a.planName} não inclui envio de materiais.${upgradeHint(a)}`;
  const u = await usage(user);
  if (role === "CONTENT" && over(u.materials, a.limits.materials)) {
    return `Você chegou ao limite de ${a.limits.materials} arquivo(s) do plano ${a.planName}. Exclua um material para enviar outro.${upgradeHint(a)}`;
  }
  if (over(u.pagesToday, a.limits.pagesPerDay)) return dailyLimit(a, `${a.limits.pagesPerDay} páginas enviadas`);
  return null;
}

/** Checagem feita no processamento, quando já se sabe quantas páginas o arquivo tem (antes de gastar IA). */
export async function pageQuotaError(userId: string, materialId: string, pages: number) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const a = await getAccess(user);
  if (isUnlimited(a.limits.pagesPerDay)) return null;
  const used = (await pagesToday(userId, localDayStart(user.timezone), materialId)).pages;
  const left = Math.max(0, a.limits.pagesPerDay - used);
  return pages > left
    ? `Este arquivo tem ${pages} páginas, mas hoje restam ${left} das ${a.limits.pagesPerDay} páginas por dia do plano ${a.planName}. Divida o PDF ou envie amanhã.${upgradeHint(a)}`
    : null;
}

/** Páginas escaneadas (foto): a IA precisa ler cada uma. Checado antes do OCR. */
export async function scannedQuotaError(userId: string, materialId: string, pages: number) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const a = await getAccess(user);
  if (isUnlimited(a.limits.scannedPagesPerDay)) return null;
  const used = (await pagesToday(userId, localDayStart(user.timezone), materialId)).scanned;
  const left = Math.max(0, a.limits.scannedPagesPerDay - used);
  return pages > left
    ? `Este arquivo tem ${pages} página(s) escaneada(s) (foto), mas hoje restam ${left} das ${a.limits.scannedPagesPerDay} por dia do plano ${a.planName}. Envie um PDF com texto (não foto) ou tente amanhã.${upgradeHint(a)}`
    : null;
}

/** Sessões de estudo com conteúdo novo (revisões não contam). */
export async function sessionLimitError(user: UserLike & { timezone: string }) {
  const a = await getAccess(user);
  const used = await db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: localDayStart(user.timezone) } } });
  if (a.limits.newSessionsPerDay === 0) return `No plano ${a.planName} você pode fazer revisões e o banco de erros, mas não sessões novas.${upgradeHint(a)}`;
  return over(used, a.limits.newSessionsPerDay) ? dailyLimit(a, `${a.limits.newSessionsPerDay} sessão(ões) nova(s). Revisões continuam liberadas`) : null;
}

export type Feature = "game" | "exam" | "essay" | "tutor";

const FEATURE: Record<Feature, { limit: keyof PlanLimits; used: "gamesToday" | "examsToday" | "essaysToday" | "tutorToday"; none: string; what: (n: number) => string }> = {
  game: { limit: "gamesPerDay", used: "gamesToday", none: "Jogos não fazem parte", what: (n) => `${n} partida(s) de jogo` },
  exam: { limit: "examsPerDay", used: "examsToday", none: "Simulados não fazem parte", what: (n) => `${n} simulado(s). Refazer simulados continua liberado` },
  essay: { limit: "essaysPerDay", used: "essaysToday", none: "A correção de redação não faz parte", what: (n) => `${n} redação(ões) corrigida(s)` },
  tutor: { limit: "tutorMessagesPerDay", used: "tutorToday", none: "O Professor IA não faz parte", what: (n) => `${n} mensagens ao Professor IA` },
};

/** Jogos, simulados, redação e Professor IA: limites por dia. */
export async function featureLimitError(user: UserLike & { timezone: string }, feature: Feature) {
  const a = await getAccess(user);
  const f = FEATURE[feature];
  const max = a.limits[f.limit] as number;
  if (max === 0) return `${f.none} do plano ${a.planName}.${upgradeHint(a)}`;
  const u = await usage(user);
  return over(u[f.used], max) ? dailyLimit(a, f.what(max)) : null;
}

export async function groupCreateError(user: UserLike) {
  const a = await getAccess(user);
  if (!a.limits.groups) return `Grupos fazem parte do plano pago.${upgradeHint(a)}`;
  const owned = await db.group.count({ where: { ownerId: user.id } });
  return over(owned, a.limits.groupsOwned) ? `Você já criou ${owned} grupo(s), o máximo do plano.` : null;
}

export async function groupAccessError(user: UserLike) {
  const a = await getAccess(user);
  return a.limits.groups ? null : `Grupos fazem parte do plano pago.${upgradeHint(a)}`;
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

/** Soma um período de cobrança: 7 dias (semanal) ou 30 dias (mensal). */
export function addPeriod(from: Date, interval: "WEEK" | "MONTH"): Date {
  return addDays(from, PERIOD_DAYS[interval]);
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
