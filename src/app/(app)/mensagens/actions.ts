"use server";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import type { PriceUnit } from "@/generated/prisma/enums";
import { BookingError, proposeSchedule } from "@/lib/bookings";
import { conversationWith } from "@/lib/chat";
import { db } from "@/lib/db";
import { parseBRL } from "@/lib/domain";
import { localToUtc } from "@/lib/places";
import { requireProvider, requireUser } from "@/lib/session";

/** "Mandar mensagem" no perfil do trabalhador: abre (ou cria) a conversa. */
export async function startConversationAction(proId: string) {
  const user = await requireUser();
  const pro = await db.providerProfile.findUnique({ where: { id: proId }, select: { id: true, userId: true } });
  if (!pro || pro.userId === user.id) redirect("/mensagens");
  const blocked = await db.block.findFirst({ where: { OR: [{ blockerId: user.id, blockedId: pro.userId }, { blockerId: pro.userId, blockedId: user.id }] } });
  if (blocked) redirect(`/prestador/${proId}`);
  const c = await conversationWith(user.id, pro.id);
  redirect(`/mensagens/${c.id}`);
}

/** O trabalhador agenda pela conversa: o horário fica reservado e o cliente confirma com o endereço. */
export async function proposeScheduleAction(conversationId: string, _: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  const place = await db.providerPlace.findFirst({ where: { proId: user.provider.id }, select: { uf: true } });
  const at = localToUtc(String(f.get("date") ?? ""), String(f.get("time") ?? "").slice(0, 5), place?.uf ?? "SP");
  if (!at) return { error: "Escolha o dia e o horário." };
  const price = parseBRL(String(f.get("price") ?? ""));
  if (price == null) return { error: "Informe o valor." };
  try {
    await proposeSchedule(conversationId, user.id, {
      category: String(f.get("category") ?? ""),
      unit: String(f.get("unit") ?? "DIARIA") as PriceUnit,
      quantity: Number(f.get("quantity") ?? 1),
      scheduledAt: at,
      priceCents: price,
      notes: String(f.get("notes") ?? ""),
    });
  } catch (e) {
    if (e instanceof BookingError || (e instanceof Error && /^(Escolha de|Preço)/.test(e.message))) return { error: e.message };
    throw e;
  }
  return { ok: "Agendado! O horário está reservado. O cliente confirma com o endereço." };
}
