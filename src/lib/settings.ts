import { db } from "@/lib/db";

/** Configurações que o admin pode mudar (com os valores padrão). */
export const SETTING_DEFAULTS = {
  /** horas para o prestador responder um pedido normal antes de expirar */
  requestExpiryHours: 12,
  /** Contrate rápido: segundos que cada chamado fica tocando para um prestador */
  quickRingSeconds: 45,
  /** Contrate rápido: quantos prestadores tocam ao mesmo tempo em cada rodada */
  quickWaveSize: 3,
  /** Contrate rápido: raio máximo de busca (km) */
  quickMaxKm: 40,
  /** Contrate rápido: minutos procurando antes de avisar que ninguém aceitou */
  quickSearchMinutes: 8,
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
