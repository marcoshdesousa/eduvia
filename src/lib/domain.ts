// Regras do Diária Paga que não dependem do banco (testadas em domain.test.ts).
import type { BookingMode, BookingStatus, Plan, PriceUnit } from "@/generated/prisma/enums";

// ───────────── Planos do prestador ─────────────

export const PLANS: Record<Plan, { name: string; priceCents: number; platformCents: number; feesCents: number; places: number; recommended: boolean }> = {
  BASIC: { name: "Básico", priceCents: 685, platformCents: 300, feesCents: 385, places: 1, recommended: false },
  FULL: { name: "Completo", priceCents: 1585, platformCents: 1000, feesCents: 585, places: 3, recommended: true },
};
/** Pacote de endereços extras (só no Completo): +2 endereços por R$ 3,85 por mês. */
export const PACK_CENTS = 385;
export const PACK_PLACES = 2;
export const MAX_PLACES = 11;
export const MAX_PACKS = Math.floor((MAX_PLACES - PLANS.FULL.places) / PACK_PLACES); // 4
export const PERIOD_DAYS = 30;
export const TRIAL_DAYS = 3;

/** Valor do mês: plano + pacotes (pacotes só existem no Completo). */
export function monthlyCents(plan: Plan, packs: number) {
  return PLANS[plan].priceCents + (plan === "FULL" ? Math.max(0, Math.min(packs, MAX_PACKS)) * PACK_CENTS : 0);
}

/** Quantos endereços no mapa o plano permite. */
export function placesLimit(plan: Plan, packs: number) {
  return Math.min(MAX_PLACES, PLANS[plan].places + (plan === "FULL" ? Math.max(0, Math.min(packs, MAX_PACKS)) * PACK_PLACES : 0));
}

/** Subir do Básico para o Completo no meio do mês: paga só a diferença dos dias que faltam. */
/** Subir do Básico para o Completo: paga o Completo inteiro (sem desconto pelos dias já usados) e começa um mês novo. */
export function upgradeCents() {
  return PLANS.FULL.priceCents;
}

// ───────────── Indicação ─────────────

/** Cada pessoa que entra pelo link dá 0,5% de desconto na próxima mensalidade, até 30%. O Básico nunca fica abaixo de R$ 4,85. */
export const REFERRAL_PCT_EACH = 0.5;
export const REFERRAL_MAX_PCT = 30;
export const BASIC_MIN_CENTS = 485;
export const referralPct = (count: number) => Math.min(REFERRAL_MAX_PCT, Math.max(0, count) * REFERRAL_PCT_EACH);
export function discountedCents(cents: number, plan: Plan, count: number) {
  const out = Math.round(cents * (1 - referralPct(count) / 100));
  return plan === "BASIC" ? Math.max(Math.min(cents, BASIC_MIN_CENTS), out) : out;
}

// ───────────── Penalidades do Contrate rápido ─────────────

/** O prestador tem 2 horas para chegar depois de aceitar. */
export const ARRIVE_HOURS = 2;
/** Prestador que aceitou e não chegou: 7 dias fora do Contrate rápido. */
export const PRO_QUICK_BAN_DAYS = 7;
/** Cliente que não estava no endereço: 30 dias sem contratar, ou paga R$ 2,85 para liberar na hora. */
export const CLIENT_BLOCK_DAYS = 30;
export const UNLOCK_FEE_CENTS = 285;
/** O prestador só pode marcar "cliente não estava" depois de esperar este tempo no endereço. */
export const CLIENT_NOSHOW_WAIT_MIN = 15;

// ───────────── Serviços ─────────────

