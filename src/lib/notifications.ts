// Avisos dentro do app (sininho) + push no celular (Web Push, chaves VAPID geradas e guardadas sozinhas).
import webpush from "web-push";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";

let vapid: Promise<{ publicKey: string; privateKey: string } | null> | null = null;

async function ensureVapid() {
  vapid ??= (async () => {
    let pub = process.env.VAPID_PUBLIC_KEY;
    let priv = process.env.VAPID_PRIVATE_KEY;
    if (!pub || !priv) {
      const row = await db.platformSetting.findUnique({ where: { key: "vapid" } });
      const saved = row?.value as { publicKey: string; privateKey: string } | undefined;
      if (saved?.publicKey && saved.privateKey) ({ publicKey: pub, privateKey: priv } = saved);
      else {
        const keys = webpush.generateVAPIDKeys();
        await db.platformSetting.upsert({ where: { key: "vapid" }, create: { key: "vapid", value: { ...keys } }, update: {} });
        // se outro processo gravou primeiro, vale a dele
        const again = (await db.platformSetting.findUnique({ where: { key: "vapid" } }))!.value as unknown as typeof keys;
        ({ publicKey: pub, privateKey: priv } = again);
      }
    }
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || `mailto:suporte@${new URL(appUrl()).hostname}`, pub!, priv!);
    return { publicKey: pub!, privateKey: priv! };
  })().catch((e) => {
    console.error("[push] não foi possível preparar as chaves:", e);
    vapid = null;
    return null;
  });
  return vapid;
}

export async function vapidPublicKey() {
  return (await ensureVapid())?.publicKey ?? null;
}

/** Cria o aviso (ignora repetidos pelo dedupeKey) e manda push para os aparelhos da pessoa. */
export async function notify(userId: string, n: { title: string; body?: string; href?: string; dedupeKey?: string }) {
  try {
    await db.notification.create({ data: { userId, title: n.title, body: n.body, href: n.href, dedupeKey: n.dedupeKey } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return;
    throw e;
  }
  void sendPush(userId, { title: n.title, body: n.body ?? "", href: n.href ?? "/notificacoes" }).catch((e) => console.error("[push]", e));
}

export async function sendPush(userId: string, payload: { title: string; body: string; href: string }) {
  if (process.env.NODE_ENV === "test" || !(await ensureVapid())) return 0;
  const subs = await db.pushSubscription.findMany({ where: { userId } });
  let sent = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 60 * 60 * 6 });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) await db.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        else console.error("[push]", code, (e as Error).message);
      }
    }),
  );
  return sent;
}

export const unreadCount = (userId: string) => db.notification.count({ where: { userId, readAt: null } });
