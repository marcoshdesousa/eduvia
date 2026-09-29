// Webhook do Asaas. Configure em Asaas → Integrações → Webhooks:
//   URL: {APP_URL}/api/webhooks/asaas   ·   Token de autenticação: ASAAS_WEBHOOK_TOKEN
//   Eventos: cobranças (PAYMENT_*) e assinaturas (SUBSCRIPTION_*).
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { mapAsaasPayment } from "@/lib/payments/asaas";
import { applyPayment, markRemoteSubscriptionEnded } from "@/lib/payments/subscriptions";

function validToken(given: string | null) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expected || !given) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

type AsaasEvent = {
  id?: string;
  event: string;
  payment?: Parameters<typeof mapAsaasPayment>[0];
  subscription?: { id: string };
};

export async function POST(req: Request) {
  if (!validToken(req.headers.get("asaas-access-token"))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as AsaasEvent;
  const eventId = body.id ?? `${body.event}:${body.payment?.id ?? body.subscription?.id}:${body.payment?.status ?? ""}`;

  // idempotência: o mesmo evento pode chegar mais de uma vez
  let record;
  try {
    record = await db.paymentEvent.create({ data: { provider: "asaas", eventId, type: body.event, payload: body as unknown as Prisma.InputJsonValue } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const existing = await db.paymentEvent.findUnique({ where: { provider_eventId: { provider: "asaas", eventId } } });
      if (existing?.processedAt) return NextResponse.json({ ok: true, duplicate: true });
      record = existing!;
    } else throw e;
  }

  try {
    if (body.payment && body.event.startsWith("PAYMENT_")) {
      await applyPayment(mapAsaasPayment(body.payment));
    } else if (body.subscription && (body.event === "SUBSCRIPTION_DELETED" || body.event === "SUBSCRIPTION_INACTIVATED")) {
      await markRemoteSubscriptionEnded(body.subscription.id);
    }
    await db.paymentEvent.update({ where: { id: record.id }, data: { processedAt: new Date(), error: null } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook asaas]", e);
    await db.paymentEvent.update({ where: { id: record.id }, data: { error: String(e).slice(0, 1000) } });
    return NextResponse.json({ error: "falha ao processar" }, { status: 500 });
  }
}
