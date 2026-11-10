import Link from "next/link";
import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { Empty, PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notificações" };

export default async function NotificationsPage() {
  const user = await requireUser("/notificacoes");
  const list = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 60 });
  await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  return (
    <div className="space-y-4">
      <PageTitle title="Notificações" />
      {list.length ? (
        <ul className="space-y-2">
          {list.map((n) => (
            <li key={n.id}>
              <Link href={n.href ?? "#"}>
                <Card className={cn("space-y-0.5 py-3 transition hover:border-primary", !n.readAt && "border-primary/40 bg-primary/5")}>
                  <p className="font-medium">{n.title}</p>
                  {n.body && <p className="text-sm text-muted">{n.body}</p>}
                  <p className="text-xs text-muted">{n.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={<Bell />} title="Nenhuma notificação" />
      )}
    </div>
  );
}
