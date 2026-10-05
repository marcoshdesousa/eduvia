import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { confirmPix } from "@/lib/pix-billing";

/** A tela do Pix pergunta a cada poucos segundos: o site confere na SyncPay se o pagamento caiu. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const payment = await db.payment.findFirst({ where: { id, subscription: { userId: user.id } }, select: { id: true, status: true } });
  if (!payment) return jsonError("Pagamento não encontrado", 404);
  if (payment.status === "PAID") return NextResponse.json({ status: "paid" });
  try {
    return NextResponse.json({ status: await confirmPix(payment.id) });
  } catch (e) {
    console.error("[syncpay] status", (e as Error).message);
    return NextResponse.json({ status: "pending" });
  }
}
