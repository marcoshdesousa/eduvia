import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { db } from "@/lib/db";
import { categoryLabel, distanceKm, formatBRL, formatKm, qtyLong } from "@/lib/domain";

const coord = (v: string | null, max: number) => (v != null && v !== "" && Number.isFinite(Number(v)) && Math.abs(Number(v)) <= max ? Number(v) : null);

/**
 * Chamados do Contrate rápido tocando agora para este prestador (a tela pergunta a cada poucos segundos).
 * Mostra a distância até o cliente a partir de cada endereço do prestador e, se o celular mandar a posição dele
 * (?lat=&lng=), a distância de onde ele está agora. A posição do cliente nunca sai do servidor antes do aceite.
 */
export async function GET(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return NextResponse.json({ on: false, offers: [] });
  const url = new URL(req.url);
  const lat = coord(url.searchParams.get("lat"), 90);
  const lng = coord(url.searchParams.get("lng"), 180);
  const places = await db.providerPlace.findMany({ where: { proId: user.provider.id, active: true }, orderBy: { createdAt: "asc" }, select: { label: true, lat: true, lng: true } });
  const offers = await db.quickOffer.findMany({
    where: { proId: user.provider.id, state: "PENDING", expiresAt: { gt: new Date() }, booking: { status: "SEARCHING" } },
    include: { booking: true },
    orderBy: { sentAt: "asc" },
    take: 3,
  });
  return NextResponse.json(
    {
      on: user.provider.quickOn,
      offers: offers.map((o) => ({
        id: o.id,
        bookingId: o.bookingId,
        category: categoryLabel(o.booking.category),
        qty: qtyLong(o.booking.unit, o.booking.quantity),
        byHour: o.booking.unit === "HORA",
        price: formatBRL(o.priceCents),
        distance: formatKm(o.distanceKm),
        ...(() => {
          const b = o.booking;
          if (b.lat == null || b.lng == null) return { fromPlaces: [], here: null };
          const point = { lat: b.lat, lng: b.lng };
          const fromPlaces = places.map((p, i) => ({ label: p.label || `Endereço ${i + 1}`, km: distanceKm(point, p) }));
          const nearest = Math.min(...fromPlaces.map((p) => p.km));
          return {
            fromPlaces: fromPlaces.map((p, i) => ({ label: `Endereço ${i + 1}${p.label && p.label !== `Endereço ${i + 1}` ? ` (${p.label})` : ""}`, distance: formatKm(p.km), nearest: p.km === nearest })),
            here: lat != null && lng != null ? formatKm(distanceKm(point, { lat, lng })) : null,
          };
        })(),
        // antes do aceite, só o bairro e a cidade
        place: [o.booking.addrDistrict, `${o.booking.addrCity}/${o.booking.addrUf}`].filter(Boolean).join(", "),
        notes: o.booking.notes,
        expiresAt: o.expiresAt.toISOString(),
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
