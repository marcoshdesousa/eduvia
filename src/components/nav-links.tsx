"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarCheck, CreditCard, Heart, LayoutDashboard, LifeBuoy, Search, Settings, ShieldCheck, User, Users, Flag, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { Bell, CalendarCheck, CreditCard, Heart, LayoutDashboard, LifeBuoy, Search, Settings, ShieldCheck, User, Users, Flag, ClipboardList };
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS; badge?: number };

const active = (path: string, href: string) => (href === "/admin" || href === "/painel" ? path === href : path === href || path.startsWith(`${href}/`));

/** Menu de baixo no celular (fixo) e lateral/topo no computador. */
export function BottomNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Menu principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const on = active(path, it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", on ? "text-primary" : "text-muted")} aria-current={on ? "page" : undefined}>
                <Icon size={21} strokeWidth={on ? 2.4 : 1.9} />
                {it.label}
                {!!it.badge && <span className="absolute right-[22%] top-1 min-w-4 rounded-full bg-danger px-1 text-[10px] leading-4 text-white">{it.badge > 9 ? "9+" : it.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Menu" className="hidden items-center gap-1 md:flex">
      {items.map((it) => {
        const Icon = ICONS[it.icon];
        const on = active(path, it.href);
        return (
          <Link key={it.href} href={it.href} className={cn("relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium", on ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground")}>
            <Icon size={16} />
            {it.label}
            {!!it.badge && <span className="rounded-full bg-danger px-1.5 text-[10px] leading-4 text-white">{it.badge > 9 ? "9+" : it.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
