import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { confirmPix } from "@/lib/pix-billing";
import { webhookChargeIds } from "@/lib/syncpay";

/**
 * Aviso da SyncPay quando uma cobrança muda (igual à Acolia). O conteúdo do aviso nunca é prova de pagamento:
 * ele só serve de "cutucada" para o site conferir na hora, direto na API da SyncPay (confirmPix), as cobranças
 * que ele cita. Por isso funciona tanto com o endereço do painel da SyncPay quanto com o que vai em cada Pix.
 */
export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as unknown;
  const ids = webhookChargeIds(payload);
  const eventId = `${ids[0] ?? "sem-id"}:${JSON.stringify(payload ?? {}).length}:${Math.floor(Date.now() / 60_000)}`;
  try {
    await db.paymentEvent.create({ data: { provider: "syncpay", eventId, type: "cashin", payload: (payload ?? {}) as Prisma.InputJsonValue } });
  } catch {}
  const payments = ids.length
    ? await db.payment.findMany({ where: { providerPaymentId: { in: ids.map((id) => `syncpay_${id}`) }, status: "PENDING" }, select: { id: true } })
    : [];
  try {
    for (const p of payments) await confirmPix(p.id);
    await db.paymentEvent.updateMany({ where: { provider: "syncpay", eventId }, data: { processedAt: new Date() } });
  } catch (e) {
    // a conferência a cada 5 min pega depois
    console.error("[syncpay] aviso", e);
    await db.paymentEvent.updateMany({ where: { provider: "syncpay", eventId }, data: { error: (e as Error).message.slice(0, 500) } });
  }
  return NextResponse.json({ ok: true });
}
