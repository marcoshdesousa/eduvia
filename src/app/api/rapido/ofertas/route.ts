import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { db } from "@/lib/db";
import { categoryLabel, formatBRL, formatKm, qtyLabel } from "@/lib/domain";

/** Chamados do Contrate rápido tocando agora para este prestador (a tela pergunta a cada poucos segundos). */
export async function GET() {
  const { user, error } = await apiUser();
  if (error) return error;
  if (!user.provider) return NextResponse.json({ on: false, offers: [] });
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
        qty: qtyLabel(o.booking.unit, o.booking.quantity),
        price: formatBRL(o.priceCents),
        distance: formatKm(o.distanceKm),
        // antes do aceite, só o bairro e a cidade
        place: [o.booking.addrDistrict, `${o.booking.addrCity}/${o.booking.addrUf}`].filter(Boolean).join(", "),
        notes: o.booking.notes,
        expiresAt: o.expiresAt.toISOString(),
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
