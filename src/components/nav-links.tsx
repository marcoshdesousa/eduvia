"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Briefcase, CalendarCheck, CalendarDays, CreditCard, Flag, Heart, Home, LayoutDashboard, LifeBuoy, MessageCircle, Search, Settings, ShieldCheck, User, Users, ClipboardList, Wallet, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { Bell, Briefcase, CalendarCheck, CalendarDays, CreditCard, Flag, Heart, Home, LayoutDashboard, LifeBuoy, MessageCircle, Search, Settings, ShieldCheck, User, Users, ClipboardList, Wallet, Zap };
/** `big`: botão destacado no meio do menu (o Contrate rápido). */
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS; badge?: number; big?: boolean };

const matches = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
/** Fica marcado o item mais específico que bate com a página (ex.: /painel/agenda marca "Agenda", não "Minha área"). */
const pick = (path: string, items: NavItem[]) => items.filter((i) => matches(path, i.href)).sort((a, b) => b.href.length - a.href.length)[0]?.href;

/** Menu de baixo no celular (fixo) e lateral/topo no computador. */
export function BottomNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  const current = pick(path, items);
  return (
    <nav aria-label="Menu principal" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] md:hidden">
      <ul className="mx-auto grid max-w-lg items-end rounded-[28px] border border-white/10 bg-tech/90 px-1 py-1.5 shadow-[0_18px_50px_-14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const on = current === it.href;
          if (it.big)
            return (
              <li key={it.href} className="flex justify-center">
                <Link href={it.href} aria-current={on ? "page" : undefined} className="dp-ring -mt-8 flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-[26px] border-4 border-background bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 text-[11px] font-extrabold text-[#2a1600] shadow-[0_12px_30px_-6px_rgba(245,158,11,0.75)] transition active:scale-95">
                  <Icon size={26} strokeWidth={2.6} className="fill-white/60" />
                  {it.label}
                </Link>
              </li>
            );
          return (
            <li key={it.href}>
              <Link href={it.href} className={cn("relative flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold transition active:scale-95", on ? "text-[#2ee6a6]" : "text-white/55")} aria-current={on ? "page" : undefined}>
                <span className={cn("grid h-8 w-14 place-items-center rounded-full transition-colors", on ? "bg-[#2ee6a6]/15 shadow-[0_0_18px_-2px_rgba(46,230,166,0.55)]" : "")}>
                  <Icon size={21} strokeWidth={on ? 2.5 : 1.9} />
                </span>
                {it.label}
                {!!it.badge && <span className="absolute right-[18%] top-0 min-w-[18px] rounded-full bg-danger px-1 text-center text-[10px] font-bold leading-[18px] text-white ring-2 ring-tech">{it.badge > 9 ? "9+" : it.badge}</span>}
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
  const current = pick(path, items);
  return (
    <nav aria-label="Menu" className="hidden items-center gap-1 md:flex">
      {items.map((it) => {
        const Icon = ICONS[it.icon];
        const on = current === it.href;
        return (
          <Link key={it.href} href={it.href} className={cn("relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition", it.big ? "bg-gradient-to-r from-amber-300 to-accent font-bold text-brand-ink shadow-md shadow-accent/30" : on ? "bg-primary/10 text-primary" : "text-muted hover:bg-foreground/5 hover:text-foreground")}>
            <Icon size={16} />
            {it.label}
            {!!it.badge && <span className="rounded-full bg-danger px-1.5 text-[10px] leading-4 text-white">{it.badge > 9 ? "9+" : it.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
