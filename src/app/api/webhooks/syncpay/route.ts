import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { confirmPayment } from "@/lib/subscription";
import { webhookChargeIds, webhookToken } from "@/lib/syncpay";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Aviso da SyncPay quando um Pix muda. Autenticado pelo token secreto no endereço (só a SyncPay o recebe) e
 * idempotente (o mesmo aviso é guardado uma vez). O conteúdo nunca é prova de pagamento: o servidor confere
 * cada cobrança citada direto na API da SyncPay antes de liberar a assinatura.
 */
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!same(token, webhookToken())) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const raw = await req.text();
  const payload = (() => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  })();
  const eventKey = `syncpay:${createHash("sha256").update(raw).digest("hex")}`;
  try {
    await db.providerEvent.create({ data: { provider: "syncpay", eventKey, payload: (payload ?? { raw: raw.slice(0, 2000) }) as Prisma.InputJsonValue } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return NextResponse.json({ ok: true, repetido: true });
    throw e;
  }
  const ids = webhookChargeIds(payload);
  const payments = ids.length ? await db.subscriptionPayment.findMany({ where: { providerId: { in: ids }, status: "PENDING" }, select: { id: true } }) : [];
  for (const p of payments) await confirmPayment(p.id).catch((e) => console.error("[syncpay] conferir", e)); // a verificação periódica tenta de novo
  return NextResponse.json({ ok: true });
}
