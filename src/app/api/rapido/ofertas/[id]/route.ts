import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { BookingError, acceptOffer, declineOffer } from "@/lib/bookings";

/** Aceitar ou recusar um chamado. O primeiro que aceitar leva. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  try {
    if (action === "aceitar") return NextResponse.json({ bookingId: await acceptOffer(id, user.id) });
    await declineOffer(id, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof BookingError) return jsonError(e.message, 409);
    throw e;
  }
}