export const UNIT_LABEL: Record<PriceUnit, { one: string; many: string; per: string }> = {
  DIARIA: { one: "diária", many: "diárias", per: "por diária" },
  HORA: { one: "hora", many: "horas", per: "por hora" },
  SERVICO: { one: "serviço", many: "serviços", per: "por serviço" },
};
export const qtyLabel = (unit: PriceUnit, n: number) => `${n} ${n === 1 ? UNIT_LABEL[unit].one : UNIT_LABEL[unit].many}`;
/** "3 diárias (até 8 h por dia)" */
export const qtyLong = (unit: PriceUnit, n: number) => `${qtyLabel(unit, n)}${unit === "DIARIA" ? ` (até ${DIARIA_HOURS} h por dia)` : ""}`;
/** Diária = até 8 horas de trabalho. Por hora: de 1 a 8 horas (mais que isso, é diária). Diárias: até 30 (sem desconto). */
export const DIARIA_HOURS = 8;
export const MAX_QTY: Record<PriceUnit, number> = { DIARIA: 30, HORA: DIARIA_HOURS, SERVICO: 10 };

export const CATEGORY_GROUPS = ["Casa e limpeza", "Obras e reparos", "Cuidados", "Transporte e entregas", "Beleza e bem-estar", "Outros"] as const;

export const CATEGORIES = [
  { slug: "diarista", label: "Diarista / faxina", emoji: "🧹", unit: "DIARIA", group: "Casa e limpeza", quick: 15000 },
  { slug: "passadeira", label: "Passadeira", emoji: "👕", unit: "DIARIA", group: "Casa e limpeza", quick: 12000 },
  { slug: "lavadeira", label: "Lavadeira", emoji: "🧺", unit: "DIARIA", group: "Casa e limpeza", quick: 12000 },
  { slug: "cozinheira", label: "Cozinheira", emoji: "🍲", unit: "DIARIA", group: "Casa e limpeza", quick: 15000 },
  { slug: "jardineiro", label: "Jardineiro", emoji: "🌿", unit: "DIARIA", group: "Casa e limpeza", quick: 15000 },
  { slug: "piscineiro", label: "Limpeza de piscina", emoji: "🏊", unit: "SERVICO", group: "Casa e limpeza", quick: 12000 },
  { slug: "dedetizacao", label: "Dedetização", emoji: "🪳", unit: "SERVICO", group: "Casa e limpeza", quick: 20000 },
  { slug: "pedreiro", label: "Pedreiro", emoji: "🧱", unit: "DIARIA", group: "Obras e reparos", quick: 18000 },
  { slug: "servente", label: "Servente / ajudante de obra", emoji: "🦺", unit: "DIARIA", group: "Obras e reparos", quick: 11000 },
  { slug: "pintor", label: "Pintor", emoji: "🎨", unit: "DIARIA", group: "Obras e reparos", quick: 17000 },
  { slug: "eletricista", label: "Eletricista", emoji: "⚡", unit: "SERVICO", group: "Obras e reparos", quick: 15000 },
  { slug: "encanador", label: "Encanador", emoji: "🔧", unit: "SERVICO", group: "Obras e reparos", quick: 13000 },
  { slug: "carpinteiro", label: "Carpinteiro / marceneiro", emoji: "🪚", unit: "DIARIA", group: "Obras e reparos", quick: 18000 },
  { slug: "gesseiro", label: "Gesseiro", emoji: "🏗️", unit: "DIARIA", group: "Obras e reparos", quick: 18000 },
  { slug: "azulejista", label: "Azulejista", emoji: "🔲", unit: "DIARIA", group: "Obras e reparos", quick: 18000 },
  { slug: "serralheiro", label: "Serralheiro", emoji: "🔩", unit: "SERVICO", group: "Obras e reparos", quick: 18000 },
  { slug: "vidraceiro", label: "Vidraceiro", emoji: "🪟", unit: "SERVICO", group: "Obras e reparos", quick: 15000 },
  { slug: "montador", label: "Montador de móveis", emoji: "🪑", unit: "SERVICO", group: "Obras e reparos", quick: 10000 },
  { slug: "ar-condicionado", label: "Técnico de ar-condicionado", emoji: "❄️", unit: "SERVICO", group: "Obras e reparos", quick: 18000 },
  { slug: "cuidador-idoso", label: "Cuidador(a) de idoso", emoji: "🧓", unit: "DIARIA", group: "Cuidados", quick: 15000 },
  { slug: "baba", label: "Babá", emoji: "🍼", unit: "DIARIA", group: "Cuidados", quick: 13000 },
  { slug: "pet", label: "Cuidador de pets / passeador", emoji: "🐕", unit: "SERVICO", group: "Cuidados", quick: 5000 },
  { slug: "enfermagem", label: "Técnico(a) de enfermagem", emoji: "🩺", unit: "DIARIA", group: "Cuidados", quick: 20000 },
  { slug: "motorista", label: "Motorista particular", emoji: "🚗", unit: "SERVICO", group: "Transporte e entregas", quick: 5000 },
  { slug: "compras", label: "Compras no supermercado", emoji: "🛒", unit: "SERVICO", group: "Transporte e entregas", quick: 4000 },
  { slug: "frete", label: "Frete e mudança", emoji: "🚚", unit: "SERVICO", group: "Transporte e entregas", quick: 15000 },
  { slug: "chapa", label: "Carregador / chapa", emoji: "📦", unit: "DIARIA", group: "Transporte e entregas", quick: 12000 },
  { slug: "manicure", label: "Manicure", emoji: "💅", unit: "SERVICO", group: "Beleza e bem-estar", quick: 4000 },
  { slug: "cabeleireiro", label: "Cabeleireiro(a)", emoji: "💇", unit: "SERVICO", group: "Beleza e bem-estar", quick: 5000 },
  { slug: "costureira", label: "Costureira", emoji: "🧵", unit: "SERVICO", group: "Beleza e bem-estar", quick: 5000 },
  { slug: "personal", label: "Personal trainer", emoji: "🏋️", unit: "HORA", group: "Beleza e bem-estar", quick: 8000 },
  { slug: "professor", label: "Professor particular", emoji: "📚", unit: "HORA", group: "Outros", quick: 6000 },
  { slug: "garcom", label: "Garçom / garçonete", emoji: "🍽️", unit: "DIARIA", group: "Outros", quick: 13000 },
  { slug: "seguranca", label: "Vigia / segurança", emoji: "🛡️", unit: "DIARIA", group: "Outros", quick: 15000 },
  { slug: "mecanico", label: "Mecânico", emoji: "🛠️", unit: "SERVICO", group: "Outros", quick: 15000 },
  { slug: "lavador", label: "Lavador de carro", emoji: "🧽", unit: "SERVICO", group: "Outros", quick: 5000 },
  { slug: "outros", label: "Outros serviços", emoji: "✨", unit: "DIARIA", group: "Outros", quick: 12000 },
] as const satisfies readonly { slug: string; label: string; emoji: string; unit: PriceUnit; group: (typeof CATEGORY_GROUPS)[number]; quick: number }[];

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
const CAT = new Map<string, (typeof CATEGORIES)[number]>(CATEGORIES.map((c) => [c.slug, c]));
export const category = (slug: string) => CAT.get(slug) ?? null;
export const categoryLabel = (slug: string) => CAT.get(slug)?.label ?? slug;
export const isCategory = (slug: string) => CAT.has(slug);

