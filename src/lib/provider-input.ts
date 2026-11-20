// Leitura e conferência do que o prestador digita (serviço, endereço, bio).
import type { PriceUnit } from "@/generated/prisma/enums";
import { PHONE_BLOCKED_MSG, category, containsPhone, normalizeInstagram, parseBRL, unitsOf } from "@/lib/domain";
import { officialCity } from "@/lib/places";

export class InputError extends Error {}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export function readService(f: FormData) {
  const cat = category(str(f, "category"));
  if (!cat) throw new InputError("Escolha o serviço.");
  const price = parseBRL(str(f, "price"));
  if (price == null || price < 500 || price > 500_000) throw new InputError("Informe um valor entre R$ 5,00 e R$ 5.000,00.");
  const unitRaw = str(f, "unit") as PriceUnit;
  const unit = unitsOf(cat.slug).includes(unitRaw) ? unitRaw : cat.unit;
  const description = str(f, "description").slice(0, 600) || null;
  if (description && containsPhone(description)) throw new InputError(PHONE_BLOCKED_MSG);
  return { category: cat.slug, priceCents: price, unit, description };
}

export function readPlace(f: FormData) {
  const lat = Number(f.get("lat"));
  const lng = Number(f.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -34 || lat > 6 || lng < -75 || lng > -28) throw new InputError("Marque o endereço no mapa.");
  const uf = str(f, "uf").toUpperCase();
  const city = officialCity(uf, str(f, "city"));
  if (!city) throw new InputError("Confira o município e a UF do endereço.");
  const district = str(f, "district").slice(0, 80) || null;
  const label = str(f, "label").slice(0, 40) || district || city;
  if (containsPhone(label)) throw new InputError(PHONE_BLOCKED_MSG);
  return { lat, lng, uf, city, district, label };
}

export function readBio(f: FormData) {
  const bio = str(f, "bio").slice(0, 700) || null;
  if (bio && containsPhone(bio)) throw new InputError(PHONE_BLOCKED_MSG);
  return bio;
}

/** Link do site/empresa: só http(s), sem telefone. */
export function readWebsite(raw: string) {
  const t = raw.trim();
  if (!t) return null;
  const url = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(url);
    if (!u.hostname.includes(".")) throw new Error();
    if (/wa\.me|whatsapp|api\.whatsapp|t\.me|telegram/i.test(u.hostname + u.pathname)) throw new InputError(PHONE_BLOCKED_MSG);
    return u.toString().slice(0, 200);
  } catch (e) {
    if (e instanceof InputError) throw e;
    throw new InputError("Link inválido. Ex.: www.suaempresa.com.br");
  }
}

/** Dados de um perfil (profissão): valor, cobrança, especificações, bio, Instagram e site. */
export function readProfile(f: FormData, creating = false) {
  const svc = readService(f);
  const bio = readBio(f);
  const igRaw = str(f, "instagram");
  const instagram = igRaw ? normalizeInstagram(igRaw) : null;
  if (igRaw && !instagram) throw new InputError("Instagram inválido. Use só o nome, ex.: @maria.diarista");
  const website = readWebsite(str(f, "website"));
  return { ...(creating ? { category: svc.category } : { category: undefined }), priceCents: svc.priceCents, unit: svc.unit, description: svc.description, bio, instagram, website };
}
