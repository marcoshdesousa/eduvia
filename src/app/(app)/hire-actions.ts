"use server";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import { BookingError, createBooking, createQuick, type AddressInput } from "@/lib/bookings";
import { localToUtc } from "@/lib/places";
import { allowAttempt } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";

const s = (d: FormData, k: string) => String(d.get(k) ?? "").trim();
const num = (v: string) => (v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
const PAY = ["PIX", "DINHEIRO", "DEBITO", "CREDITO"];

function address(d: FormData): AddressInput {
  const lat = num(s(d, "lat"));
  const lng = num(s(d, "lng"));
  return {
    street: s(d, "street"),
    number: s(d, "number"),
    complement: s(d, "complement"),
    district: s(d, "district"),
    city: s(d, "city"),
    uf: s(d, "uf").toUpperCase(),
    cep: s(d, "cep"),
    reference: s(d, "reference"),
    lat: lat != null && Math.abs(lat) <= 90 ? lat : null,
    lng: lng != null && Math.abs(lng) <= 180 ? lng : null,
  };
}

const userError = (e: unknown) => e instanceof BookingError || (e instanceof Error && /^(Escolha de|Preço)/.test(e.message));

/** Pedido normal para um prestador escolhido (data e hora marcadas). */
export async function createBookingAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!(await allowAttempt(`booking:${user.id}`, 20, 60))) return { error: "Muitos pedidos em pouco tempo. Espere um pouco." };
  const addr = address(d);
  const scheduledAt = localToUtc(s(d, "date"), s(d, "time").slice(0, 5), addr.uf || "SP");
  if (!scheduledAt) return { error: "Escolha a data e o horário." };
  let id: string;
  try {
    const b = await createBooking({
      clientId: user.id,
      proId: s(d, "proId"),
      category: s(d, "category"),
      quantity: Number(s(d, "quantity")),
      unit: s(d, "unit") === "HORA" ? "HORA" : null,
      scheduledAt,
      notes: s(d, "notes"),
      address: addr,
      saveAddressLabel: d.get("saveAddress") === "on" ? s(d, "saveLabel") || "Endereço" : null,
      payMethod: PAY.includes(s(d, "payMethod")) ? s(d, "payMethod") : null,
      contactPhone: s(d, "contactPhone"),
    });
    id = b.id;
  } catch (e) {
    if (userError(e)) return { error: (e as Error).message };
    throw e;
  }
  redirect(`/pedidos/${id}?enviado=1`);
}

/** Contrate rápido: chama na hora quem está perto. */
export async function createQuickAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireUser();
  if (!(await allowAttempt(`quick:${user.id}`, 10, 60))) return { error: "Muitos chamados em pouco tempo. Espere um pouco." };
  const addr = address(d);
  if (addr.lat == null || addr.lng == null) return { error: "Precisamos do local no mapa para achar quem está perto. Use “Onde estou” ou toque no mapa." };
  let id: string;
  try {
    const b = await createQuick({
      clientId: user.id,
      category: s(d, "category"),
      quantity: Number(s(d, "quantity")),
      unit: s(d, "unit") === "HORA" ? "HORA" : null,
      notes: s(d, "notes"),
      address: { ...addr, lat: addr.lat, lng: addr.lng },
      saveAddressLabel: d.get("saveAddress") === "on" ? s(d, "saveLabel") || "Endereço" : null,
      payMethod: PAY.includes(s(d, "payMethod")) ? s(d, "payMethod") : null,
      contactPhone: s(d, "contactPhone"),
    });
    id = b.id;
  } catch (e) {
    if (userError(e)) return { error: (e as Error).message };
    throw e;
  }
  redirect(`/pedidos/${id}`);
}