/**
 * Como cada profissão pode cobrar. A primeira é a padrão (e a do Contrate rápido). Ex.: compras no supermercado é só
 * por serviço; pedreiro pode ser por diária ou por serviço (empreitada).
 */
const EXTRA_UNITS: Record<string, PriceUnit[]> = {
  diarista: ["HORA"], cozinheira: ["HORA"], jardineiro: ["SERVICO"], pedreiro: ["SERVICO"], servente: ["SERVICO"], pintor: ["SERVICO"],
  eletricista: ["DIARIA", "HORA"], encanador: ["DIARIA", "HORA"], carpinteiro: ["SERVICO"], gesseiro: ["SERVICO"], azulejista: ["SERVICO"],
  serralheiro: ["DIARIA"], "cuidador-idoso": ["HORA"], baba: ["HORA"], pet: ["HORA"], enfermagem: ["HORA"], motorista: ["DIARIA", "HORA"],
  chapa: ["SERVICO", "HORA"], garcom: ["HORA"], seguranca: ["HORA"], mecanico: ["HORA"], personal: ["SERVICO"], professor: ["SERVICO"], outros: ["SERVICO", "HORA"],
};
export const unitsOf = (slug: string): PriceUnit[] => {
  const c = CAT.get(slug);
  return c ? [c.unit, ...(EXTRA_UNITS[slug] ?? [])] : ["DIARIA", "HORA", "SERVICO"];
};
// ───────────── Redes sociais do perfil ─────────────

