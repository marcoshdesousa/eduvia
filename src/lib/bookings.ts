// Contratações: pedido normal (o cliente escolhe o prestador) e Contrate rápido (toca para os mais perto).
// Toda mudança de status fica no histórico (quem, quando, por quê).
import type { BookingStatus, PriceUnit } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { notify, sendPush } from "@/lib/notifications";
import { getSettings } from "@/lib/settings";
import {
  ACTIVE_STATUSES,
  acceptRate,
  quickUnitPrice,
  isQuickCategory,
  needsShoppingList,
  normalizeWhatsapp,
  ARRIVE_HOURS,
  BOOKING_LABEL,
  CLIENT_BLOCK_DAYS,
  CLIENT_NOSHOW_WAIT_MIN,
  PRO_QUICK_BAN_DAYS,
  category as categoryOf,
  categoryLabel,
  distanceKm,
  estimateCents,
  fitsAvailability,
  formatBRL,
  formatKm,
  DIARIA_HOURS,
  providerVisible,
  qtyLabel,
  rankQuick,
  transitionRule,
  type Actor,
} from "@/lib/domain";
import { formatWhen, localParts, officialCity } from "@/lib/places";
import { bbox, visibleWhere } from "@/lib/providers";
import { clientBlock } from "@/lib/subscription";
import { conversationWith } from "@/lib/chat";
import { sealSecret } from "@/lib/secret-box";
import type { Prisma } from "@/generated/prisma/client";

export class BookingError extends Error {}

const H = 3_600_000;
/** Quanto tempo um serviço ocupa (para não aceitar dois ao mesmo tempo). */
const busyHours = (unit: PriceUnit, qty: number) => (unit === "HORA" ? qty : unit === "DIARIA" ? DIARIA_HOURS * qty : 3);

export type AddressInput = { street: string; number?: string | null; complement?: string | null; district?: string | null; city: string; uf: string; cep?: string | null; reference?: string | null; lat?: number | null; lng?: number | null };

function addressData(a: AddressInput, city: string) {
  return {
    addrStreet: a.street.trim().slice(0, 200),
    addrNumber: a.number?.trim().slice(0, 20) || null,
    addrComplement: a.complement?.trim().slice(0, 100) || null,
    addrDistrict: a.district?.trim().slice(0, 100) || null,
    addrCity: city,
    addrUf: a.uf,
    addrCep: a.cep?.replace(/\D/g, "").slice(0, 8) || null,
    addrReference: a.reference?.trim().slice(0, 200) || null,
    lat: a.lat ?? null,
    lng: a.lng ?? null,
  };
}

async function checkClient(clientId: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: clientId } });
  const block = await clientBlock(user.cpfHash);
  if (block) throw new BookingError(`Sua conta está sem contratar até ${block.until.toLocaleDateString("pt-BR")} porque você não estava no endereço de um Contrate rápido. Você pode pagar a taxa de desbloqueio na sua conta.`);
  return user;
}

async function saveAddress(clientId: string, label: string | null | undefined, b: ReturnType<typeof addressData>) {
  if (!label) return;
  await db.address.create({ data: { clientId, label: label.slice(0, 40), street: b.addrStreet, number: b.addrNumber, complement: b.addrComplement, district: b.addrDistrict, city: b.addrCity, uf: b.addrUf, cep: b.addrCep, lat: b.lat, lng: b.lng } });
}

/** O prestador já tem algo nesse intervalo? (serviço confirmado, agendamento esperando o cliente ou compromisso da agenda) */
export async function slotTaken(tx: Prisma.TransactionClient | typeof db, proId: string, start: Date, end: Date) {
  const near = await tx.booking.findMany({ where: { proId, status: { in: [...ACTIVE_STATUSES, "PROPOSED"] }, scheduledAt: { lt: end, gt: new Date(start.getTime() - 9 * 30 * H) } }, select: { scheduledAt: true, unit: true, quantity: true } });
  if (near.some((b) => b.scheduledAt.getTime() + busyHours(b.unit, b.quantity) * H > start.getTime())) return true;
  return !!(await tx.agendaEntry.findFirst({ where: { proId, startsAt: { lt: end }, endsAt: { gt: start } }, select: { id: true } }));
}

// ───────────────────────── Pedido normal ─────────────────────────

export type BookingInput = {
  clientId: string;
  proId: string;
  category: string;
  quantity: number;
  scheduledAt: Date;
  notes?: string | null;
  address: AddressInput;
  saveAddressLabel?: string | null;
  payMethod?: string | null;
  /** compras no supermercado: telefone do cliente para o Pix das compras */
  contactPhone?: string | null;
  /** "HORA" para contratar por hora quem também trabalha por hora; vazio = cobrança principal do perfil */
  unit?: PriceUnit | null;
};

