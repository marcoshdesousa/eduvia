import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { vapidPublicKey } from "@/lib/notifications";

const Sub = z.object({ endpoint: z.url(), keys: z.object({ p256dh: z.string().min(10), auth: z.string().min(5) }) });

/** Chave pública para o navegador inscrever o aparelho. */
export async function GET() {
  const key = await vapidPublicKey();
  return key ? NextResponse.json({ key }) : jsonError("Notificações indisponíveis.", 503);
}

/** Registra este aparelho para receber notificações. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const parsed = Sub.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Inscrição inválida");
  const { endpoint, keys } = parsed.data;
  await db.pushSubscription.upsert({
    where: { endpoint },
    create: { userId: user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent: req.headers.get("user-agent")?.slice(0, 200) },
    update: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { endpoint } = (await req.json().catch(() => ({}))) as { endpoint?: string };
  if (endpoint) await db.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
  return NextResponse.json({ ok: true });
}