/** WhatsApp: guarda só os números com o 55 do Brasil (link wa.me). null se inválido. */
export function normalizeWhatsapp(raw: string): string | null {
  const d = raw.replace(/\D/g, "").replace(/^0+/, "");
  const local = d.replace(/^55(?=\d{10,11}$)/, "");
  return /^\d{10,11}$/.test(local) ? `55${local}` : null;
}
export const whatsappLink = (n: string) => `https://wa.me/${n}`;
export const whatsappLabel = (n: string) => n.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
/** TikTok: "@usuario" ou link → "usuario". */
export function normalizeTiktok(raw: string): string | null {
  const t = raw.trim().replace(/^https?:\/\/(www\.)?tiktok\.com\//i, "").replace(/^@/, "").replace(/[/?].*$/, "");
  if (!t) return null;
  return /^[a-zA-Z0-9._]{2,24}$/.test(t) ? t.toLowerCase() : null;
}
/** YouTube: "@canal" ou link do canal/vídeo. Guarda "@canal" ou o link. */
export function normalizeYoutube(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^@?[a-zA-Z0-9._-]{3,30}$/.test(t)) return `@${t.replace(/^@/, "")}`;
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (!/(^|\.)youtube\.com$|^youtu\.be$/i.test(u.hostname)) return null;
    return u.toString().slice(0, 200);
  } catch {
    return null;
  }
}
export const youtubeLink = (y: string) => (y.startsWith("@") ? `https://www.youtube.com/${y}` : y);

/** "R$ 180,00 / diária" */
export const priceTag = (cents: number, unit: PriceUnit) => `${formatBRL(cents)} / ${UNIT_LABEL[unit].one}`;

// ───────────── Formas de pagamento (direto ao prestador) ─────────────

export const PAY_METHODS = { PIX: "Pix", DINHEIRO: "Dinheiro", DEBITO: "Cartão de débito", CREDITO: "Cartão de crédito" } as const;
export type PayMethod = keyof typeof PAY_METHODS;
export const isPayMethod = (v: string): v is PayMethod => v in PAY_METHODS;

/**
 * Contrate rápido: valor FIXO por profissão (por diária, hora ou serviço), um pouco abaixo do mercado.
 * O admin pode trocar cada valor (ficam em `overrides`). O prestador recebe tudo: a plataforma não tira nada.
 */
export function quickPrice(slug: string, overrides: Record<string, number> = {}) {
  const c = CAT.get(slug);
  if (!c) return null;
  const o = overrides[slug];
  return Number.isInteger(o) && o >= 100 ? o : c.quick;
}

/** A hora sai mais cara que a diária dividida por 8: diária ÷ 8 × 1,5 (ex.: diária R$ 80 → hora R$ 15). */
export const HOUR_MARKUP = 1.5;
export const hourFromDaily = (dailyCents: number) => Math.ceil((dailyCents / DIARIA_HOURS) * HOUR_MARKUP / 100) * 100;

/**
 * Valor fixo da HORA no Contrate rápido. Profissões por diária: diária ÷ 8 × 1,5. Profissões cobradas por hora: o próprio
 * valor. Profissões por serviço (eletricista, frete…) não têm hora no rápido, a não ser que o admin defina.
 */
export function quickHourPrice(slug: string, overrides: Record<string, number> = {}, hourOverrides: Record<string, number> = {}) {
  const c = CAT.get(slug);
  if (!c) return null;
  const o = hourOverrides[slug];
  if (Number.isInteger(o) && o >= 100) return o;
  const base = quickPrice(slug, overrides)!;
  return c.unit === "DIARIA" ? hourFromDaily(base) : c.unit === "HORA" ? base : null;
}

