import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { conversationAccess } from "@/lib/chat";
import { db } from "@/lib/db";
import { PAY_METHODS, category, isPayMethod, unitsOf } from "@/lib/domain";

const CLIENT_REPLIES = ["Olá! Tudo bem?", "Qual o seu valor?", "Você tem horário amanhã?", "Estou te esperando", "Pode tocar a campainha", "Obrigado!"];

/** O que aparece no menu dos 4 quadradinhos: mensagens rápidas, formas de pagamento e (para o trabalhador) agendar. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const access = await conversationAccess(id, user);
  if (!access || access.as === "ADMIN") return jsonError("Conversa indisponível.", 403);
  if (access.as === "CLIENT") return NextResponse.json({ as: "CLIENT", quickReplies: CLIENT_REPLIES, payText: null, services: [] });
  const pro = await db.providerProfile.findUniqueOrThrow({
    where: { id: access.conversation.pro.id },
    include: { quickReplies: { orderBy: { createdAt: "asc" } }, services: { orderBy: { createdAt: "asc" } } },
  });
  const methods = pro.payMethods.filter(isPayMethod).map((m) => PAY_METHODS[m]);
  return NextResponse.json({
    as: "PRO",
    quickReplies: pro.quickReplies.map((q) => q.text),
    payText: methods.length ? `💳 Formas de pagamento que eu aceito: ${methods.join(", ")}. O pagamento é feito direto para mim, no dia do serviço.` : null,
    services: pro.services.map((s) => ({ category: s.category, label: `${category(s.category)?.emoji ?? ""} ${category(s.category)?.label ?? s.category}`, unit: s.unit, units: s.hourCents && !unitsOf(s.category).includes("HORA") ? [...unitsOf(s.category), "HORA" as const] : unitsOf(s.category), priceCents: s.priceCents, hourCents: s.hourCents })),
  });
}
