"use server";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/action-form";
import { BookingError, createBooking } from "@/lib/bookings";
import { HOME_SIZES } from "@/lib/domain";
import { localToUtc } from "@/lib/places";
import { allowAttempt } from "@/lib/rate-limit";
import { requireClient } from "@/lib/session";

const s = (d: FormData, k: string) => String(d.get(k) ?? "").trim();
const num = (v: string) => (v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

export async function createBookingAction(_: ActionResult, d: FormData): Promise<ActionResult> {
  const user = await requireClient();
  if (!(await allowAttempt(`booking:${user.id}`, 20, 60))) return { error: "Muitas solicitações em pouco tempo. Espere um pouco." };
  const uf = s(d, "uf");
  const scheduledAt = localToUtc(s(d, "date"), s(d, "time").slice(0, 5), uf);
  if (!scheduledAt) return { error: "Escolha a data e o horário." };
  const hours = Number(s(d, "hours"));
  const lat = num(s(d, "lat"));
  const lng = num(s(d, "lng"));
  const rooms = num(s(d, "rooms"));
  const homeSize = HOME_SIZES.includes(s(d, "homeSize") as (typeof HOME_SIZES)[number]) ? s(d, "homeSize") : null;
  const pay = s(d, "payMethod");
  let id: string;
  try {
    const b = await createBooking({
      clientId: user.id,
      proId: s(d, "proId"),
      services: d.getAll("services").map(String),
      hours,
      scheduledAt,
      notes: s(d, "notes"),
      homeSize,
      rooms: rooms != null && rooms >= 1 && rooms <= 40 ? Math.round(rooms) : null,
      address: {
        street: s(d, "street"),
        number: s(d, "number"),
        complement: s(d, "complement"),
        district: s(d, "district"),
        city: s(d, "city"),
        uf,
        cep: s(d, "cep"),
        reference: s(d, "reference"),
        lat: lat != null && Math.abs(lat) <= 90 ? lat : null,
        lng: lng != null && Math.abs(lng) <= 180 ? lng : null,
      },
      saveAddressLabel: d.get("saveAddress") === "on" ? s(d, "saveLabel") || "Endereço" : null,
      payMethod: pay === "PIX" || pay === "CASH" ? pay : null,
    });
    id = b.id;
  } catch (e) {
    if (e instanceof BookingError || (e instanceof Error && /horas|Preço/.test(e.message))) return { error: e.message };
    throw e;
  }
  redirect(`/pedidos/${id}?enviado=1`);
}