/** Valor fixo do rápido para a cobrança escolhida (diária/serviço ou hora). */
export const quickUnitPrice = (slug: string, unit: PriceUnit, overrides: Record<string, number> = {}, hourOverrides: Record<string, number> = {}) => {
  const c = CAT.get(slug);
  if (!c) return null;
  return unit === "HORA" ? quickHourPrice(slug, overrides, hourOverrides) : unit === c.unit ? quickPrice(slug, overrides) : null;
};

// ───────────── Dinheiro, datas e idade ─────────────

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "120", "120,50" ou "R$ 1.200,00" → centavos (null se inválido). */
export function parseBRL(raw: string): number | null {
  const t = raw.replace(/[R$\s]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(Number(t) * 100);
}

/** Valor estimado = preço × quantidade. Pago direto ao prestador (não passa pela plataforma). */
export function estimateCents(unitPriceCents: number, quantity: number, unit: PriceUnit) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY[unit]) throw new Error(`Escolha de 1 a ${MAX_QTY[unit]} ${UNIT_LABEL[unit].many}.`);
  if (!Number.isInteger(unitPriceCents) || unitPriceCents <= 0) throw new Error("Preço inválido.");
  return unitPriceCents * quantity;
}

export const MIN_AGE = 18;
export function ageOn(birth: Date, on = new Date()) {
  let age = on.getUTCFullYear() - birth.getUTCFullYear();
  const m = on.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && on.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

export function parseDateOnly(raw: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]) ? d : null;
}

// ───────────── Vitrine e Contrate rápido ─────────────

/** `services` = perfis (profissões) com foto; `places` = endereços ativos. */
type ProLike = { status: "ACTIVE" | "SUSPENDED"; paused: boolean; blocked?: boolean; subscriptionEnd: Date | null | undefined; services: number; places: number };

/** Aparece na vitrine e recebe pedidos: conta ativa, plano (ou teste) em dia, com pelo menos um perfil com foto e um endereço. */
export function providerVisible(p: ProLike, now = new Date()) {
  return p.status === "ACTIVE" && !p.paused && !p.blocked && p.services > 0 && p.places > 0 && !!p.subscriptionEnd && p.subscriptionEnd > now;
}

/** Recebe chamados do Contrate rápido: visível, com o botão "Disponível" ligado e sem penalidade. */
export function quickEligible(p: ProLike & { quickOn: boolean; quickBannedUntil: Date | null }, now = new Date()) {
  return providerVisible(p, now) && p.quickOn && !(p.quickBannedUntil && p.quickBannedUntil > now);
}

/** Distância em km entre dois pontos (fórmula de Haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const formatKm = (km: number) => (km < 1 ? `${Math.max(100, Math.round(km * 10) * 100)} m` : `${km.toFixed(km < 10 ? 1 : 0).replace(".", ",")} km`);

/**
 * Ordem da vitrine: primeiro o plano Completo ("Recomendado"), depois o Básico. Dentro de cada grupo,
 * o mais perto do cliente; empate, o mais barato. Quem está dentro do valor do cliente vem antes.
 */
export function rankProviders<T extends { plan: Plan; distanceKm: number | null; priceCents: number }>(list: T[], maxCents?: number | null) {
  const fits = (p: T) => (maxCents ? p.priceCents <= maxCents : true);
  return [...list].sort(
    (a, b) =>
      Number(b.plan === "FULL") - Number(a.plan === "FULL") ||
      Number(fits(b)) - Number(fits(a)) ||
      (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999) ||
      a.priceCents - b.priceCents,
  );
}

/**
 * Ordem do Contrate rápido: quem está perto toca primeiro (até 5 km um pouco mais longe empata), e entre
 * os que estão perto, quem fez menos serviços rápidos na semana. Plano Completo ganha um pequeno empurrão.
 */
