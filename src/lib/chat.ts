import { db } from "@/lib/db";
import { roleIn } from "@/lib/bookings";
import { chatOpen } from "@/lib/domain";

/** Contratação + papel da pessoa + o que ela pode fazer no chat (null se não participa). */
export async function chatAccess(bookingId: string, user: { id: string; role: string }) {
  const b = await db.booking.findUnique({ where: { id: bookingId }, include: { pro: { select: { userId: true } } } });
  if (!b) return null;
  const as = roleIn(b, user);
  if (!as) return null;
  const open = chatOpen(b);
  const other = as === "CLIENT" ? b.pro.userId : as === "PRO" ? b.clientId : null;
  const blocked = other ? !!(await db.block.findFirst({ where: { OR: [{ blockerId: user.id, blockedId: other }, { blockerId: other, blockedId: user.id }] } })) : false;
  return { booking: b, as, other, read: open.read, write: open.write && as !== "ADMIN" && !blocked, blocked };
}

/** Texto limpo: sem caracteres de controle e com tamanho máximo. */
export const cleanText = (t: string) => t.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, 2000);
