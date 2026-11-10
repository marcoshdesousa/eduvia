// Solicitações e contratações: criação, mudanças de status (sempre com histórico) e permissões.
import type { BookingStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { getSettings } from "@/lib/settings";
import { BOOKING_LABEL, ACTIVE_STATUSES, estimateCents, fitsAvailability, isService, proVisible, transitionRule, type Actor } from "@/lib/domain";
import { localParts, officialCity, formatWhen } from "@/lib/places";

export class BookingError extends Error {}

export type BookingInput = {
  clientId: string;
  proId: string;
  services: string[];
  hours: number;
  scheduledAt: Date;
  notes?: string | null;
  homeSize?: string | null;
  rooms?: number | null;
  address: { street: string; number?: string | null; complement?: string | null; district?: string | null; city: string; uf: string; cep?: string | null; reference?: string | null; lat?: number | null; lng?: number | null };
  saveAddressLabel?: string | null;
  /** forma de pagamento que o cliente pretende usar (só registro; a HoraLimp não processa) */
  payMethod?: "PIX" | "CASH" | null;
};

/** Cria a solicitação (aguardando o profissional). Nada é cobrado do cliente. */
export async function createBooking(input: BookingInput, now = new Date()) {
  const services = [...new Set(input.services)].filter(isService);
  if (!services.length) throw new BookingError("Escolha pelo menos um serviço.");
  const city = officialCity(input.address.uf, input.address.city);
  if (!city) throw new BookingError("Município do endereço não encontrado. Confira o estado e a cidade.");
  if (!input.address.street.trim()) throw new BookingError("Informe a rua do endereço.");
  if (input.scheduledAt.getTime() < now.getTime() + 60 * 60_000) throw new BookingError("Escolha data e horário com pelo menos 1 hora de antecedência.");
  if (input.scheduledAt.getTime() > now.getTime() + 90 * 86_400_000) throw new BookingError("Escolha uma data nos próximos 90 dias.");

  const pro = await db.professionalProfile.findUnique({
    where: { id: input.proId },
    include: { subscription: true, availability: true, areas: true, user: { select: { blockedAt: true } } },
  });
  if (!pro || !proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd, blocked: !!pro.user.blockedAt }, now)) {
    throw new BookingError("Este profissional não está recebendo solicitações agora.");
  }
  const blocked = await db.block.findFirst({ where: { OR: [{ blockerId: pro.userId, blockedId: input.clientId }, { blockerId: input.clientId, blockedId: pro.userId }] } });
  if (blocked) throw new BookingError("Não é possível enviar solicitação para este profissional.");
  if (!pro.areas.some((a) => a.uf === input.address.uf && a.city === city)) {
    throw new BookingError(`Este profissional não atende em ${city}/${input.address.uf}.`);
  }
  const unknownServices = services.filter((s) => !pro.services.includes(s));
  if (unknownServices.length) throw new BookingError("Escolha só serviços que este profissional oferece.");
  const estimate = estimateCents(pro.hourlyCents!, input.hours);
  const at = localParts(input.scheduledAt, input.address.uf);
  if (!fitsAvailability(pro.availability, at.weekday, at.minutes, input.hours)) {
    throw new BookingError("Esse horário está fora da agenda do profissional. Veja os horários de atendimento no perfil.");
  }

  const settings = await getSettings();
  const end = new Date(input.scheduledAt.getTime() + input.hours * 3_600_000);
  const booking = await db.$transaction(async (tx) => {
    // trava curta por profissional: duas solicitações ao mesmo tempo não passam juntas pelo conflito de horário
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${pro.id}))`;
    const conflicts = await tx.booking.findMany({
      where: { proId: pro.id, status: { in: ACTIVE_STATUSES }, scheduledAt: { lt: end, gt: new Date(input.scheduledAt.getTime() - 12 * 3_600_000) } },
      select: { scheduledAt: true, hours: true },
    });
    if (conflicts.some((c) => c.scheduledAt.getTime() + c.hours * 3_600_000 > input.scheduledAt.getTime())) {
      throw new BookingError("O profissional já tem uma contratação confirmada nesse horário. Escolha outro horário.");
    }
    const mine = await tx.booking.count({ where: { clientId: input.clientId, status: "WAITING_PRO" } });
    if (mine >= 10) throw new BookingError("Você já tem 10 solicitações aguardando resposta. Espere algumas respostas antes de enviar outras.");
    const b = await tx.booking.create({
      data: {
        clientId: input.clientId,
        proId: pro.id,
        status: "WAITING_PRO",
        services,
        hours: input.hours,
        scheduledAt: input.scheduledAt,
        hourlyCents: pro.hourlyCents!,
        estimateCents: estimate,
        notes: input.notes?.trim().slice(0, 1000) || null,
        homeSize: input.homeSize || null,
        rooms: input.rooms ?? null,
        addrStreet: input.address.street.trim().slice(0, 200),
        addrNumber: input.address.number?.trim().slice(0, 20) || null,
        addrComplement: input.address.complement?.trim().slice(0, 100) || null,
        addrDistrict: input.address.district?.trim().slice(0, 100) || null,
        addrCity: city,
        addrUf: input.address.uf,
        addrCep: input.address.cep?.replace(/\D/g, "").slice(0, 8) || null,
        addrReference: input.address.reference?.trim().slice(0, 200) || null,
        lat: input.address.lat ?? null,
        lng: input.address.lng ?? null,
        payMethod: input.payMethod ?? null,
        expiresAt: new Date(Math.min(now.getTime() + settings.requestExpiryHours * 3_600_000, input.scheduledAt.getTime())),
        history: { create: { to: "WAITING_PRO", byUserId: input.clientId } },
      },
    });
    if (input.saveAddressLabel) {
      await tx.address.create({
        data: {
          clientId: input.clientId,
          label: input.saveAddressLabel.slice(0, 40),
          street: b.addrStreet,
          number: b.addrNumber,
          complement: b.addrComplement,
          district: b.addrDistrict,
          city: b.addrCity,
          uf: b.addrUf,
          cep: b.addrCep,
          lat: b.lat,
          lng: b.lng,
        },
      });
    }
    return b;
  });
  // o aviso não mostra o endereço (só a cidade)
  await notify(pro.userId, {
    title: "Nova solicitação de limpeza",
    body: `${input.hours} h em ${city}/${input.address.uf} — ${formatWhen(input.scheduledAt, input.address.uf)}. Aceite ou recuse.`,
    href: `/pedidos/${booking.id}`,
  });
  return booking;
}

/** Papel da pessoa nesta contratação (ou null se não participa). */
export function roleIn(b: { clientId: string; pro: { userId: string } }, user: { id: string; role: string }): Actor | null {
  if (user.role === "ADMIN") return "ADMIN";
  if (b.clientId === user.id) return "CLIENT";
  if (b.pro.userId === user.id) return "PRO";
  return null;
}

const STAMP: Partial<Record<BookingStatus, "acceptedAt" | "completedAt" | "canceledAt">> = {
  ACCEPTED: "acceptedAt",
  COMPLETED: "completedAt",
  CANCELED_CLIENT: "canceledAt",
  CANCELED_PRO: "canceledAt",
};

/** Muda o status conferindo quem pode, registrando quem, quando e por quê; avisa a outra parte. */
export async function changeStatus(bookingId: string, to: BookingStatus, actor: { id: string | null; as: Actor }, reason?: string | null, now = new Date()) {
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true, id: true } } } });
  if (!b) throw new BookingError("Contratação não encontrada.");
  const rule = transitionRule(b.status, to, actor.as);
  if (!rule) throw new BookingError(`Não é possível passar de "${BOOKING_LABEL[b.status]}" para "${BOOKING_LABEL[to]}".`);
  const why = reason?.trim().slice(0, 500) || null;
  if (rule.reason && !why) throw new BookingError("Informe o motivo.");
  if (to === "ACCEPTED" && actor.as === "PRO") {
    if (b.expiresAt && b.expiresAt < now) throw new BookingError("Esta solicitação já expirou.");
    const clash = await db.booking.findFirst({
      where: { proId: b.proId, id: { not: b.id }, status: { in: ACTIVE_STATUSES }, scheduledAt: { lt: new Date(b.scheduledAt.getTime() + b.hours * 3_600_000), gt: new Date(b.scheduledAt.getTime() - 12 * 3_600_000) } },
    });
    if (clash && clash.scheduledAt.getTime() + clash.hours * 3_600_000 > b.scheduledAt.getTime()) throw new BookingError("Você já tem uma contratação confirmada nesse horário.");
  }
  const stamp = STAMP[to];
  const updated = await db.booking.updateMany({
    where: { id: b.id, status: b.status }, // ninguém mudou no meio do caminho
    data: { status: to, ...(stamp ? { [stamp]: now } : {}), ...(to.startsWith("CANCELED") ? { cancelReason: why } : {}) },
  });
  if (!updated.count) throw new BookingError("A contratação acabou de mudar. Atualize a tela.");
  await db.bookingStatusHistory.create({ data: { bookingId: b.id, from: b.status, to, byUserId: actor.id, reason: why } });
  if (to === "COMPLETED") await db.professionalProfile.update({ where: { id: b.proId }, data: { completedCount: { increment: 1 } } });

  const href = `/pedidos/${b.id}`;
  const label = BOOKING_LABEL[to];
  const toClient = actor.as !== "CLIENT";
  const toPro = actor.as !== "PRO";
  const body = why ? `${label}. Motivo: ${why}` : label;
  if (toClient) await notify(b.clientId, { title: titleFor(to, "CLIENT"), body, href, dedupeKey: `st:${b.id}:${to}:c` });
  if (toPro) await notify(b.pro.userId, { title: titleFor(to, "PRO"), body, href, dedupeKey: `st:${b.id}:${to}:p` });
  if (to === "COMPLETED") {
    await notify(b.clientId, { title: "Como foi a limpeza?", body: "Avalie o profissional (de 1 a 5 estrelas).", href, dedupeKey: `av:${b.id}:c` });
    await notify(b.pro.userId, { title: "Avalie o cliente", body: "Conte como foi a experiência.", href, dedupeKey: `av:${b.id}:p` });
  }
  return to;
}

function titleFor(to: BookingStatus, who: "CLIENT" | "PRO") {
  if (to === "ACCEPTED") return who === "CLIENT" ? "Solicitação aceita! 🎉" : "Contratação confirmada";
  if (to === "REFUSED") return "Solicitação recusada";
  if (to === "EXPIRED") return "Solicitação expirada";
  if (to === "ON_THE_WAY") return "Profissional a caminho 🚗";
  if (to === "ARRIVED") return "Profissional chegou";
  if (to === "STARTED") return "Serviço iniciado";
  if (to === "COMPLETED") return "Serviço concluído ✅";
  if (to.startsWith("CANCELED")) return "Contratação cancelada";
  return "Contratação em análise";
}

/** Solicitações sem resposta no prazo expiram (o cliente pode escolher outro profissional). */
export async function expireSweep(now = new Date()) {
  const late = await db.booking.findMany({ where: { status: "WAITING_PRO", expiresAt: { lt: now } }, select: { id: true }, take: 200 });
  for (const b of late) await changeStatus(b.id, "EXPIRED", { id: null, as: "SYSTEM" }, null, now).catch(() => {});
  return late.length;
}

/** Lembrete do serviço próximo (cerca de 24 h e 2 h antes). */
export async function reminderSweep(now = new Date()) {
  const soon = await db.booking.findMany({
    where: { status: "ACCEPTED", scheduledAt: { gt: now, lt: new Date(now.getTime() + 25 * 3_600_000) } },
    include: { pro: { select: { userId: true } } },
  });
  for (const b of soon) {
    const h = (b.scheduledAt.getTime() - now.getTime()) / 3_600_000;
    const tag = h <= 2.5 ? "2h" : "24h";
    const body = `Limpeza ${formatWhen(b.scheduledAt, b.addrUf)} em ${b.addrCity}.`;
    for (const userId of [b.clientId, b.pro.userId]) await notify(userId, { title: "Lembrete: serviço próximo", body, href: `/pedidos/${b.id}`, dedupeKey: `lembrete:${b.id}:${tag}:${userId}` });
  }
}

/** Privacidade: depois do fim, o endereço exato da contratação é apagado (fica só a cidade). */
export const ADDRESS_RETENTION_DAYS = 90;
export async function purgeAddresses(now = new Date()) {
  const before = new Date(now.getTime() - ADDRESS_RETENTION_DAYS * 86_400_000);
  const r = await db.booking.updateMany({
    where: { addressPurgedAt: null, status: { in: ["COMPLETED", "CANCELED_CLIENT", "CANCELED_PRO", "REFUSED", "EXPIRED"] }, updatedAt: { lt: before } },
    data: { addrStreet: "(endereço removido)", addrNumber: null, addrComplement: null, addrDistrict: null, addrCep: null, addrReference: null, lat: null, lng: null, addressPurgedAt: now },
  });
  return r.count;
}
