import "dotenv/config";
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";

// Precisa do banco (DATABASE_URL). Sem ele, os testes são pulados.
describe.skipIf(!process.env.DATABASE_URL)("regras do Diária Paga no banco", async () => {
  const { db } = await import("./db");
  const created: string[] = [];
  const ledgers: string[] = [];
  const NOW = new Date();

  async function user(name: string) {
    const id = randomUUID();
    const cpfHash = `t-${id}`;
    await db.user.create({ data: { id, name, email: `${id}@t.invalid`, role: "USER", cpfHash, cpfSealed: "x" } });
    created.push(id);
    ledgers.push(cpfHash);
    return { id, cpfHash };
  }

  /** Prestador visível em São Paulo, plano Completo, caixinha do rápido aceita e Disponível, diarista. */
  async function provider(name: string, price = 15000, lat = -23.55, lng = -46.63, opts: { plan?: "FULL" | "BASIC"; terms?: boolean } = {}) {
    const u = await user(name);
    const pro = await db.providerProfile.create({
      data: {
        userId: u.id,
        birthDate: new Date("1990-01-01"),
        phoneSealed: "x",
        photoKey: "perfil/x.jpg",
        quickOn: true,
        quickTermsAt: opts.terms === false ? null : new Date(),
        services: { create: { category: "diarista", priceCents: price, unit: "DIARIA", photoKey: "perfil/x.jpg" } },
        places: { create: { label: "Casa", city: "São Paulo", uf: "SP", lat, lng } },
        availability: { create: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMin: 0, endMin: 1439 })) },
        subscription: { create: { plan: opts.plan ?? "FULL", currentPeriodEnd: new Date(NOW.getTime() + 10 * 86_400_000) } },
      },
    });
    return { ...u, proId: pro.id };
  }

  const address = { street: "Rua Teste", number: "1", district: "Sé", city: "São Paulo", uf: "SP", lat: -23.551, lng: -46.631 };
  // cada teste do rápido numa cidade diferente (longe uma da outra) para os prestadores não se misturarem
  const MANAUS = { street: "Rua Teste", number: "1", city: "Manaus", uf: "AM", lat: -3.1019, lng: -60.025 };
  const RECIFE = { street: "Rua Teste", number: "1", city: "Recife", uf: "PE", lat: -8.0476, lng: -34.877 };
  const BELEM = { street: "Rua Teste", number: "1", city: "Belém", uf: "PA", lat: -1.4558, lng: -48.4902 };
  const POA = { street: "Rua Teste", number: "1", city: "Porto Alegre", uf: "RS", lat: -30.0346, lng: -51.2177 };

  afterAll(async () => {
    await db.user.deleteMany({ where: { id: { in: created } } });
    await db.cpfLedger.deleteMany({ where: { cpfHash: { in: ledgers } } });
  });

  it("rápido: vidraceiro não entra; compras pedem lista e telefone (criptografado)", async () => {
    const { createQuick, BookingError } = await import("./bookings");
    const { openSecret } = await import("./secret-box");
    const c = await user("Cliente Compras");
    const FLORIPA = { street: "Rua Teste", number: "1", city: "Florianópolis", uf: "SC", lat: -27.5954, lng: -48.548 };
    await expect(createQuick({ clientId: c.id, category: "vidraceiro", quantity: 1, notes: "trocar o vidro da janela da sala", address: FLORIPA })).rejects.toThrow(/não tem Contrate rápido/);
    await expect(createQuick({ clientId: c.id, category: "compras", quantity: 1, notes: "arroz", address: FLORIPA, contactPhone: "48999887766" })).rejects.toBeInstanceOf(BookingError);
    await expect(createQuick({ clientId: c.id, category: "compras", quantity: 1, notes: "5 kg de arroz, 2 kg de feijão, 1 dúzia de ovos", address: FLORIPA })).rejects.toThrow(/telefone/);
    const b = await createQuick({ clientId: c.id, category: "compras", quantity: 1, notes: "5 kg de arroz, 2 kg de feijão, 1 dúzia de ovos", address: FLORIPA, contactPhone: "(48) 99988-7766" }, NOW);
    expect(b.estimateCents).toBe(4000);
    expect(b.contactSealed).not.toContain("99988");
    expect(openSecret(b.contactSealed!)).toBe("5548999887766");
  });

  it("teste grátis só uma vez por CPF, mesmo apagando e criando o perfil de novo", async () => {
    const { startTrialIfEligible } = await import("./subscription");
    const u = await user("Teste Trial");
    const p1 = await db.providerProfile.create({ data: { userId: u.id, birthDate: new Date("1990-01-01"), phoneSealed: "x" } });
    expect(await startTrialIfEligible(p1.id, u.cpfHash)).toBe(true);
    await db.providerProfile.delete({ where: { id: p1.id } });
    const p2 = await db.providerProfile.create({ data: { userId: u.id, birthDate: new Date("1990-01-01"), phoneSealed: "x" } });
    expect(await startTrialIfEligible(p2.id, u.cpfHash)).toBe(false);
    const sub = await db.subscription.findUniqueOrThrow({ where: { proId: p2.id } });
    expect(sub.currentPeriodEnd).toBeNull();
  });

  it("Contrate rápido: valor fixo; só toca para Completo com a caixinha aceita e perto; o primeiro que aceita leva", async () => {
    const { createQuick, acceptOffer, BookingError } = await import("./bookings");
    const near = await provider("Perto", 12000, BELEM.lat, BELEM.lng);
    const far = await provider("Longe", 12000, BELEM.lat - 0.45, BELEM.lng - 0.2); // ~55 km
    const basic = await provider("Básico", 12000, BELEM.lat, BELEM.lng, { plan: "BASIC" });
    const noTerms = await provider("Sem caixinha", 12000, BELEM.lat, BELEM.lng, { terms: false });
    const client = await user("Cliente Rápido");
    await expect(createQuick({ clientId: client.id, category: "diarista", quantity: 1, notes: "", address: BELEM })).rejects.toBeInstanceOf(BookingError);
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 2, notes: "Faxina completa, casa de 2 quartos", address: BELEM });
    expect(b.estimateCents).toBe(2 * 15000); // valor fixo da diarista × 2 diárias, não o preço do perfil
    const offers = await db.quickOffer.findMany({ where: { bookingId: b.id } });
    const ids = offers.map((o) => o.proId);
    expect(ids).toContain(near.proId);
    expect(ids).not.toContain(far.proId);
    expect(ids).not.toContain(basic.proId);
    expect(ids).not.toContain(noTerms.proId);
    const mine = offers.find((o) => o.proId === near.proId)!;
    // duas tentativas ao mesmo tempo: só uma ganha
    const r = await Promise.allSettled([acceptOffer(mine.id, near.id), acceptOffer(mine.id, near.id)]);
    expect(r.filter((x) => x.status === "fulfilled").length).toBe(1);
    const after = await db.booking.findUniqueOrThrow({ where: { id: b.id } });
    expect(after.status).toBe("ACCEPTED");
    expect(after.proId).toBe(near.proId);
    expect(after.arriveBy!.getTime() - after.acceptedAt!.getTime()).toBe(2 * 3_600_000);
    expect(after.estimateCents).toBe(30000);
    await db.booking.update({ where: { id: b.id }, data: { status: "CANCELED_CLIENT" } });
  });

  it("prestador que não chega em 2 horas: cancelado e 7 dias fora do rápido", async () => {
    const { createQuick, acceptOffer, quickSweep } = await import("./bookings");
    const pro = await provider("Atrasado", 11000, MANAUS.lat, MANAUS.lng);
    const client = await user("Cliente Espera");
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 1, notes: "Faxina completa na casa", address: MANAUS });
    const offer = await db.quickOffer.findFirstOrThrow({ where: { bookingId: b.id, proId: pro.proId } });
    await acceptOffer(offer.id, pro.id);
    await quickSweep(new Date(Date.now() + 2 * 3_600_000 + 60_000));
    expect((await db.booking.findUniqueOrThrow({ where: { id: b.id } })).status).toBe("NO_SHOW_PRO");
    const p = await db.providerProfile.findUniqueOrThrow({ where: { id: pro.proId } });
    expect(p.quickOn).toBe(false);
    expect(p.quickBannedUntil!.getTime()).toBeGreaterThan(Date.now() + 6 * 86_400_000);
  });

  it("cliente que não estava: só depois de 15 min no local; fica 30 dias sem contratar", async () => {
    const { createQuick, acceptOffer, changeStatus, clientNoShow, BookingError } = await import("./bookings");
    const pro = await provider("Pontual", 10500, RECIFE.lat, RECIFE.lng);
    const client = await user("Cliente Sumido");
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 1, notes: "Faxina completa na casa", address: RECIFE });
    const offer = await db.quickOffer.findFirstOrThrow({ where: { bookingId: b.id, proId: pro.proId } });
    await acceptOffer(offer.id, pro.id);
    await changeStatus(b.id, "ARRIVED", { id: pro.id, as: "PRO" });
    await expect(clientNoShow(b.id, pro.id)).rejects.toBeInstanceOf(BookingError);
    await clientNoShow(b.id, pro.id, new Date(Date.now() + 16 * 60_000));
    const ledger = await db.cpfLedger.findUniqueOrThrow({ where: { cpfHash: client.cpfHash } });
    expect(ledger.clientBlockedUntil!.getTime()).toBeGreaterThan(Date.now() + 29 * 86_400_000);
    await expect(createQuick({ clientId: client.id, category: "diarista", quantity: 1, notes: "Faxina completa na casa", address })).rejects.toThrow(/sem contratar/);
  });

  it("quem recusa muito vai para o fim da fila", async () => {
    const { createQuick, quickCandidates, quickStats } = await import("./bookings");
    const refuser = await provider("Recusa Muito", 12000, POA.lat, POA.lng);
    const good = await provider("Aceita Sempre", 12000, POA.lat - 0.08, POA.lng - 0.08); // mais longe
    const client = await user("Cliente Fila");
    // histórico: o primeiro recusou 8 de 10; o segundo aceitou 6 de 6
    const mk = (proId: string, state: "ACCEPTED" | "DECLINED", n: number) =>
      Promise.all(Array.from({ length: n }, () => db.booking.create({ data: { mode: "QUICK", clientId: client.id, status: "CANCELED_CLIENT", category: "diarista", unit: "DIARIA", quantity: 1, scheduledAt: new Date(), addrStreet: "x", addrCity: "São Paulo", addrUf: "SP", offers: { create: { proId, wave: 1, distanceKm: 1, priceCents: 15000, state, expiresAt: new Date() } } } })));
    await mk(refuser.proId, "DECLINED", 8);
    await mk(refuser.proId, "ACCEPTED", 2);
    await mk(good.proId, "ACCEPTED", 6);
    const stats = await quickStats([refuser.proId, good.proId]);
    expect(stats.get(refuser.proId)).toEqual({ accepted: 2, missed: 8 });
    const b = await db.booking.create({ data: { mode: "QUICK", clientId: client.id, status: "SEARCHING", category: "diarista", unit: "DIARIA", quantity: 1, estimateCents: 15000, scheduledAt: new Date(), addrStreet: "x", addrCity: "Porto Alegre", addrUf: "RS", lat: POA.lat, lng: POA.lng } });
    const order = (await quickCandidates(b)).map((p) => p.id).filter((id) => id === refuser.proId || id === good.proId);
    expect(order).toEqual([good.proId, refuser.proId]);
    await db.booking.update({ where: { id: b.id }, data: { status: "CANCELED_CLIENT" } });
  });

  it("agendamento pela conversa: reserva o horário, ninguém pede por cima, o cliente confirma com o endereço", async () => {
    const { proposeSchedule, confirmSchedule, createBooking, BookingError } = await import("./bookings");
    const { conversationWith } = await import("./chat");
    const pro = await provider("Agenda", 15000, -23.6, -46.6);
    const client = await user("Cliente Conversa");
    const other = await user("Outro Cliente");
    const conv = await conversationWith(client.id, pro.proId);
    const at = new Date(Date.now() + 3 * 86_400_000);
    at.setUTCHours(13, 0, 0, 0); // 10h em São Paulo
    const b = await proposeSchedule(conv.id, pro.id, { category: "diarista", unit: "DIARIA", quantity: 1, scheduledAt: at, priceCents: 16000 });
    expect(b.status).toBe("PROPOSED");
    expect(await db.message.count({ where: { conversationId: conv.id, kind: "SCHEDULE", bookingId: b.id } })).toBe(1);
    // o mesmo horário não pode ser pedido por outra pessoa
    await expect(createBooking({ clientId: other.id, proId: pro.proId, category: "diarista", quantity: 1, scheduledAt: new Date(at.getTime() + 3_600_000), address: { street: "Rua A", city: "São Paulo", uf: "SP" } })).rejects.toBeInstanceOf(BookingError);
    // compromisso pessoal também bloqueia
    await db.agendaEntry.create({ data: { proId: pro.proId, title: "Médico", startsAt: new Date(at.getTime() + 86_400_000), endsAt: new Date(at.getTime() + 86_400_000 + 2 * 3_600_000) } });
    await expect(proposeSchedule(conv.id, pro.id, { category: "diarista", unit: "DIARIA", quantity: 1, scheduledAt: new Date(at.getTime() + 86_400_000 + 3_600_000), priceCents: 16000 })).rejects.toBeInstanceOf(BookingError);
    await confirmSchedule(b.id, client.id, { street: "Rua das Flores", number: "10", city: "São Paulo", uf: "SP" });
    const after = await db.booking.findUniqueOrThrow({ where: { id: b.id } });
    expect(after.status).toBe("ACCEPTED");
    expect(after.addrStreet).toBe("Rua das Flores");
    expect(after.estimateCents).toBe(16000);
  });

  it("indicação: conta só quem entrou depois do último desconto", async () => {
    const { referralCount } = await import("./subscription");
    const inviter = await user("Quem Convida");
    const since = new Date(Date.now() - 1000);
    for (let i = 0; i < 3; i++) {
      const u = await user(`Convidado ${i}`);
      await db.user.update({ where: { id: u.id }, data: { referredById: inviter.id } });
    }
    expect(await referralCount(inviter.id, since)).toBe(3);
    expect(await referralCount(inviter.id, new Date(Date.now() + 1000))).toBe(0);
  });

  it("pacotes de endereço: liberam na hora, entram na próxima mensalidade, máximo 11", async () => {
    const { addPack, removePack, nextCharge } = await import("./subscription");
    const pro = await provider("Pacotes");
    for (let i = 0; i < 4; i++) await addPack(pro.proId);
    await expect(addPack(pro.proId)).rejects.toThrow(/11 endereços/);
    let sub = await db.subscription.findUniqueOrThrow({ where: { proId: pro.proId } });
    expect(sub.packs).toBe(4);
    expect(nextCharge(sub).cents).toBe(1585 + 4 * 385);
    await removePack(pro.proId);
    sub = await db.subscription.findUniqueOrThrow({ where: { proId: pro.proId } });
    expect(sub.packs).toBe(4); // continua valendo até vencer
    expect(nextCharge(sub).cents).toBe(1585 + 3 * 385);
    await addPack(pro.proId); // desfaz a retirada
    sub = await db.subscription.findUniqueOrThrow({ where: { proId: pro.proId } });
    expect(nextCharge(sub).cents).toBe(1585 + 4 * 385);
  });
});
