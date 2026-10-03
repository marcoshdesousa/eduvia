// Datas "de calendário" (dia local do aluno) são guardadas como meia-noite UTC daquele dia.
// Toda conversão de fuso passa por aqui.

export const DEFAULT_TZ = "America/Sao_Paulo";
const DAY_MS = 86_400_000;

/** "YYYY-MM-DD" do dia atual no fuso informado. */
export function todayKey(tz = DEFAULT_TZ, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Hora local "HH:MM" no fuso informado. */
export function nowHHMM(tz = DEFAULT_TZ, now = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
}

export function dayFromKey(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

export function keyFromDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function today(tz = DEFAULT_TZ, now = new Date()): Date {
  return dayFromKey(todayKey(tz, now));
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / DAY_MS);
}

/** 0 = domingo ... 6 = sábado (para datas de calendário em UTC). */
export function weekday(d: Date): number {
  return d.getUTCDay();
}

export function ageOn(birth: Date, on: Date): number {
  let age = on.getUTCFullYear() - birth.getUTCFullYear();
  const m = on.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && on.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const WEEKDAYS_LONG = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const weekdayShort = (i: number) => WEEKDAYS[i];
export const weekdayLong = (i: number) => WEEKDAYS_LONG[i];

export function formatDay(d: Date, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }): string {
  return new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone: "UTC" }).format(d);
}

/** Data e hora de um instante no fuso do aluno (ex.: "29 de set., 19:05"). */
export function formatDateTime(d: Date, tz = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: tz, day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}
