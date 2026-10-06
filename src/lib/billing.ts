// Assinatura: o aluno paga pelo Pix (SyncPay, libera sozinho) ou o admin libera o plano em /admin.
// Planos mensais (Pro, Avançado e Ilimitado) e o teste grátis de 3 dias. Depois do teste, só assinando.
// Arquivos e páginas não têm limite em nenhum plano.
import { db } from "@/lib/db";
import { addDays, diffDays, today } from "@/lib/core/dates";
import { DEFAULT_PLANS, intervalInfo, isUnlimited, normalizeLimits, PAID_PLAN, PERIOD_DAYS, priceFor, TRIAL_DAYS, type Interval, type PlanLimits, type PlanSlug } from "@/lib/plans";

type UserLike = { id: string; timezone?: string; isAdmin?: boolean; createdAt?: Date; trialEndsAt?: Date | null };

export type PlanRow = { slug: string; name: string; order: number; priceWeekCents: number; priceFortnightCents: number; priceMonthCents: number; limits: PlanLimits; active: boolean };

/** Planos do banco (com os padrões como reserva). */
export async function listPlans(): Promise<PlanRow[]> {
  const rows = await db.plan.findMany({ orderBy: { order: "asc" } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged = DEFAULT_PLANS.map((d) => {
    const r = bySlug.get(d.slug);
    return r
      ? { slug: r.slug, name: r.name, order: r.order, priceWeekCents: r.priceWeekCents, priceFortnightCents: r.priceFortnightCents, priceMonthCents: r.priceMonthCents, limits: normalizeLimits(r.limits, r.slug), active: r.active }
      : { ...d, active: d.active ?? true };
  });
  return merged.sort((a, b) => a.order - b.order);
}

export async function getPlan(slug: string): Promise<PlanRow | null> {
  return (await listPlans()).find((p) => p.slug === slug) ?? null;
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
  | { mode: "full"; reason: "subscription"; until: Date; interval: Interval }
  | { mode: "full"; reason: "dev" }
  | { mode: "limited"; reason: "trial"; since: Date; until: Date }
  | { mode: "limited"; reason: "expired"; ended?: { planName: string; at: Date } }
);

/** Aviso de renovação: começa 2 dias antes do vencimento (pelo calendário do aluno). */
export const RENEW_NOTICE_DAYS = 2;

/** Quantos dias do calendário faltam até o vencimento (0 = vence hoje). */
export function daysLeft(until: Date, tz = "America/Sao_Paulo", now = new Date()) {
  return diffDays(today(tz, until), today(tz, now));
}

/** Plano pago perto de vencer (mostra o aviso para pagar). */
export function renewSoon(a: Access, tz?: string) {
  return a.reason === "subscription" && daysLeft(a.until, tz) <= RENEW_NOTICE_DAYS;
}

/** Fim do teste grátis: o que ficou gravado no cadastro (ou 3 dias depois de criar a conta). */
async function trialWindow(user: UserLike) {
  let { createdAt, trialEndsAt } = user;
  if (!createdAt) {
    const row = await db.user.findUnique({ where: { id: user.id }, select: { createdAt: true, trialEndsAt: true } });
    createdAt = row?.createdAt ?? new Date();
    trialEndsAt = row?.trialEndsAt ?? null;
  }
  const until = trialEndsAt ?? addDays(createdAt, TRIAL_DAYS);
  return { since: createdAt, until };
}

/** Teste encerrado sem assinatura: dá para ver o que já tem, mas não criar nada novo. */
const EXPIRED_LIMITS: PlanLimits = {
  activePreparations: 0, preparationsPerMonth: 0, materials: 0, pagesPerDay: 0, pagesPerPdf: 0, scannedPagesPerDay: 0, newSessionsPerDay: 0,
  gamesPerDay: 0, examsPerMonth: 0, essaysPerDay: 0, tutorMessagesPerDay: 0, groups: false, groupsOwned: 0, restAfterMinutes: 180,
};

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
  // já teve plano pago que venceu: a conta continua, só falta pagar o próximo mês (o teste grátis já foi usado)
  const last = await db.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE"] }, currentPeriodEnd: { lte: new Date() } },
    include: { plan: true },
    orderBy: { currentPeriodEnd: "desc" },
  });
  if (last) {
    return { mode: "limited", reason: "expired", ended: { planName: last.plan.name, at: last.currentPeriodEnd }, planSlug: "gratis", planName: `${last.plan.name} (vencido)`, limits: EXPIRED_LIMITS };
  }
  const free = plan("gratis");
  const trial = await trialWindow(user);
  if (trial.until > new Date()) return { mode: "limited", reason: "trial", ...trial, planSlug: "gratis", planName: free.name, limits: free.limits };
  return { mode: "limited", reason: "expired", planSlug: "gratis", planName: "Teste grátis (encerrado)", limits: EXPIRED_LIMITS };
}

