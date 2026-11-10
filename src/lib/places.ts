// Estados e municípios do Brasil (lista em src/data/municipios.json) e fuso horário de cada estado.
import data from "@/data/municipios.json";

type Data = Record<string, { nome: string; cidades: string[] }>;
const D = data as Data;

export const UFS = Object.keys(D).map((uf) => ({ uf, name: D[uf].nome }));
export const ufName = (uf: string) => D[uf]?.nome ?? uf;
export const citiesOf = (uf: string) => D[uf]?.cidades ?? [];

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Nome oficial do município (aceita sem acento e com maiúsculas diferentes), ou null se não existe na UF. */
export function officialCity(uf: string, city: string) {
  const f = fold(city);
  return citiesOf(uf).find((c) => fold(c) === f) ?? null;
}

/** Fuso de cada estado (o horário da limpeza é o do lugar). */
const TZ: Record<string, string> = {
  AC: "America/Rio_Branco",
  AM: "America/Manaus",
  RR: "America/Boa_Vista",
  RO: "America/Porto_Velho",
  MT: "America/Cuiaba",
  MS: "America/Campo_Grande",
};
export const timeZoneOf = (uf: string) => TZ[uf] ?? "America/Sao_Paulo";

/** Diferença do fuso para UTC, em minutos, naquele instante (ex.: -180 em São Paulo). */
function offsetMinutes(tz: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(at);
  const g = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"));
  return Math.round((asUtc - at.getTime()) / 60_000);
}

/** Data "AAAA-MM-DD" + hora "HH:MM" no horário do estado → instante (UTC). */
export function localToUtc(date: string, time: string, uf: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;
  const guess = Date.UTC(Number(d[1]), Number(d[2]) - 1, Number(d[3]), Number(t[1]), Number(t[2]));
  const off = offsetMinutes(timeZoneOf(uf), new Date(guess));
  return new Date(guess - off * 60_000);
}

/** Dia da semana (0 = domingo) e minutos desde 0h no horário do estado. */
export function localParts(at: Date, uf: string) {
  const local = new Date(at.getTime() + offsetMinutes(timeZoneOf(uf), at) * 60_000);
  return { weekday: local.getUTCDay(), minutes: local.getUTCHours() * 60 + local.getUTCMinutes() };
}

export function formatWhen(at: Date, uf: string) {
  return at.toLocaleString("pt-BR", { timeZone: timeZoneOf(uf), weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
