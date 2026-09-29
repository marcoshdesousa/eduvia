import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { nowHHMM, today, weekday } from "@/lib/core/dates";

const WINDOW_MIN = 5;

function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** A cada 5 minutos: avisa quem tem sessão hoje e chegou no horário escolhido (uma vez por dia por preparação). */
export async function sendDueReminders(now = new Date()) {
  const preps = await db.preparation.findMany({
    where: { status: "ACTIVE", user: { guardianConsentStatus: { in: ["NOT_REQUIRED", "GRANTED"] } } },
    include: { user: true },
  });
  let sent = 0;
  for (const prep of preps) {
    const tz = prep.user.timezone;
    const day = today(tz, now);
    if (!prep.studyDays.includes(weekday(day))) continue;
    const delta = minutesOf(nowHHMM(tz, now)) - minutesOf(prep.studyTime);
    if (delta < 0 || delta >= WINDOW_MIN) continue;
    if (prep.lastReminderAt && today(tz, prep.lastReminderAt).getTime() === day.getTime()) continue;

    const pending = await db.plannedSession.findMany({
      where: { plan: { preparationId: prep.id }, date: day, status: "PENDING" },
      include: { topic: true },
      orderBy: { order: "asc" },
    });
    if (!pending.length) continue;
    const minutes = pending.reduce((s, p) => s + p.durationMin, 0);
    await sendMail({
      to: prep.user.email,
      subject: `Hora de estudar: ${prep.title} (${minutes} min)`,
      text: `Olá, ${prep.user.name.split(" ")[0]}!\n\nSeu estudo de hoje em "${prep.title}":\n${pending
        .map((p) => `• ${p.kind === "REVIEW" ? "Revisão" : "Estudo"}: ${p.topic.title} (${p.durationMin} min)`)
        .join("\n")}\n\nComece agora: ${process.env.APP_URL ?? "http://localhost:3000"}/inicio\n\nBons estudos!\nEduvia`,
    });
    await db.preparation.update({ where: { id: prep.id }, data: { lastReminderAt: now } });
    sent++;
  }
  return sent;
}
