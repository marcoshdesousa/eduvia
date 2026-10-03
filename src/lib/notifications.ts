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
  | "SUPPORT_MESSAGE"
  | "AI_ALERT";

/**
 * Chaves do push (VAPID). Usa VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY do ambiente quando as duas existem;
 * senão gera um par uma única vez e guarda no banco (SiteSetting "vapid"), sem precisar configurar nada.
 */
let vapid: Promise<{ publicKey: string } | null> | null = null;

async function loadVapid(): Promise<{ publicKey: string } | null> {
  let pair: { publicKey: string; privateKey: string } | null = null;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) pair = { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY };
  else {
    const saved = await db.siteSetting.findUnique({ where: { key: "vapid" } });
    if (saved) pair = JSON.parse(saved.value);
    else {
      const fresh = webpush.generateVAPIDKeys();
      // se dois processos gerarem ao mesmo tempo, fica o primeiro que gravou
      await db.siteSetting.create({ data: { key: "vapid", value: JSON.stringify(fresh) } }).catch(() => {});
      pair = JSON.parse((await db.siteSetting.findUniqueOrThrow({ where: { key: "vapid" } })).value);
    }
  }
  // o "subject" precisa ser https: ou mailto: (localhost em http não serve)
  const candidates = [process.env.VAPID_SUBJECT, appUrl(), "mailto:suporte@eduvia.app"];
  const subject = candidates.find((c) => c && /^(https:|mailto:)/.test(c))!;
  try {
    webpush.setVapidDetails(subject, pair!.publicKey, pair!.privateKey);
    return { publicKey: pair!.publicKey };
  } catch (e) {
    console.error("[push] chaves VAPID inválidas:", (e as Error).message);
    return null;
  }
}

function ensureVapid() {
  vapid ??= loadVapid().catch((e) => {
    console.error("[push] não foi possível preparar as chaves:", e);
    vapid = null; // tenta de novo na próxima vez
    return null;
  });
  return vapid;
}

export async function pushConfigured() {
  return !!(await ensureVapid());
}

/** Chave pública para o navegador inscrever o aparelho. */
export async function vapidPublicKey() {
  return (await ensureVapid())?.publicKey ?? null;
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
  if (!(await pushConfigured())) return 0;
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
