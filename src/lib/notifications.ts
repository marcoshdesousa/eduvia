// Notificações: ficam na central do app e, se o aluno ativou, chegam por push no celular/navegador.
import webpush from "web-push";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { Prisma } from "@/generated/prisma/client";

export type NotificationType =
  | "STUDY_REMINDER"
  | "GROUP_INVITE"
  | "INVITE_ACCEPTED"
  | "GROUP_SHARE"
  | "TOURNAMENT"
  | "NUDGE"
  | "ACHIEVEMENT"
  | "PLAN_EXPIRING"
  | "TRIAL_ENDING"
  | "SUPPORT_REPLY"
  | "SUPPORT_MESSAGE";

let vapidReady: boolean | null = null;
export function pushConfigured() {
  if (vapidReady === null) {
    const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
    vapidReady = !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
    if (vapidReady) {
      // o "subject" precisa ser https: ou mailto: (localhost em http não serve)
      const candidates = [process.env.VAPID_SUBJECT, appUrl(), "mailto:suporte@eduvia.app"];
      const subject = candidates.find((c) => c && /^(https:|mailto:)/.test(c))!;
      try {
        webpush.setVapidDetails(subject, VAPID_PUBLIC_KEY!, VAPID_PRIVATE_KEY!);
      } catch (e) {
        console.error("[push] chaves VAPID inválidas:", (e as Error).message);
        vapidReady = false;
      }
    }
  }
  return vapidReady;
}

/** Chave pública para o navegador; só existe quando o push está configurado de verdade (pública + privada). */
export function vapidPublicKey() {
  return pushConfigured() ? (process.env.VAPID_PUBLIC_KEY ?? null) : null;
}

/** Cria a notificação (ignorando repetidas pelo dedupeKey) e envia push para os aparelhos do aluno. */
export async function notify(
  userId: string,
  n: { type: NotificationType; title: string; body?: string; href?: string; dedupeKey?: string },
  opts: { push?: boolean } = {},
) {
  let created;
  try {
    created = await db.notification.create({ data: { userId, type: n.type, title: n.title, body: n.body, href: n.href, dedupeKey: n.dedupeKey } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return null;
    throw e;
  }
  if (opts.push !== false) await sendPush(userId, { title: n.title, body: n.body ?? "", href: n.href ?? "/notificacoes" });
  return created;
}

export async function sendPush(userId: string, payload: { title: string; body: string; href: string }) {
  if (!pushConfigured()) return 0;
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

export async function unreadCount(userId: string) {
  return db.notification.count({ where: { userId, readAt: null } });
}
