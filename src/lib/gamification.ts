import { db } from "@/lib/db";
import { addDays, diffDays, today, weekday } from "@/lib/core/dates";

export const XP = { correct: 5, attempt: 1, sessionDone: 20, reviewDone: 10 } as const;

const TITLES: [number, string][] = [
  [1, "Iniciante"],
  [3, "Estudante"],
  [5, "Dedicado"],
  [8, "Avançado"],
  [12, "Mestre"],
  [16, "Lenda"],
];

export function levelTitle(level: number) {
  return [...TITLES].reverse().find(([min]) => level >= min)![1];
}

export function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const currentFloor = 50 * (level - 1) ** 2;
  const nextFloor = 50 * level ** 2;
  return { level, title: levelTitle(level), progress: (xp - currentFloor) / (nextFloor - currentFloor), nextFloor };
}

export async function addXp(userId: string, amount: number, reason: string, refId?: string) {
  await db.$transaction([
    db.xpEvent.create({ data: { userId, amount, reason, refId } }),
    db.user.update({ where: { id: userId }, data: { xp: { increment: amount } } }),
  ]);
}

/**
 * Registra um dia de estudo e atualiza a sequência.
 * A sequência só quebra se o aluno pulou um dia em que tinha estudo agendado (dias de folga não contam).
 */
export async function registerStudy(userId: string, minutes: number) {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: { preparations: { where: { status: "ACTIVE" }, select: { studyDays: true } } },
  });
  const day = today(user.timezone);
  await db.studyDay.upsert({
    where: { userId_date: { userId, date: day } },
    create: { userId, date: day, minutes },
    update: { minutes: { increment: minutes } },
  });
  if (user.lastStudyDate && diffDays(day, user.lastStudyDate) === 0) return;

  const scheduled = new Set(user.preparations.flatMap((p) => p.studyDays));
  let streak = 1;
  if (user.lastStudyDate) {
    let broken = false;
    for (let d = addDays(user.lastStudyDate, 1); d < day; d = addDays(d, 1)) {
      if (scheduled.size === 0 || scheduled.has(weekday(d))) {
        broken = true;
        break;
      }
    }
    streak = broken ? 1 : user.currentStreak + 1;
  }
  await db.user.update({
    where: { id: userId },
    data: { currentStreak: streak, longestStreak: Math.max(streak, user.longestStreak), lastStudyDate: day },
  });
}