export async function createBooking(input: BookingInput, now = new Date()) {
  await checkClient(input.clientId);
  const city = officialCity(input.address.uf, input.address.city);
  if (!city) throw new BookingError("Município do endereço não encontrado. Confira o estado e a cidade.");
  if (!input.address.street.trim()) throw new BookingError("Informe a rua do endereço.");
  if (input.scheduledAt.getTime() < now.getTime() + H) throw new BookingError("Escolha data e horário com pelo menos 1 hora de antecedência. Para agora, use o Contrate rápido.");
  if (input.scheduledAt.getTime() > now.getTime() + 90 * 24 * H) throw new BookingError("Escolha uma data nos próximos 90 dias.");
  const pro = await db.providerProfile.findUnique({
    where: { id: input.proId },
    include: { subscription: true, availability: true, services: true, places: { where: { active: true } }, user: { select: { id: true, blockedAt: true } } },
  });
  if (!pro || !providerVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt, services: pro.services.filter((x) => x.photoKey).length, places: pro.places.length }, now)) {
    throw new BookingError("Este prestador não está recebendo pedidos agora.");
  }
  if (pro.userId === input.clientId) throw new BookingError("Você não pode contratar a si mesmo.");
  if (!pro.directBooking) throw new BookingError("Este prestador agenda pela conversa. Mande uma mensagem para combinar o dia.");
  const blocked = await db.block.findFirst({ where: { OR: [{ blockerId: pro.userId, blockedId: input.clientId }, { blockerId: input.clientId, blockedId: pro.userId }] } });
  if (blocked) throw new BookingError("Não é possível enviar pedido para este prestador.");
  const service = pro.services.find((s) => s.category === input.category);
  if (!service) throw new BookingError("Escolha um serviço que este prestador oferece.");
  const contactSealed = shoppingContact(service.category, input.notes, input.contactPhone);
  // por hora: só se o prestador também trabalha por hora (valor da hora do perfil)
  const byHour = input.unit === "HORA" && service.unit !== "HORA";
  if (byHour && !service.hourCents) throw new BookingError("Este prestador não trabalha por hora nessa profissão.");
  const unit: PriceUnit = byHour ? "HORA" : service.unit;
  const unitPrice = byHour ? service.hourCents! : service.priceCents;
  const estimate = estimateCents(unitPrice, input.quantity, unit);
  const at = localParts(input.scheduledAt, input.address.uf);
  if (!fitsAvailability(pro.availability, at.weekday, at.minutes, 1)) throw new BookingError("Esse horário está fora da agenda do prestador. Veja os horários no perfil.");
  const settings = await getSettings();
  const addr = addressData(input.address, city);
  const end = new Date(input.scheduledAt.getTime() + busyHours(unit, input.quantity) * H);
  const booking = await db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${pro.id}))`;
    if (await slotTaken(tx, pro.id, input.scheduledAt, end)) throw new BookingError("O prestador já tem um compromisso nesse horário. Escolha outro horário.");
    if ((await tx.booking.count({ where: { clientId: input.clientId, status: { in: ["WAITING_PRO", "SEARCHING"] } } })) >= 10) throw new BookingError("Você já tem 10 pedidos aguardando resposta. Espere algumas respostas.");
    return tx.booking.create({
      data: {
        mode: "NORMAL",
        clientId: input.clientId,
        proId: pro.id,
        status: "WAITING_PRO",
        category: service.category,
        unit,
        quantity: input.quantity,
        unitPriceCents: unitPrice,
        estimateCents: estimate,
        scheduledAt: input.scheduledAt,
        notes: input.notes?.trim().slice(0, 1000) || null,
        contactSealed,
        payMethod: input.payMethod || null,
        expiresAt: new Date(Math.min(now.getTime() + settings.requestExpiryHours * H, input.scheduledAt.getTime())),
        ...addr,
        history: { create: { to: "WAITING_PRO", byUserId: input.clientId } },
      },
    });
  });
  await saveAddress(input.clientId, input.saveAddressLabel, addr);
  await conversationWith(input.clientId, pro.id);
  await notify(pro.userId, {
    title: `Novo pedido: ${categoryLabel(service.category)}`,
    body: `${qtyLabel(service.unit, input.quantity)} em ${city} — ${formatWhen(input.scheduledAt, input.address.uf)}. Aceite ou recuse.`,
    href: `/pedidos/${booking.id}`,
  });
  return booking;
}

/**
 * Compras no supermercado: precisa da lista completa e do telefone do cliente (para o Pix das compras).
 * Devolve o telefone criptografado (ou null nas outras profissões).
 */
export function shoppingContact(category: string, notes: string | null | undefined, phone: string | null | undefined) {
  if (!needsShoppingList(category)) return null;
  if ((notes ?? "").trim().length < 15) throw new BookingError("Escreva a lista de compras completa (o que comprar e quantidade).");
  const n = normalizeWhatsapp(phone ?? "");
  if (!n) throw new BookingError("Informe seu telefone com DDD para o prestador pedir o Pix das compras.");
  return sealSecret(n);
}

// ───────────────────────── Contrate rápido ─────────────────────────

export type QuickInput = { clientId: string; category: string; quantity: number; unit?: PriceUnit | null; notes: string; contactPhone?: string | null; address: AddressInput & { lat: number; lng: number }; saveAddressLabel?: string | null; payMethod?: string | null };

/** Cria o chamado e já toca para a primeira rodada de prestadores perto. */
export async function createQuick(input: QuickInput, now = new Date()) {
  await checkClient(input.clientId);
  const cat = categoryOf(input.category);
  if (!cat) throw new BookingError("Escolha o serviço.");
  if (!isQuickCategory(cat.slug)) throw new BookingError("Essa profissão não tem Contrate rápido. Escolha um prestador pela vitrine.");
  const city = officialCity(input.address.uf, input.address.city);
  if (!city) throw new BookingError("Não reconhecemos o município. Confira o estado e a cidade.");
  if (!input.address.street.trim()) throw new BookingError("Informe a rua (o prestador só vê depois de aceitar).");
  if (!Number.isFinite(input.address.lat) || !Number.isFinite(input.address.lng)) throw new BookingError("Precisamos da sua localização no mapa para achar quem está perto.");
  const notes = input.notes?.trim().slice(0, 1000) ?? "";
  if (notes.length < 10) throw new BookingError("Descreva o serviço que você precisa (pelo menos uma frase). O prestador lê antes de aceitar.");
  const contactSealed = shoppingContact(cat.slug, notes, input.contactPhone);
  const settings = await getSettings();
  // diária(s)/serviço pelo valor fixo, ou hora(s) pelo valor fixo da hora (só toca para quem trabalha por hora)
  const unit: PriceUnit = input.unit === "HORA" ? "HORA" : cat.unit;
  const unitPrice = quickUnitPrice(cat.slug, unit, settings.quickPrices, settings.quickHourPrices);
  if (unitPrice == null) throw new BookingError("Essa profissão não tem contratação por hora no rápido.");
  const total = estimateCents(unitPrice, input.quantity, unit); // também confere a quantidade
  if ((await db.booking.count({ where: { clientId: input.clientId, mode: "QUICK", status: "SEARCHING" } })) >= 1) throw new BookingError("Você já tem um Contrate rápido procurando prestador. Espere ou cancele o anterior.");
  const addr = addressData(input.address, city);
  const booking = await db.booking.create({
    data: {
      mode: "QUICK",
      clientId: input.clientId,
      status: "SEARCHING",
      category: cat.slug,
      unit,
      quantity: input.quantity,
      // valor fixo da profissão (não muda com o prestador que aceitar)
      unitPriceCents: unitPrice,
      estimateCents: total,
      maxCents: total,
      scheduledAt: now,
      notes,
      contactSealed,
      payMethod: input.payMethod || null,
      ...addr,
      history: { create: { to: "SEARCHING", byUserId: input.clientId } },
    },
  });
  await saveAddress(input.clientId, input.saveAddressLabel, addr);
  await dispatchQuick(booking.id, now);
  return booking;
}

/** Taxa de aceite de cada prestador nos chamados dos últimos 30 dias (recusou ou deixou tocar sem responder = perdeu). */
export async function quickStats(proIds: string[], now = new Date()) {
  const rows = await db.quickOffer.groupBy({ by: ["proId", "state"], where: { proId: { in: proIds }, sentAt: { gt: new Date(now.getTime() - 30 * 24 * H) }, state: { in: ["ACCEPTED", "DECLINED", "EXPIRED"] } }, _count: true });
  const out = new Map<string, { accepted: number; missed: number }>();
  for (const r of rows) {
    const cur = out.get(r.proId) ?? { accepted: 0, missed: 0 };
    if (r.state === "ACCEPTED") cur.accepted += r._count;
    else cur.missed += r._count;
    out.set(r.proId, cur);
  }
  return out;
}

/**
 * Quem pode receber este chamado agora, já na ordem do toque. Só entra quem está no plano Completo em dia, aceitou as
 * regras do Contrate rápido (caixinha), ligou o Disponível, oferece o serviço, está no horário e não está em outro chamado.
 */
export async function quickCandidates(b: { id: string; clientId: string; category: string; unit: PriceUnit; quantity: number; estimateCents: number | null; lat: number | null; lng: number | null; addrUf: string }, now = new Date()) {
  if (b.lat == null || b.lng == null) return [];
  const settings = await getSettings();
  const point = { lat: b.lat, lng: b.lng };
  const rows = await db.providerProfile.findMany({
    where: {
      ...visibleWhere(now),
      quickOn: true,
      quickTermsAt: { not: null },
      subscription: { plan: "FULL", currentPeriodEnd: { gt: now } },
      OR: [{ quickBannedUntil: null }, { quickBannedUntil: { lt: now } }],
      userId: { not: b.clientId },
      // por hora: só quem também trabalha por hora nessa profissão
      services: { some: { category: b.category, photoKey: { not: null }, ...(b.unit === "HORA" ? { OR: [{ unit: "HORA" }, { hourCents: { not: null } }] } : {}) } },
      places: { some: { active: true, ...bbox(point, settings.quickMaxKm) } },
      offers: { none: { bookingId: b.id } },
      NOT: { user: { OR: [{ blocks: { some: { blockedId: b.clientId } } }, { blockedBy: { some: { blockerId: b.clientId } } }] } },
    },
    include: { places: { where: { active: true } }, availability: true },
    take: 200,
  });
  const at = localParts(now, b.addrUf);
  const stats = await quickStats(rows.map((r) => r.id), now);
  // quem está em outro chamado rápido não toca; terminou o serviço, volta a tocar
  const busy = new Set(
    (await db.booking.findMany({ where: { proId: { in: rows.map((r) => r.id) }, mode: "QUICK", status: { in: ACTIVE_STATUSES } }, select: { proId: true } })).map((x) => x.proId),
  );
  for (const e of await db.agendaEntry.findMany({ where: { proId: { in: rows.map((r) => r.id) }, startsAt: { lt: new Date(now.getTime() + ARRIVE_HOURS * H) }, endsAt: { gt: now } }, select: { proId: true } })) busy.add(e.proId);
  const list = rows
    .filter((p) => !busy.has(p.id) && fitsAvailability(p.availability, at.weekday, at.minutes, 1))
    .map((p) => ({
      id: p.id,
      userId: p.userId,
      priceCents: b.estimateCents ?? 0,
      distanceKm: Math.min(...p.places.map((pl) => distanceKm(point, pl))),
      acceptRate: acceptRate(stats.get(p.id) ?? { accepted: 0, missed: 0 }),
    }))
    .filter((p) => p.distanceKm <= settings.quickMaxKm);
  return rankQuick(list);
}

/** Toca a próxima rodada (se ninguém está tocando agora). Sem ninguém e sem tempo, avisa o cliente. */
export async function dispatchQuick(bookingId: string, now = new Date()) {
  const b = await db.booking.findUnique({ where: { id: bookingId } });
  if (!b || b.status !== "SEARCHING") return 0;
  const settings = await getSettings();
  await db.quickOffer.updateMany({ where: { bookingId, state: "PENDING", expiresAt: { lt: now } }, data: { state: "EXPIRED" } });
  if (await db.quickOffer.count({ where: { bookingId, state: "PENDING" } })) return 0;
  const wave = (await db.quickOffer.aggregate({ where: { bookingId }, _max: { wave: true } }))._max.wave ?? 0;
  if (now.getTime() - b.createdAt.getTime() > settings.quickSearchMinutes * 60_000) {
    await changeStatus(b.id, "NO_PROVIDER", { id: null, as: "SYSTEM" }, null, now).catch(() => {});
    return 0;
  }
  // sem ninguém agora: continua procurando (alguém pode ficar Disponível) até o tempo acabar
  const next = (await quickCandidates(b, now)).slice(0, settings.quickWaveSize);
  if (!next.length) return 0;
  const expiresAt = new Date(now.getTime() + settings.quickRingSeconds * 1000);
  for (const p of next) {
    await db.quickOffer.create({ data: { bookingId, proId: p.id, wave: wave + 1, distanceKm: p.distanceKm, priceCents: p.priceCents, expiresAt } }).catch(() => {});
    // toque: push com vibração forte (o app aberto toca o som de chamado)
    void sendPush(p.userId, {
      title: `🔔 Chamado: ${categoryLabel(b.category)}`,
      body: `${formatKm(p.distanceKm)} de você · ${qtyLabel(b.unit, b.quantity)} · ${formatBRL(p.priceCents)}. Toque para aceitar.`,
      href: "/painel?chamado=1",
      kind: "quick",
    }).catch(() => {});
  }
  return next.length;
}

/** O prestador aceita o chamado: o primeiro que aceitar leva. Tem 2 horas para chegar. */
export async function acceptOffer(offerId: string, proUserId: string, now = new Date()) {
  const offer = await db.quickOffer.findUnique({ where: { id: offerId }, include: { pro: true, booking: true } });
  if (!offer || offer.pro.userId !== proUserId) throw new BookingError("Chamado não encontrado.");
  if (offer.state !== "PENDING" || offer.expiresAt < now) throw new BookingError("Este chamado já passou.");
  if (offer.pro.quickBannedUntil && offer.pro.quickBannedUntil > now) throw new BookingError("Você está fora do Contrate rápido por enquanto.");
  const unitPrice = Math.round(offer.priceCents / offer.booking.quantity);
  const won = await db.$transaction(async (tx) => {
    const r = await tx.booking.updateMany({
      where: { id: offer.bookingId, status: "SEARCHING" },
      data: { status: "ACCEPTED", proId: offer.proId, acceptedAt: now, arriveBy: new Date(now.getTime() + ARRIVE_HOURS * H), unitPriceCents: unitPrice, estimateCents: offer.priceCents },
    });
    if (!r.count) return false;
    await tx.quickOffer.update({ where: { id: offer.id }, data: { state: "ACCEPTED", respondedAt: now } });
    await tx.quickOffer.updateMany({ where: { bookingId: offer.bookingId, id: { not: offer.id }, state: "PENDING" }, data: { state: "LOST" } });
    await tx.bookingStatusHistory.create({ data: { bookingId: offer.bookingId, from: "SEARCHING", to: "ACCEPTED", byUserId: proUserId } });
    return true;
  });
  if (!won) {
    await db.quickOffer.update({ where: { id: offer.id }, data: { state: "LOST", respondedAt: now } }).catch(() => {});
    throw new BookingError("Outro prestador aceitou primeiro. Fica para a próxima!");
  }
  const pro = await db.user.findUniqueOrThrow({ where: { id: proUserId }, select: { name: true } });
  await conversationWith(offer.booking.clientId, offer.proId);
  await notify(offer.booking.clientId, {
    title: `${pro.name.split(" ")[0]} aceitou seu chamado! 🎉`,
    body: `Chega em até ${ARRIVE_HOURS} horas. Converse pelo chat.`,
    href: `/pedidos/${offer.bookingId}`,
    dedupeKey: `aceito:${offer.bookingId}`,
  });
  return offer.bookingId;
}

export async function declineOffer(offerId: string, proUserId: string, now = new Date()) {
  const offer = await db.quickOffer.findUnique({ where: { id: offerId }, include: { pro: { select: { userId: true } } } });
  if (!offer || offer.pro.userId !== proUserId) return;
  await db.quickOffer.updateMany({ where: { id: offerId, state: "PENDING" }, data: { state: "DECLINED", respondedAt: now } });
  await dispatchQuick(offer.bookingId, now); // chama o próximo na hora
}

/** "Cliente não estava": só no Contrate rápido, depois de chegar e esperar 15 minutos. Cliente fica 30 dias sem contratar (ou paga R$ 2,85). */
export async function clientNoShow(bookingId: string, proUserId: string, now = new Date()) {
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: true, client: true } });
  if (!b || b.pro?.userId !== proUserId) throw new BookingError("Contratação não encontrada.");
  if (b.mode !== "QUICK" || b.status !== "ARRIVED" || !b.arrivedAt) throw new BookingError("Primeiro marque que você chegou.");
  const waited = (now.getTime() - b.arrivedAt.getTime()) / 60_000;
  if (waited < CLIENT_NOSHOW_WAIT_MIN) throw new BookingError(`Espere pelo menos ${CLIENT_NOSHOW_WAIT_MIN} minutos no endereço (faltam ${Math.ceil(CLIENT_NOSHOW_WAIT_MIN - waited)}). Tente falar com o cliente pelo chat.`);
  await changeStatus(b.id, "NO_SHOW_CLIENT", { id: proUserId, as: "PRO" }, "O prestador chegou e o cliente não estava no endereço.", now);
  const until = new Date(now.getTime() + CLIENT_BLOCK_DAYS * 24 * H);
  await db.cpfLedger.upsert({
    where: { cpfHash: b.client.cpfHash },
    create: { cpfHash: b.client.cpfHash, clientBlockedUntil: until, clientBlockReason: `Não estava no endereço (pedido ${b.id.slice(-6)})` },
    update: { clientBlockedUntil: until, clientBlockReason: `Não estava no endereço (pedido ${b.id.slice(-6)})` },
  });
  await notify(b.clientId, {
    title: "Você não estava no endereço",
    body: `O prestador foi até o local do Contrate rápido. Sua conta fica ${CLIENT_BLOCK_DAYS} dias sem contratar, ou pague R$ 2,85 para liberar agora.`,
    href: "/desbloquear",
  });
}

// ───────────────────────── Status ─────────────────────────

export function roleIn(b: { clientId: string; pro: { userId: string } | null }, user: { id: string; role: string }): Actor | null {
  if (user.role === "ADMIN") return "ADMIN";
  if (b.clientId === user.id) return "CLIENT";
  if (b.pro?.userId === user.id) return "PRO";
  return null;
}

const STAMP: Partial<Record<BookingStatus, "acceptedAt" | "arrivedAt" | "completedAt" | "canceledAt">> = {
  ACCEPTED: "acceptedAt",
  ARRIVED: "arrivedAt",
  COMPLETED: "completedAt",
  CANCELED_CLIENT: "canceledAt",
  CANCELED_PRO: "canceledAt",
  NO_SHOW_PRO: "canceledAt",
  NO_SHOW_CLIENT: "canceledAt",
  NO_PROVIDER: "canceledAt",
};

export async function changeStatus(bookingId: string, to: BookingStatus, actor: { id: string | null; as: Actor }, reason?: string | null, now = new Date(), extra?: { finalCents?: number | null }) {
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true, id: true } } } });
  if (!b) throw new BookingError("Contratação não encontrada.");
  const rule = transitionRule(b.status, to, actor.as, b.mode);
  if (!rule) throw new BookingError(`Não é possível passar de "${BOOKING_LABEL[b.status]}" para "${BOOKING_LABEL[to]}".`);
  const why = reason?.trim().slice(0, 500) || null;
  if (rule.reason && !why) throw new BookingError("Informe o motivo.");
  if (to === "ACCEPTED" && actor.as === "PRO" && b.mode === "NORMAL" && b.expiresAt && b.expiresAt < now) throw new BookingError("Este pedido já expirou.");
  const stamp = STAMP[to];
  const updated = await db.booking.updateMany({
    where: { id: b.id, status: b.status },
    data: {
      status: to,
      ...(stamp ? { [stamp]: now } : {}),
      ...(to.startsWith("CANCELED") || to.startsWith("NO_SHOW") ? { cancelReason: why } : {}),
      ...(to === "COMPLETED" ? { finalCents: extra?.finalCents ?? b.estimateCents } : {}),
    },
  });
  if (!updated.count) throw new BookingError("O pedido acabou de mudar. Atualize a tela.");
  await db.bookingStatusHistory.create({ data: { bookingId: b.id, from: b.status, to, byUserId: actor.id, reason: why } });
  if (to === "COMPLETED" && b.proId) await db.providerProfile.update({ where: { id: b.proId }, data: { completedCount: { increment: 1 } } });
  if (b.status === "SEARCHING") await db.quickOffer.updateMany({ where: { bookingId: b.id, state: "PENDING" }, data: { state: "LOST" } });

  const href = `/pedidos/${b.id}`;
  const body = why ? `${BOOKING_LABEL[to]}. Motivo: ${why}` : BOOKING_LABEL[to];
  if (actor.as !== "CLIENT") await notify(b.clientId, { title: titleFor(to, "CLIENT"), body, href, dedupeKey: `st:${b.id}:${to}:c` });
  if (actor.as !== "PRO" && b.pro) await notify(b.pro.userId, { title: titleFor(to, "PRO"), body, href, dedupeKey: `st:${b.id}:${to}:p` });
  if (to === "COMPLETED" && b.pro) {
    await notify(b.clientId, { title: "Como foi o serviço?", body: "Avalie o prestador (de 1 a 5 estrelas).", href, dedupeKey: `av:${b.id}:c` });
    await notify(b.pro.userId, { title: "Avalie o cliente", body: "Conte como foi a experiência.", href, dedupeKey: `av:${b.id}:p` });
  }
  return to;
}

function titleFor(to: BookingStatus, who: "CLIENT" | "PRO") {
  const t: Partial<Record<BookingStatus, string>> = {
    ACCEPTED: who === "CLIENT" ? "Pedido aceito! 🎉" : "Contratação confirmada",
    REFUSED: "Pedido recusado",
    EXPIRED: "Pedido expirado",
    NO_PROVIDER: "Ninguém aceitou o chamado",
    ON_THE_WAY: "Prestador a caminho 🚗",
    ARRIVED: "Prestador chegou",
    STARTED: "Serviço iniciado",
    COMPLETED: "Serviço concluído ✅",
    NO_SHOW_PRO: who === "PRO" ? "Você não chegou a tempo" : "O prestador não chegou a tempo",
    NO_SHOW_CLIENT: "Cliente não estava no endereço",
  };
  return t[to] ?? (to.startsWith("CANCELED") ? "Contratação cancelada" : "Contratação em análise");
}

// ───────────────────────── Rotinas ─────────────────────────

/** A cada poucos segundos: toca as próximas rodadas e cancela quem não chegou em 2 horas (7 dias fora do Contrate rápido). */
export async function quickSweep(now = new Date()) {
  const searching = await db.booking.findMany({ where: { mode: "QUICK", status: "SEARCHING" }, select: { id: true }, take: 100 });
  for (const b of searching) await dispatchQuick(b.id, now).catch((e) => console.error("[rápido] rodada", e));
  const late = await db.booking.findMany({ where: { mode: "QUICK", status: { in: ["ACCEPTED", "ON_THE_WAY"] }, arriveBy: { lt: now } }, include: { pro: true }, take: 100 });
  for (const b of late) {
    try {
      await changeStatus(b.id, "NO_SHOW_PRO", { id: null, as: "SYSTEM" }, `Não chegou em ${ARRIVE_HOURS} horas depois de aceitar.`, now);
      if (b.pro) {
        await db.providerProfile.update({ where: { id: b.pro.id }, data: { quickBannedUntil: new Date(now.getTime() + PRO_QUICK_BAN_DAYS * 24 * H), quickOn: false } });
        await notify(b.pro.userId, { title: "7 dias fora do Contrate rápido", body: `Você aceitou um chamado e não chegou em ${ARRIVE_HOURS} horas. Seu perfil continua na vitrine normal.`, href: "/painel" });
      }
    } catch (e) {
      console.error("[rápido] atraso", e);
    }
  }
}

export async function expireSweep(now = new Date()) {
  const late = await db.booking.findMany({ where: { mode: "NORMAL", status: { in: ["WAITING_PRO", "PROPOSED"] }, expiresAt: { lt: now } }, select: { id: true }, take: 200 });
  for (const b of late) await changeStatus(b.id, "EXPIRED", { id: null, as: "SYSTEM" }, null, now).catch(() => {});
  return late.length;
}

export async function reminderSweep(now = new Date()) {
  const soon = await db.booking.findMany({ where: { mode: "NORMAL", status: "ACCEPTED", scheduledAt: { gt: now, lt: new Date(now.getTime() + 25 * H) } }, include: { pro: { select: { userId: true } } } });
  for (const b of soon) {
    const tag = (b.scheduledAt.getTime() - now.getTime()) / H <= 2.5 ? "2h" : "24h";
    const body = `${categoryLabel(b.category)} ${formatWhen(b.scheduledAt, b.addrUf)} em ${b.addrCity}.`;
    for (const userId of [b.clientId, b.pro?.userId].filter(Boolean) as string[]) await notify(userId, { title: "Lembrete: serviço próximo", body, href: `/pedidos/${b.id}`, dedupeKey: `lembrete:${b.id}:${tag}:${userId}` });
  }
}

/** Lembrete dos compromissos da agenda do prestador (1 hora antes). */
export async function agendaReminderSweep(now = new Date()) {
  const soon = await db.agendaEntry.findMany({ where: { startsAt: { gt: now, lt: new Date(now.getTime() + 65 * 60_000) } }, include: { pro: { select: { userId: true } } }, take: 500 });
  for (const e of soon) {
    await notify(e.pro.userId, { title: `Lembrete: ${e.title}`, body: `Às ${e.startsAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}.`, href: "/painel/agenda", dedupeKey: `agenda:${e.id}` });
  }
}

// ───────────────────────── Agendamento pela conversa ─────────────────────────

export type ProposeInput = { category: string; unit: PriceUnit; quantity: number; scheduledAt: Date; priceCents: number; notes?: string | null };

/** O prestador marca o dia na conversa: o horário fica reservado e o cliente confirma informando o endereço. */
export async function proposeSchedule(conversationId: string, proUserId: string, input: ProposeInput, now = new Date()) {
  const conv = await db.conversation.findUnique({ where: { id: conversationId }, include: { pro: { include: { places: { where: { active: true }, take: 1 }, services: true } } } });
  if (!conv || conv.pro.userId !== proUserId) throw new BookingError("Conversa não encontrada.");
  const svc = conv.pro.services.find((x) => x.category === input.category);
  if (!svc) throw new BookingError("Escolha um serviço que você oferece.");
  if (input.scheduledAt.getTime() < now.getTime() + 30 * 60_000) throw new BookingError("Escolha um horário com pelo menos 30 minutos de antecedência.");
  if (input.scheduledAt.getTime() > now.getTime() + 120 * 24 * H) throw new BookingError("Escolha uma data nos próximos 4 meses.");
  if (!Number.isInteger(input.priceCents) || input.priceCents < 500 || input.priceCents > 500_000) throw new BookingError("Confira o valor (de R$ 5,00 a R$ 5.000,00).");
  const total = estimateCents(input.priceCents, input.quantity, input.unit);
  const notes = input.notes?.trim().slice(0, 600) || null;
  const place = conv.pro.places[0];
  const end = new Date(input.scheduledAt.getTime() + busyHours(input.unit, input.quantity) * H);
  const booking = await db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${conv.pro.id}))`;
    if (await slotTaken(tx, conv.pro.id, input.scheduledAt, end)) throw new BookingError("Você já tem um compromisso nesse horário.");
    const b = await tx.booking.create({
      data: {
        mode: "NORMAL",
        clientId: conv.clientId,
        proId: conv.pro.id,
        status: "PROPOSED",
        category: input.category,
        unit: input.unit,
        quantity: input.quantity,
        unitPriceCents: input.priceCents,
        estimateCents: total,
        scheduledAt: input.scheduledAt,
        expiresAt: input.scheduledAt,
        notes,
        addrStreet: "(o cliente informa ao confirmar)",
        addrCity: place?.city ?? "",
        addrUf: place?.uf ?? "SP",
        history: { create: { to: "PROPOSED", byUserId: proUserId } },
      },
    });
    await tx.message.create({ data: { conversationId, senderId: proUserId, kind: "SCHEDULE", bookingId: b.id, text: notes } });
    await tx.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: now } });
    return b;
  });
  await notify(conv.clientId, {
    title: "📅 Agendamento para você confirmar",
    body: `${categoryLabel(input.category)} ${formatWhen(input.scheduledAt, booking.addrUf)} · ${formatBRL(total)}. Confirme com o endereço.`,
    href: `/pedidos/${booking.id}`,
  });
  return booking;
}

