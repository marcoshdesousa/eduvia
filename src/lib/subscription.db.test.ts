import "dotenv/config";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

// Precisa do banco (DATABASE_URL). Sem ele, o teste é pulado.
describe.skipIf(!process.env.DATABASE_URL)("assinatura no banco", () => {
  it("o mesmo Pix confirmado várias vezes ao mesmo tempo libera só 30 dias", async () => {
    const { db } = await import("./db");
    const { grantPeriod } = await import("./subscription");
    const userId = randomUUID();
    await db.user.create({ data: { id: userId, name: "Teste Assinatura", email: `${userId}@t.invalid`, role: "PRO", cpfHash: `t-${userId}`, cpfSealed: "x" } });
    const pro = await db.professionalProfile.create({ data: { userId, birthDate: new Date("1990-01-01"), whatsappSealed: "x" } });
    const pay = await db.subscriptionPayment.create({ data: { proId: pro.id, amountCents: 1585, providerId: `t-${userId}` } });
    const now = new Date("2026-11-10T12:00:00Z");
    await Promise.all([grantPeriod(pay.id, now), grantPeriod(pay.id, now), grantPeriod(pay.id, now)]);
    const sub = await db.subscription.findUniqueOrThrow({ where: { proId: pro.id } });
    expect(sub.currentPeriodEnd!.toISOString()).toBe("2026-12-10T12:00:00.000Z");
    expect((await db.subscriptionPayment.findUniqueOrThrow({ where: { id: pay.id } })).status).toBe("PAID");
    await db.user.delete({ where: { id: userId } });
  });
});
