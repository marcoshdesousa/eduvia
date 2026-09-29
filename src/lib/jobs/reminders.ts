// Lembretes: no horário de estudo de cada preparação e avisos de teste/plano acabando.
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { keyFromDay, nowHHMM, today, weekday } from "@/lib/core/dates";
import { formatMinutes } from "@/lib/utils";

const WINDOW_MIN = 5;
const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** A cada 5 minutos: quem chegou no horário escolhido e ainda tem sessão hoje recebe o lembrete (uma vez por dia). */
export async function sendStudyReminders(now = new Date()) {
  const preps = await db.preparation.findMany({ where: { status: "ACTIVE", user: { remindersEnabled: true } }, include: { user: true } });
  let sent = 0;
  for (const prep of preps) {
    const tz = prep.user.timezone;
    const day = today(tz, now);
    if (!prep.studyDays.includes(weekday(day))) continue;
    const delta = minutesOf(nowHHMM(tz, now)) - minutesOf(prep.studyTime);
    if (delta < 0 || delta >= WINDOW_MIN) continue;
    const pending = await db.plannedSession.findMany({ where: { plan: { preparationId: prep.id }, date: day, status: "PENDING" } });
    if (!pending.length) continue;
    const minutes = pending.reduce((s, p) => s + p.durationMin, 0);
    const n = await notify(prep.user.id, {
      type: "STUDY_REMINDER",
      title: `Hora de estudar: ${prep.title}`,
      body: `${pending.length} sessão(ões) hoje · ${formatMinutes(minutes)}. Bora manter a sequência!`,
      href: "/inicio",
      dedupeKey: `lembrete:${prep.id}:${keyFromDay(day)}`,
    });
    if (n) sent++;
  }
  return sent;
}

/** Diário: teste grátis acabando (último dia) e plano vencendo em até 2 dias. */
export async function sendBillingReminders(now = new Date()) {
  const soon = new Date(now.getTime() + 24 * 3600_000);
  const trials = await db.user.findMany({ where: { trialEndsAt: { gt: now, lte: soon }, subscriptions: { none: { status: "ACTIVE", currentPeriodEnd: { gt: now } } } } });
  for (const u of trials) {
    await notify(u.id, {
      type: "TRIAL_ENDING",
      title: "Seu teste grátis termina amanhã",
      body: "Assine pelo WhatsApp para continuar com tudo liberado.",
      href: "/assinatura",
      dedupeKey: `teste:${u.id}`,
    });
  }
  const subs = await db.subscription.findMany({ where: { status: "ACTIVE", currentPeriodEnd: { gt: now, lte: new Date(now.getTime() + 2 * 86_400_000) } }, include: { plan: true } });
  for (const s of subs) {
    await notify(s.userId, {
      type: "PLAN_EXPIRING",
      title: `Seu plano ${s.plan.name} vence em breve`,
      body: "Renove pelo WhatsApp para não voltar ao plano Grátis.",
      href: "/assinatura",
      dedupeKey: `plano:${s.id}:${s.currentPeriodEnd.toISOString().slice(0, 10)}`,
    });
  }
  return trials.length + subs.length;
}