/** Taxa de aceite dos chamados (últimos 30 dias). Recusar ou deixar tocar sem responder conta contra. */
export const QUICK_MIN_SAMPLE = 5;
export function acceptRate(stats: { accepted: number; missed: number }) {
  const total = stats.accepted + stats.missed;
  return total < QUICK_MIN_SAMPLE ? null : stats.accepted / total; // null = poucos chamados ainda (conta como bom)
}
/** Faixa do prestador na fila: 0 = aceita bastante (ou é novo), 1 = médio, 2 = recusa muito (quase não toca). */
export function acceptTier(rate: number | null) {
  return rate == null || rate >= 0.7 ? 0 : rate >= 0.4 ? 1 : 2;
}

/**
 * Ordem do toque no Contrate rápido: primeiro quem aceita mais (quem recusa muito fica por último e quase não toca),
 * depois quem está mais perto (faixas de distância), depois a maior taxa de aceite e, por fim, a distância exata.
 */
export function rankQuick<T extends { distanceKm: number; acceptRate: number | null }>(list: T[]) {
  const band = (km: number) => (km <= 2 ? 0 : km <= 5 ? 1 : km <= 10 ? 2 : km <= 20 ? 3 : 4);
  const rate = (p: T) => p.acceptRate ?? 1;
  return [...list].sort((a, b) => acceptTier(a.acceptRate) - acceptTier(b.acceptRate) || band(a.distanceKm) - band(b.distanceKm) || rate(b) - rate(a) || a.distanceKm - b.distanceKm);
}

// ───────────── Proibido número de telefone / WhatsApp ─────────────

/**
 * A ideia é contratar pelo app: textos públicos (biografia, serviços, legendas) e o chat não podem levar
 * telefone/WhatsApp. Pega números de 10 a 13 dígitos (com espaços, pontos, traços e parênteses), celular
 * de 9 dígitos começando com 9, número escrito com palavras ("nove nove…") e "me chama no zap".
 * CEP (8 dígitos) e números de casa continuam liberados.
 */
const NUM_WORDS = "zero|um|uma|dois|duas|tres|três|quatro|cinco|seis|meia|sete|oito|nove";
export function containsPhone(text: string) {
  const t = text.normalize("NFC");
  for (const m of t.matchAll(/\+?\(?\d[\d\s().\-–]{6,}\d/g)) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) return true;
    if (digits.length === 9 && digits.startsWith("9")) return true;
  }
  if (/\b(whats\s?app|whats|zap|zapzap|wpp|wa\.me|telegram|telefone|meu\s+n[uú]mero|me\s+liga)\b/i.test(t)) return true;
  if (new RegExp(`((${NUM_WORDS})[\\s,.-]+){7,}(${NUM_WORDS})`, "i").test(t)) return true;
  return false;
}
export const PHONE_BLOCKED_MSG = "Na legenda da foto não pode ter telefone ou WhatsApp. Coloque seu WhatsApp no campo próprio do perfil.";

/** "@joao.silva", "instagram.com/joao.silva" ou "joao.silva" → "joao.silva" (null se inválido). */
export function normalizeInstagram(raw: string): string | null {
  const t = raw.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/.*$/, "");
  if (!t) return null;
  return /^[a-zA-Z0-9._]{1,30}$/.test(t) ? t.toLowerCase() : null;
}

// ───────────── Status ─────────────

export const BOOKING_LABEL: Record<BookingStatus, string> = {
  PROPOSED: "Agendado, falta o cliente confirmar",
  SEARCHING: "Procurando prestador perto de você",
  NO_PROVIDER: "Ninguém disponível agora",
  WAITING_PRO: "Aguardando resposta do prestador",
  ACCEPTED: "Aceito — contratação confirmada",
  REFUSED: "Recusado",
  EXPIRED: "Expirou sem resposta",
  ON_THE_WAY: "Prestador a caminho",
  ARRIVED: "Prestador chegou",
  STARTED: "Serviço iniciado",
  COMPLETED: "Serviço concluído",
  CANCELED_CLIENT: "Cancelado pelo cliente",
  CANCELED_PRO: "Cancelado pelo prestador",
  NO_SHOW_PRO: "Prestador não chegou a tempo",
  NO_SHOW_CLIENT: "Cliente não estava no endereço",
  IN_REVIEW: "Em análise pelo suporte",
};

