import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { refreshPayment } from "@/lib/payments/subscriptions";

/** Status atual da cobrança (consulta o provedor se ainda estiver pendente). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser({ requireAccess: false });
  if (error) return error;
  const { id } = await params;
  try {
    const p = await refreshPayment(id, user.id);
    if (!p) return jsonError("Cobrança não encontrada", 404);
    return NextResponse.json({ status: p.status });
  } catch (e) {
    console.error("[pagamento]", e);
    return jsonError("Não foi possível consultar o pagamento agora", 502);
  }
}