// ───────────── Uso de hoje (para aplicar limites e mostrar ao aluno) ─────────────

/** Páginas enviadas hoje (só arquivos que deram certo) e páginas escaneadas lidas pela IA hoje. */
async function pagesToday(userId: string, dayStart: Date, exceptMaterialId?: string) {
  const mats = await db.material.findMany({
    where: { uploaderId: userId, createdAt: { gte: dayStart }, status: "READY", ...(exceptMaterialId ? { id: { not: exceptMaterialId } } : {}) },
    select: { blobId: true, blob: { select: { pageCount: true } } },
  });
  const blobIds = mats.flatMap((m) => (m.blobId ? [m.blobId] : []));
  const scanned = blobIds.length ? await db.materialPage.count({ where: { blobId: { in: blobIds }, ocr: true } }) : 0;
  return { pages: mats.reduce((s, m) => s + (m.blob?.pageCount ?? 0), 0), scanned };
}

export async function usage(user: UserLike) {
  const tz = user.timezone ?? "America/Sao_Paulo";
  const dayStart = localDayStart(tz);
  const monthStart = localMonthStart(tz);
  const [preparationsThisMonth, activePreparations, materials, pages, newSessionsToday, gamesToday, examsThisMonth, essaysToday, tutorToday, groupsOwned, studyDay] = await Promise.all([
    db.preparationCreation.count({ where: { userId: user.id, createdAt: { gte: monthStart } } }),
    db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } }),
    db.material.count({ where: { preparation: { userId: user.id }, role: "CONTENT", status: { not: "ERROR" } } }),
    pagesToday(user.id, dayStart),
    db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: dayStart }, NOT: { topicId: { startsWith: "enem-" } } } }),
    db.gameRun.count({ where: { userId: user.id, startedAt: { gte: dayStart } } }),
    db.exam.count({ where: { ownerId: user.id, createdAt: { gte: monthStart } } }),
    db.essay.count({ where: { userId: user.id, status: { not: "DRAFT" }, createdAt: { gte: dayStart } } }),
    db.tutorMessage.count({ where: { role: "user", createdAt: { gte: dayStart }, thread: { userId: user.id } } }),
    db.group.count({ where: { ownerId: user.id } }),
    db.studyDay.findUnique({ where: { userId_date: { userId: user.id, date: today(tz) } } }),
  ]);
  return {
    preparationsThisMonth,
    activePreparations,
    materials,
    pagesToday: pages.pages,
    scannedToday: pages.scanned,
    newSessionsToday,
    gamesToday,
    examsThisMonth,
    essaysToday,
    tutorToday,
    groupsOwned,
    studyMinutesToday: studyDay?.minutes ?? 0,
  };
}

const over = (used: number, max: number) => !isUnlimited(max) && used >= max;

function upgradeHint(a: Access) {
  if (a.reason === "expired") return a.ended ? " Seu plano venceu: pague o próximo mês para continuar." : " Seu teste grátis acabou: assine um plano para continuar.";
  if (a.reason === "trial") return " Assine um plano para liberar mais.";
  return a.planSlug !== "ilimitado" && a.reason === "subscription" ? " Um plano maior libera mais." : "";
}

/** Mensagem de limite do dia atingido (a tela mostra o convite para descansar). */
function dailyLimit(a: Access, what: string) {
  return `Você chegou ao limite de hoje: ${what}. Descanse um pouco! Amanhã libera de novo.${upgradeHint(a)}`;
}

// ───────────── Regras (devolvem a mensagem de bloqueio ou null) ─────────────

/** Ativar uma preparação arquivada: só olha as ativas ao mesmo tempo. */
export async function activePreparationLimitError(user: UserLike) {
  const a = await getAccess(user);
  const used = await db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } });
  return over(used, a.limits.activePreparations)
    ? `O plano ${a.planName} permite ${a.limits.activePreparations} preparação(ões) ativa(s). Arquive ou exclua uma para ativar outra.${upgradeHint(a)}`
    : null;
}

