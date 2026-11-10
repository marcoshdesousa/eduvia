import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { confirmPayment } from "@/lib/subscription";

const lastCheck = new Map<string, number>();

/** Situação do Pix da assinatura (a tela pergunta a cada poucos segundos; conferimos na SyncPay no máximo a cada 10 s). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const pay = await db.subscriptionPayment.findFirst({ where: { id, pro: { userId: user.id } } });
  if (!pay) return jsonError("Pagamento não encontrado.", 404);
  let status = pay.status;
  if (status === "PENDING" && Date.now() - (lastCheck.get(id) ?? 0) > 10_000) {
    lastCheck.set(id, Date.now());
    status = ((await confirmPayment(id).catch(() => null)) ?? status) as typeof status;
  }
  return NextResponse.json({ status, pixCode: pay.pixCode });
}
