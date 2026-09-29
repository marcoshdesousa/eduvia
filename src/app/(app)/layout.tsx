import { Flame, Zap } from "lucide-react";
import { Logo } from "@/components/brand";
import { BottomNav, SideNav } from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme";
import { requireReadyUser } from "@/lib/session";
import { levelFromXp } from "@/lib/gamification";
import { isMockAi } from "@/lib/ai/client";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireReadyUser({ allowWithoutAccess: true });
  const { level } = levelFromXp(user.xp);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface p-4 md:flex">
        <Logo href="/inicio" />
        <div className="mt-8 flex-1">
          <SideNav />
        </div>
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate font-medium">@{user.handle}</span>
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
            <ThemeToggle />
          </div>
        </header>
        {isMockAi() && (
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-xs text-warning">
            Modo de demonstração: IA simulada (configure ANTHROPIC_API_KEY para textos e questões reais).
          </div>
        )}
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