export type Tone = "neutral" | "primary" | "success" | "warning" | "danger";
export const BOOKING_TONE: Record<BookingStatus, Tone> = {
  PROPOSED: "warning",
  SEARCHING: "warning",
  NO_PROVIDER: "neutral",
  WAITING_PRO: "warning",
  ACCEPTED: "success",
  REFUSED: "danger",
  EXPIRED: "neutral",
  ON_THE_WAY: "primary",
  ARRIVED: "primary",
  STARTED: "primary",
  COMPLETED: "success",
  CANCELED_CLIENT: "danger",
  CANCELED_PRO: "danger",
  NO_SHOW_PRO: "danger",
  NO_SHOW_CLIENT: "danger",
  IN_REVIEW: "warning",
};

export const ACTIVE_STATUSES: BookingStatus[] = ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "STARTED"];
export const OPEN_STATUSES: BookingStatus[] = ["PROPOSED", "SEARCHING", "WAITING_PRO"];
export const CLOSED_STATUSES: BookingStatus[] = ["NO_PROVIDER", "REFUSED", "EXPIRED", "COMPLETED", "CANCELED_CLIENT", "CANCELED_PRO", "NO_SHOW_PRO", "NO_SHOW_CLIENT"];

export type Actor = "CLIENT" | "PRO" | "ADMIN" | "SYSTEM";

const TRANSITIONS: { from: BookingStatus[]; to: BookingStatus; by: Actor[]; reason?: boolean; mode?: BookingMode }[] = [
  // Contrate rápido
  { from: ["SEARCHING"], to: "ACCEPTED", by: ["PRO"], mode: "QUICK" },
  { from: ["SEARCHING"], to: "NO_PROVIDER", by: ["SYSTEM"], mode: "QUICK" },
  { from: ["SEARCHING"], to: "CANCELED_CLIENT", by: ["CLIENT"], mode: "QUICK" },
  { from: ["ACCEPTED", "ON_THE_WAY"], to: "NO_SHOW_PRO", by: ["SYSTEM", "ADMIN"], mode: "QUICK" },
  { from: ["ARRIVED"], to: "NO_SHOW_CLIENT", by: ["PRO"], mode: "QUICK" },
  // agendamento feito pelo prestador na conversa
  { from: ["PROPOSED"], to: "ACCEPTED", by: ["CLIENT"], mode: "NORMAL" },
  { from: ["PROPOSED"], to: "CANCELED_CLIENT", by: ["CLIENT"], mode: "NORMAL" },
  { from: ["PROPOSED"], to: "CANCELED_PRO", by: ["PRO"], mode: "NORMAL" },
  { from: ["PROPOSED"], to: "EXPIRED", by: ["SYSTEM"], mode: "NORMAL" },
  // pedido normal
  { from: ["WAITING_PRO"], to: "ACCEPTED", by: ["PRO"], mode: "NORMAL" },
  { from: ["WAITING_PRO"], to: "REFUSED", by: ["PRO"], mode: "NORMAL" },
  { from: ["WAITING_PRO"], to: "EXPIRED", by: ["SYSTEM"], mode: "NORMAL" },
  { from: ["WAITING_PRO"], to: "CANCELED_CLIENT", by: ["CLIENT"], mode: "NORMAL" },
  // andamento (os dois)
  { from: ["ACCEPTED"], to: "ON_THE_WAY", by: ["PRO"] },
  { from: ["ACCEPTED", "ON_THE_WAY"], to: "ARRIVED", by: ["PRO"] },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "STARTED", by: ["PRO"] },
  { from: ["STARTED"], to: "COMPLETED", by: ["PRO", "ADMIN"] },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "CANCELED_CLIENT", by: ["CLIENT"], reason: true },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "CANCELED_PRO", by: ["PRO"], reason: true },
  { from: ["WAITING_PRO", "SEARCHING", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "STARTED", "COMPLETED", "NO_SHOW_CLIENT", "NO_SHOW_PRO"], to: "IN_REVIEW", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "ACCEPTED", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "COMPLETED", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "CANCELED_CLIENT", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "CANCELED_PRO", by: ["ADMIN"], reason: true },
];

