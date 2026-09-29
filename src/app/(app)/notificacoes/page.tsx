import Link from "next/link";
import { Award, Bell, CalendarClock, CreditCard, Share2, UserPlus, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatDateTime } from "@/lib/core/dates";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Notificações" };

const ICON: Record<string, typeof Bell> = {
  STUDY_REMINDER: CalendarClock,
  GROUP_INVITE: UserPlus,
  INVITE_ACCEPTED: Users,
  GROUP_SHARE: Share2,
  ACHIEVEMENT: Award,
  PLAN_EXPIRING: CreditCard,
  TRIAL_ENDING: CreditCard,
};

export default async function Page() {
  const user = await requireReadyUser();
  const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 60 });
  // ao abrir a central, tudo conta como lido (o destaque vale só para esta visita)
  await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Notificações</h1>
      {!items.length && <Card className="text-center text-sm text-muted">Nenhuma notificação ainda.</Card>}
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {items.map((n) => {
          const Icon = ICON[n.type] ?? Bell;
          const body = (
            <div className={cn("flex gap-3 p-4", !n.readAt && "bg-primary/5")}>
              <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm", !n.readAt && "font-semibold")}>{n.title}</div>
                {n.body && <div className="text-sm text-muted">{n.body}</div>}
                <div className="mt-1 text-xs text-muted">{formatDateTime(n.createdAt, user.timezone)}</div>
              </div>
              {!n.readAt && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
            </div>
          );
          return <li key={n.id}>{n.href ? <Link href={n.href} className="block hover:bg-surface-2">{body}</Link> : body}</li>;
        })}
      </ul>
    </div>
  );
}
