import { db } from "@/lib/db";

/** Configurações que o admin pode mudar (com os valores padrão). */
export const SETTING_DEFAULTS = {
  /** horas para o profissional responder antes da solicitação expirar */
  requestExpiryHours: 12,
  /** permitir que o profissional atenda em mais de um município */
  multipleCities: true,
  /** quantos municípios no máximo */
  maxCities: 5,
  /** WhatsApp do suporte (opcional; aparece na tela de suporte) */
  supportWhatsapp: "",
};
export type Settings = typeof SETTING_DEFAULTS;

export async function getSettings(): Promise<Settings> {
  const rows = await db.platformSetting.findMany();
  const out: Record<string, unknown> = { ...SETTING_DEFAULTS };
  for (const r of rows) if (r.key in SETTING_DEFAULTS) out[r.key] = r.value;
  return out as Settings;
}

export async function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  await db.platformSetting.upsert({ where: { key }, create: { key, value: value as never }, update: { value: value as never } });
}
