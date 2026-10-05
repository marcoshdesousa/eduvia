import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { confirmPix } from "@/lib/pix-billing";
import { webhookChargeId, webhookToken } from "@/lib/syncpay";

/**
 * Aviso da SyncPay quando uma cobrança muda. O endereço leva um token secreto; mesmo assim o plano só é
 * liberado depois de o site conferir o status direto na API da SyncPay (confirmPix).
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("token") !== webhookToken()) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const payload = (await req.json().catch(() => null)) as unknown;
  const chargeId = webhookChargeId(payload);
  const eventId = `${chargeId ?? "sem-id"}:${JSON.stringify(payload).length}:${Math.floor(Date.now() / 60_000)}`;
  try {
    await db.paymentEvent.create({ data: { provider: "syncpay", eventId, type: "cashin", payload: (payload ?? {}) as Prisma.InputJsonValue } });
  } catch {}
  if (!chargeId) return NextResponse.json({ ok: true });
  const payment = await db.payment.findUnique({ where: { providerPaymentId: `syncpay_${chargeId}` }, select: { id: true } });
  if (!payment) return NextResponse.json({ ok: true });
  try {
    const status = await confirmPix(payment.id);
    await db.paymentEvent.updateMany({ where: { provider: "syncpay", eventId }, data: { processedAt: new Date() } });
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    console.error("[syncpay] aviso", e);
    await db.paymentEvent.updateMany({ where: { provider: "syncpay", eventId }, data: { error: (e as Error).message.slice(0, 500) } });
    return NextResponse.json({ ok: false }, { status: 500 }); // a SyncPay tenta de novo
  }
}