/** Criar um guia de estudo: limite por mês (apagar ou editar não devolve a vaga) e ativas ao mesmo tempo. */
export async function preparationLimitError(user: UserLike & { timezone?: string }) {
  const a = await getAccess(user);
  const max = a.limits.preparationsPerMonth;
  if (max === 0) return `O plano ${a.planName} não inclui criar guias de estudo.${upgradeHint(a)}`;
  const used = await db.preparationCreation.count({ where: { userId: user.id, createdAt: { gte: localMonthStart(user.timezone ?? "America/Sao_Paulo") } } });
  if (over(used, max)) {
    return `Você já criou ${used} de ${max} guia${max === 1 ? "" : "s"} de estudo este mês no plano ${a.planName}. Apagar um guia não devolve a vaga; no mês que vem libera de novo.${upgradeHint(a)}`;
  }
  return activePreparationLimitError(user);
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
  if (!isUnlimited(a.limits.pagesPerPdf) && pages > a.limits.pagesPerPdf) {
    return `Este arquivo tem ${pages} páginas. No plano ${a.planName}, cada PDF pode ter até ${a.limits.pagesPerPdf} páginas. Envie só a parte que vai estudar agora ou assine um plano para PDFs sem limite.`;
  }
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
  // as aulas do Estudar ENEM (preparação da plataforma) não contam no limite
  const used = await db.studySession.count({ where: { userId: user.id, kind: "STUDY", startedAt: { gte: localDayStart(user.timezone) }, NOT: { topicId: { startsWith: "enem-" } } } });
  if (a.limits.newSessionsPerDay === 0) return `No plano ${a.planName} você pode fazer revisões e o banco de erros, mas não sessões novas.${upgradeHint(a)}`;
  return over(used, a.limits.newSessionsPerDay) ? dailyLimit(a, `${a.limits.newSessionsPerDay} sessão(ões) nova(s). Revisões continuam liberadas`) : null;
}

export type Feature = "game" | "exam" | "essay" | "tutor";

const FEATURE: Record<Feature, { limit: keyof PlanLimits; used: "gamesToday" | "examsThisMonth" | "essaysToday" | "tutorToday"; none: string; what: (n: number) => string; period?: "month" }> = {
  game: { limit: "gamesPerDay", used: "gamesToday", none: "Testes rápidos não fazem parte", what: (n) => `${n} teste(s) rápido(s)` },
  exam: { limit: "examsPerMonth", used: "examsThisMonth", none: "Simulados não fazem parte", what: (n) => `${n} simulados por mês`, period: "month" },
  essay: { limit: "essaysPerDay", used: "essaysToday", none: "A correção de redação não faz parte", what: (n) => `${n} redação(ões) corrigida(s)` },
  tutor: { limit: "tutorMessagesPerDay", used: "tutorToday", none: "O Professor IA não faz parte", what: (n) => `${n} mensagens ao Professor IA` },
};

/** Testes rápidos, redação e Professor IA: limites por dia; simulados: por mês. */
export async function featureLimitError(user: UserLike & { timezone: string }, feature: Feature) {
  const a = await getAccess(user);
  const f = FEATURE[feature];
  const max = a.limits[f.limit] as number;
  if (max === 0) return `${f.none} do plano ${a.planName}.${upgradeHint(a)}`;
  if (a.reason === "trial" && feature !== "tutor") {
    const since = a.since;
    const used =
      feature === "game"
        ? await db.gameRun.count({ where: { userId: user.id, startedAt: { gte: since } } })
        : feature === "exam"
          ? await db.exam.count({ where: { ownerId: user.id, createdAt: { gte: since } } })
          : await db.essay.count({ where: { userId: user.id, status: { not: "DRAFT" }, createdAt: { gte: since } } });
    const [one, many] = { game: ["teste rápido", "testes rápidos"], exam: ["simulado", "simulados"], essay: ["redação corrigida", "redações corrigidas"] }[feature];
    return over(used, max) ? `No teste grátis dá para fazer ${max} ${max === 1 ? one : many} no total.${upgradeHint(a)}` : null;
  }
  const u = await usage(user);
  if (!over(u[f.used], max)) return null;
  return f.period === "month"
    ? `Você já fez os ${f.what(max)} do seu plano. No mês que vem libera de novo; refazer simulados continua liberado.${upgradeHint(a)}`
    : dailyLimit(a, f.what(max));
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

/** Soma um período de cobrança: 7, 15 ou 30 dias. */
export function addPeriod(from: Date, interval: Interval): Date {
  return addDays(from, PERIOD_DAYS[interval]);
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
