// Configurações do site editáveis no /admin (tabela SiteSetting): links das redes sociais do rodapé.
import { db } from "@/lib/db";

import { SOCIALS, type SocialKey } from "@/lib/site-config";

export { SOCIALS, type SocialKey };
export type SocialLink = { key: SocialKey; label: string; href: string };

const settingKey = (k: SocialKey) => `social.${k}`;

/** Links cadastrados pelo admin (os vazios não aparecem no rodapé). */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await db.siteSetting.findMany({ where: { key: { in: SOCIALS.map((s) => settingKey(s.key)) } } }).catch(() => []);
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  return SOCIALS.flatMap((s) => {
    const href = byKey.get(settingKey(s.key));
    return href ? [{ key: s.key, label: s.label, href }] : [];
  });
}

/** Normaliza o que o admin digitou: número de WhatsApp vira link wa.me; @perfil vira URL da rede. */
export function normalizeSocial(key: SocialKey, raw: string): string | null {
  const v = raw.trim();
  if (!v) return "";
  if (key === "whatsapp" && !/^https?:/i.test(v)) {
    const digits = v.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) return null;
    return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`;
  }
  if (v.startsWith("@")) {
    const handle = v.slice(1).replace(/[^\w.]/g, "");
    if (!handle) return null;
    const base = { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/@", x: "https://x.com/", whatsapp: "" }[key];
    return base ? base + handle : null;
  }
  const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export async function saveSocialLinks(values: Record<SocialKey, string>) {
  for (const s of SOCIALS) {
    const value = values[s.key];
    if (value) await db.siteSetting.upsert({ where: { key: settingKey(s.key) }, create: { key: settingKey(s.key), value }, update: { value } });
    else await db.siteSetting.deleteMany({ where: { key: settingKey(s.key) } });
  }
}