/** O cliente confirma o agendamento informando o endereço. */
export async function confirmSchedule(bookingId: string, clientId: string, address: AddressInput, opts: { saveAddressLabel?: string | null; payMethod?: string | null; contactPhone?: string | null } = {}, now = new Date()) {
  await checkClient(clientId);
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true } } } });
  if (!b || b.clientId !== clientId || b.status !== "PROPOSED") throw new BookingError("Este agendamento não está mais esperando confirmação.");
  if (b.scheduledAt < now) throw new BookingError("Este horário já passou. Peça outro ao prestador pela conversa.");
  const city = officialCity(address.uf, address.city);
  if (!city) throw new BookingError("Município do endereço não encontrado. Confira o estado e a cidade.");
  if (!address.street.trim()) throw new BookingError("Informe a rua do endereço.");
  const addr = addressData(address, city);
  // compras: a lista foi combinada na conversa (ou na anotação); só falta o telefone para o Pix
  const contactSealed = shoppingContact(b.category, b.notes ?? "lista combinada na conversa", opts.contactPhone);
  const r = await db.booking.updateMany({ where: { id: b.id, status: "PROPOSED" }, data: { ...addr, status: "ACCEPTED", acceptedAt: now, expiresAt: null, payMethod: opts.payMethod || null, contactSealed } });
  if (!r.count) throw new BookingError("O agendamento acabou de mudar. Atualize a tela.");
  await db.bookingStatusHistory.create({ data: { bookingId: b.id, from: "PROPOSED", to: "ACCEPTED", byUserId: clientId } });
  await saveAddress(clientId, opts.saveAddressLabel, addr);
  if (b.pro) await notify(b.pro.userId, { title: "Agendamento confirmado ✅", body: `${categoryLabel(b.category)} ${formatWhen(b.scheduledAt, addr.addrUf)} em ${city}.`, href: `/pedidos/${b.id}` });
}

export const ADDRESS_RETENTION_DAYS = 90;
export async function purgeAddresses(now = new Date()) {
  const before = new Date(now.getTime() - ADDRESS_RETENTION_DAYS * 24 * H);
  const r = await db.booking.updateMany({
    where: { addressPurgedAt: null, status: { in: ["COMPLETED", "CANCELED_CLIENT", "CANCELED_PRO", "REFUSED", "EXPIRED", "NO_PROVIDER", "NO_SHOW_PRO", "NO_SHOW_CLIENT"] }, updatedAt: { lt: before } },
    data: { addrStreet: "(endereço removido)", addrNumber: null, addrComplement: null, addrDistrict: null, addrCep: null, addrReference: null, lat: null, lng: null, proLat: null, proLng: null, proPosAt: null, contactSealed: null, addressPurgedAt: now },
  });
  return r.count;
}
