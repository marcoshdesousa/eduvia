"use server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import { db } from "@/lib/db";
import { WEEKDAYS, hhmmToMinutes, isService, parseBRL } from "@/lib/domain";
import { normalizePhone } from "@/lib/core/phone";
import { officialCity } from "@/lib/places";
import { sealSecret } from "@/lib/secret-box";
import { requirePro } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { createSubscriptionPix, SubscriptionError } from "@/lib/subscription";
import { missingForReview } from "@/lib/pro-profile";

const str = (d: FormData, k: string) => String(d.get(k) ?? "").trim();

export async function saveProfile(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requirePro();
  const price = parseBRL(str(d, "price"));
  if (price == null || price < 500 || price > 100_000) return { error: "Informe o preço por hora (entre R$ 5,00 e R$ 1.000,00)." };
  const services = d.getAll("services").map(String).filter(isService);
  if (!services.length) return { error: "Escolha pelo menos um serviço." };
  const bio = str(d, "bio").slice(0, 600) || null;
  await db.professionalProfile.update({ where: { id: user.pro.id }, data: { hourlyCents: price, services, bio } });
  revalidatePath("/painel", "layout");
  return { ok: "Perfil salvo." };
}

export async function addArea(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requirePro();
  const uf = str(d, "uf").toUpperCase();
  const city = officialCity(uf, str(d, "cidade"));
  if (!city) return { error: "Escolha um município da lista." };
  const settings = await getSettings();
  const count = await db.serviceArea.count({ where: { proId: user.pro.id } });
  if (count >= 1 && !settings.multipleCities) return { error: "No momento, cada profissional atende em um município." };
  if (count >= settings.maxCities) return { error: `Você pode atender em até ${settings.maxCities} municípios.` };
  await db.serviceArea.upsert({ where: { proId_uf_city: { proId: user.pro.id, uf, city } }, create: { proId: user.pro.id, uf, city }, update: {} });
  revalidatePath("/painel/perfil");
  return { ok: `${city}/${uf} incluído.` };
}

export async function removeArea(areaId: string) {
  const user = await requirePro();
  const count = await db.serviceArea.count({ where: { proId: user.pro.id } });
  if (count <= 1) return { error: "Você precisa atender em pelo menos um município." };
  await db.serviceArea.deleteMany({ where: { id: areaId, proId: user.pro.id } });
  revalidatePath("/painel/perfil");
  return { ok: "Removido." };
}

export async function saveWhatsapp(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requirePro();
  const phone = normalizePhone(str(d, "whatsapp"));
  if (!phone) return { error: "WhatsApp inválido. Use DDD + número." };
  await db.professionalProfile.update({ where: { id: user.pro.id }, data: { whatsappSealed: sealSecret(phone) } });
  return { ok: "WhatsApp atualizado." };
}

/** Agenda: para cada dia marcado, um horário de início e fim. Sem nenhum dia, o profissional decide em cada pedido. */
export async function saveAvailability(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requirePro();
  const rules: { weekday: number; startMin: number; endMin: number }[] = [];
  for (let w = 0; w < 7; w++) {
    if (d.get(`on${w}`) !== "on") continue;
    const start = hhmmToMinutes(str(d, `start${w}`));
    const end = hhmmToMinutes(str(d, `end${w}`));
    if (start == null || end == null || end - start < 60) return { error: `${WEEKDAYS[w]}: o fim precisa ser pelo menos 1 hora depois do início.` };
    rules.push({ weekday: w, startMin: start, endMin: end });
  }
  await db.$transaction([
    db.availabilityRule.deleteMany({ where: { proId: user.pro.id } }),
    db.availabilityRule.createMany({ data: rules.map((r) => ({ ...r, proId: user.pro.id })) }),
  ]);
  revalidatePath("/painel", "layout");
  return { ok: rules.length ? "Agenda salva." : "Agenda salva: sem dias fixos (você decide em cada pedido)." };
}

export async function setPaused(paused: boolean) {
  const user = await requirePro();
  await db.professionalProfile.update({ where: { id: user.pro.id }, data: { paused } });
  revalidatePath("/painel", "layout");
}

export async function submitForReview(): Promise<ActionResult> {
  const user = await requirePro();
  if (!["INCOMPLETE", "REJECTED"].includes(user.pro.status)) return { error: "Seu perfil já foi enviado." };
  const missing = await missingForReview(user.pro.id);
  if (missing.length) return { error: `Falta: ${missing.join(", ")}.` };
  await db.professionalProfile.update({
    where: { id: user.pro.id },
    data: { status: "PENDING", statusReason: null, approvals: { create: { status: "PENDING", reason: "Enviado pelo profissional" } } },
  });
  revalidatePath("/painel", "layout");
  return { ok: "Perfil enviado para verificação. Avisamos quando for analisado." };
}

export async function startPix(): Promise<{ error?: string; paymentId?: string }> {
  const user = await requirePro();
  try {
    const pay = await createSubscriptionPix(user.pro.id);
    revalidatePath("/painel/assinatura");
    return { paymentId: pay.id };
  } catch (e) {
    if (e instanceof SubscriptionError) return { error: e.message };
    console.error("[assinatura] Pix", e);
    return { error: "Não foi possível gerar o Pix agora. Tente de novo em alguns minutos." };
  }
}
