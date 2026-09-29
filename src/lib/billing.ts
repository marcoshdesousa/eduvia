// Assinatura manual: o aluno paga pelo WhatsApp e um admin ativa o plano em /admin.
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/core/dates";

export const TRIAL_DAYS = 3;

export const PLANS = [
  { slug: "semanal", name: "Semanal", priceCents: 700, interval: "WEEK" as const },
  { slug: "mensal", name: "Mensal", priceCents: 1500, interval: "MONTH" as const },
];

/** O que continua liberado depois do teste grátis, sem assinatura. */
export const LIMITED = {
  activePreparations: 1,
  sessionsPerDay: 1,
  uploads: false,
} as const;

export const LIMITED_SUMMARY = "1 preparação, 1 sessão de estudo por dia e sem envio de novos materiais";

/** Número de WhatsApp que recebe os pedidos de assinatura (DDI + DDD + número, só dígitos). */
export function whatsappNumber() {
  return (process.env.WHATSAPP_NUMBER || "5511999999999").replace(/\D/g, "");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function subscribeMessage(plan: (typeof PLANS)[number], user: { name: string; handle: string | null }) {
  return `Olá! Quero assinar o plano ${plan.name} do Eduvia (${formatBRL(plan.priceCents)}/${plan.interval === "WEEK" ? "semana" : "mês"}).\nNome: ${user.name}\nUsuário: @${user.handle}`;
}

export function trialEnd(from = new Date()) {
  return addDays(from, TRIAL_DAYS);
}

/** Com BILLING_ENFORCED=false (só para desenvolvimento) ninguém entra no modo limitado. */
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

export type Access =
  | { mode: "full"; reason: "subscription"; until: Date; planName: string }
  | { mode: "full"; reason: "trial"; until: Date }
  | { mode: "full"; reason: "dev" }
  | { mode: "limited"; reason: "expired" };

export async function getAccess(user: { id: string; trialEndsAt: Date | null }): Promise<Access> {
  const sub = await activeSubscription(user.id);
  if (sub) return { mode: "full", reason: "subscription", until: sub.currentPeriodEnd, planName: sub.plan.name };
  if (user.trialEndsAt && user.trialEndsAt > new Date()) return { mode: "full", reason: "trial", until: user.trialEndsAt };
  if (!billingEnforced()) return { mode: "full", reason: "dev" };
  return { mode: "limited", reason: "expired" };
}

export async function hasAccess(user: { id: string; trialEndsAt: Date | null }) {
  return (await getAccess(user)).mode === "full";
}

// ───────────── Regras do modo limitado ─────────────

export async function preparationLimitError(user: { id: string; trialEndsAt: Date | null }) {
  if (await hasAccess(user)) return null;
  const active = await db.preparation.count({ where: { userId: user.id, status: "ACTIVE" } });
  return active >= LIMITED.activePreparations
    ? `No modo limitado você pode ter ${LIMITED.activePreparations} preparação ativa. Assine um plano para criar mais.`
    : null;
}

export async function uploadLimitError(user: { id: string; trialEndsAt: Date | null }) {
  if (LIMITED.uploads || (await hasAccess(user))) return null;
  return "Seu teste grátis acabou. Assine um plano para enviar novos materiais.";
}

export async function sessionLimitError(user: { id: string; trialEndsAt: Date | null; timezone: string }) {
  if (await hasAccess(user)) return null;
  const started = await db.studySession.count({ where: { userId: user.id, startedAt: { gte: localDayStart(user.timezone) } } });
  return started >= LIMITED.sessionsPerDay
    ? `No modo limitado você faz ${LIMITED.sessionsPerDay} sessão por dia. Assine um plano para estudar sem limite.`
    : null;
}

/** Início do dia local do aluno, como instante UTC (ex.: 00:00 em São Paulo = 03:00 UTC). */
export function localDayStart(tz: string, now = new Date()) {
  const day = today(tz, now);
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
