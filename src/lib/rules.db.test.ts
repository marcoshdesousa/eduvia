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

  /** Prestador visível em São Paulo, Disponível no rápido, diarista a R$ 150 (ou o preço dado). */
  async function provider(name: string, price = 15000, lat = -23.55, lng = -46.63) {
    const u = await user(name);
    const pro = await db.providerProfile.create({
      data: {
        userId: u.id,
        birthDate: new Date("1990-01-01"),
        phoneSealed: "x",
        photoKey: "perfil/x.jpg",
        quickOn: true,
        services: { create: { category: "diarista", priceCents: price, unit: "DIARIA" } },
        places: { create: { label: "Casa", city: "São Paulo", uf: "SP", lat, lng } },
        availability: { create: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMin: 0, endMin: 1439 })) },
        subscription: { create: { plan: "FULL", currentPeriodEnd: new Date(NOW.getTime() + 10 * 86_400_000) } },
      },
    });
    return { ...u, proId: pro.id };
  }

  const address = { street: "Rua Teste", number: "1", district: "Sé", city: "São Paulo", uf: "SP", lat: -23.551, lng: -46.631 };

  afterAll(async () => {
    await db.user.deleteMany({ where: { id: { in: created } } });
    await db.cpfLedger.deleteMany({ where: { cpfHash: { in: ledgers } } });
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

  it("Contrate rápido: toca para quem está perto e cabe no preço; o primeiro que aceita leva", async () => {
    const { createQuick, acceptOffer } = await import("./bookings");
    const near = await provider("Perto Barata", 12000);
    const far = await provider("Longe", 12000, -23.9, -46.9); // ~50 km
    const pricey = await provider("Cara", 40000);
    const client = await user("Cliente Rápido");
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 1, maxCents: 20000, address });
    const offers = await db.quickOffer.findMany({ where: { bookingId: b.id } });
    const ids = offers.map((o) => o.proId);
    expect(ids).toContain(near.proId);
    expect(ids).not.toContain(far.proId);
    expect(ids).not.toContain(pricey.proId);
    const mine = offers.find((o) => o.proId === near.proId)!;
    // duas tentativas ao mesmo tempo: só uma ganha
    const r = await Promise.allSettled([acceptOffer(mine.id, near.id), acceptOffer(mine.id, near.id)]);
    expect(r.filter((x) => x.status === "fulfilled").length).toBe(1);
    const after = await db.booking.findUniqueOrThrow({ where: { id: b.id } });
    expect(after.status).toBe("ACCEPTED");
    expect(after.proId).toBe(near.proId);
    expect(after.arriveBy!.getTime() - after.acceptedAt!.getTime()).toBe(2 * 3_600_000);
    expect(after.estimateCents).toBe(12000);
    await db.booking.update({ where: { id: b.id }, data: { status: "CANCELED_CLIENT" } });
  });

  it("prestador que não chega em 2 horas: cancelado e 7 dias fora do rápido", async () => {
    const { createQuick, acceptOffer, quickSweep } = await import("./bookings");
    const pro = await provider("Atrasado", 11000, -23.552, -46.632);
    const client = await user("Cliente Espera");
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 1, maxCents: 11000, address });
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
    const pro = await provider("Pontual", 10500, -23.553, -46.633);
    const client = await user("Cliente Sumido");
    const b = await createQuick({ clientId: client.id, category: "diarista", quantity: 1, maxCents: 10500, address });
    const offer = await db.quickOffer.findFirstOrThrow({ where: { bookingId: b.id, proId: pro.proId } });
    await acceptOffer(offer.id, pro.id);
    await changeStatus(b.id, "ARRIVED", { id: pro.id, as: "PRO" });
    await expect(clientNoShow(b.id, pro.id)).rejects.toBeInstanceOf(BookingError);
    await clientNoShow(b.id, pro.id, new Date(Date.now() + 16 * 60_000));
    const ledger = await db.cpfLedger.findUniqueOrThrow({ where: { cpfHash: client.cpfHash } });
    expect(ledger.clientBlockedUntil!.getTime()).toBeGreaterThan(Date.now() + 29 * 86_400_000);
    await expect(createQuick({ clientId: client.id, category: "diarista", quantity: 1, maxCents: 20000, address })).rejects.toThrow(/sem contratar/);
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
