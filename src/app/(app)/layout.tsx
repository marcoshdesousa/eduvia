import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Flame, Zap } from "lucide-react";
import { Logo } from "@/components/brand";
import { BottomNav, SideNav } from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme";
import { requireReadyUser } from "@/lib/session";
import { levelFromXp } from "@/lib/gamification";
import { isMockAi } from "@/lib/ai/client";
import { getAccess } from "@/lib/billing";
import { AccessBanner } from "@/components/access-banner";
import { unreadCount } from "@/lib/notifications";
import { RegisterServiceWorker } from "@/components/push-settings";
import { NotificationBell } from "@/components/notification-bell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireReadyUser();
  const { level } = levelFromXp(user.xp);
  const [access, unread] = await Promise.all([getAccess(user), unreadCount(user.id)]);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface p-4 md:flex">
        <div className="flex items-center justify-between">
          <Logo href="/inicio" />
          <NotificationBell count={unread} />
        </div>
        <div className="mt-8 flex-1">
          <SideNav isAdmin={user.isAdmin} />
        </div>
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <Link href="/perfil" className="flex min-w-0 items-center gap-2 font-medium hover:text-primary">
              <Avatar id={user.avatar} name={user.name} size={28} />
              <span className="truncate">@{user.handle}</span>
            </Link>
            <span className="text-xs text-muted">nível {level}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Flame size={14} className="text-warning" />{user.currentStreak} dia(s)</span>
            <span className="inline-flex items-center gap-1"><Zap size={14} className="text-primary" />{user.xp} XP</span>
          </div>
          <ThemeToggle withLabel />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <Logo href="/inicio" />
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Flame size={14} className="text-warning" />{user.currentStreak}</span>
            <span className="inline-flex items-center gap-1"><Zap size={14} className="text-primary" />{user.xp}</span>
            <NotificationBell count={unread} />
            <Link href="/perfil" aria-label="Meu perfil"><Avatar id={user.avatar} name={user.name} size={28} /></Link>
          </div>
        </header>
        <AccessBanner access={access} />
        {isMockAi() && (
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-xs text-warning">
            Modo de demonstração: IA simulada (AI_MODE=mock). Textos e questões não vêm do Gemini.
          </div>
        )}
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12">{children}</main>
      </div>
      <BottomNav />
      <RegisterServiceWorker />
    </div>
  );
}