export function transitionRule(from: BookingStatus, to: BookingStatus, by: Actor, mode: BookingMode = "NORMAL") {
  return TRANSITIONS.find((t) => t.to === to && t.from.includes(from) && t.by.includes(by) && (!t.mode || t.mode === mode)) ?? null;
}

export function nextSteps(from: BookingStatus, by: Actor, mode: BookingMode = "NORMAL") {
  return TRANSITIONS.filter(
    (t) => t.from.includes(from) && t.by.includes(by) && (!t.mode || t.mode === mode) && !(by === "PRO" && t.to === "NO_SHOW_CLIENT") && !(from === "PROPOSED" && t.to === "ACCEPTED"), // confirmar agendamento pede o endereço (formulário próprio)
  ).map((t) => ({ to: t.to, reason: !!t.reason }));
}

export const CHAT_AFTER_DAYS = 7;
export function chatOpen(b: { status: BookingStatus; acceptedAt: Date | null; completedAt: Date | null; canceledAt: Date | null }, now = new Date()) {
  if (!b.acceptedAt) return { read: false, write: false };
  if (ACTIVE_STATUSES.includes(b.status) || b.status === "IN_REVIEW") return { read: true, write: b.status !== "IN_REVIEW" };
  const end = b.completedAt ?? b.canceledAt;
  return { read: true, write: !!end && now.getTime() - end.getTime() < CHAT_AFTER_DAYS * 86_400_000 };
}

export const ADDRESS_AFTER_DAYS = 2;
export function proSeesAddress(b: { status: BookingStatus; acceptedAt: Date | null; completedAt: Date | null }, now = new Date()) {
  if (!b.acceptedAt) return false;
  if (ACTIVE_STATUSES.includes(b.status) || b.status === "IN_REVIEW") return true;
  if (b.status === "COMPLETED" && b.completedAt) return now.getTime() - b.completedAt.getTime() < ADDRESS_AFTER_DAYS * 86_400_000;
  return false;
}

export function canReview(b: { status: BookingStatus }, alreadyReviewed: boolean) {
  return b.status === "COMPLETED" && !alreadyReviewed;
}

export function ratingOf(p: { ratingSum: number; ratingCount: number }) {
  return p.ratingCount ? Math.round((p.ratingSum / p.ratingCount) * 10) / 10 : null;
}

// ───────────── Agenda ─────────────

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

/** Sem agenda definida, aceita qualquer horário. */
export function fitsAvailability(rules: { weekday: number; startMin: number; endMin: number }[], weekday: number, startMin: number, hours = 1) {
  if (!rules.length) return true;
  return rules.some((r) => r.weekday === weekday && startMin >= r.startMin && startMin + hours * 60 <= r.endMin);
}

export const minutesToHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export function hhmmToMinutes(s: string) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  return Number(m[1]) < 24 && Number(m[2]) < 60 ? Number(m[1]) * 60 + Number(m[2]) : null;
}

// ───────────── Textos ─────────────

export function shortName(name: string) {
  const p = name.trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toUpperCase()}.` : p[0];
}

export const REPORT_REASONS = ["Comportamento inadequado", "Assédio ou ameaça", "Perfil falso ou dados errados", "Pediu pagamento fora do combinado", "Não compareceu", "Foto imprópria", "Spam ou propaganda", "Outro motivo"] as const;

export const TICKET_LABEL = { OPEN: ["Aberto", "warning"], ANSWERED: ["Respondido", "success"], CLOSED: ["Encerrado", "neutral"] } as const;

export const MAX_POSTS = 8;
export const POSTS_PREVIEW = 4;
