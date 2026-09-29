"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CreditCard, Home, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/preparacoes", label: "Preparações", icon: BookOpen },
  { href: "/revisoes", label: "Revisões", icon: RotateCcw },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard, desktopOnly: true },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

function useActive() {
  const path = usePathname();
  return (href: string) => path === href || path.startsWith(href + "/") || (href === "/preparacoes" && path.startsWith("/estudar"));
}

export function SideNav() {
  const isActive = useActive();
  return (
    <nav className="space-y-1">
      {ITEMS.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(i.href) ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
          )}
        >
          <i.icon size={18} />
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const isActive = useActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {ITEMS.filter((i) => !i.desktopOnly).map((i) => (
          <Link key={i.href} href={i.href} className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", isActive(i.href) ? "text-primary" : "text-muted")}>
            <i.icon size={20} />
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
