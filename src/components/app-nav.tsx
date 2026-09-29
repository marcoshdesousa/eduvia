"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart3, BookOpen, LifeBuoy, CreditCard, GraduationCap, Home, Menu, PenLine, Settings, Shield, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/preparacoes", label: "Preparações", icon: BookOpen },
  { href: "/praticar", label: "Praticar", icon: Target },
  { href: "/professor", label: "Professor IA", icon: GraduationCap },
  { href: "/redacao", label: "Redação", icon: PenLine },
  { href: "/grupos", label: "Grupos", icon: Users },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard },
  { href: "/suporte", label: "Suporte", icon: LifeBuoy },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

const MOBILE = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/preparacoes", label: "Estudar", icon: BookOpen },
  { href: "/praticar", label: "Praticar", icon: Target },
  { href: "/professor", label: "Professor", icon: GraduationCap },
  { href: "/mais", label: "Mais", icon: Menu },
];

const PRACTICE = ["/praticar", "/revisoes", "/teste-rapido", "/simulados"];
const MORE = ["/mais", "/minha-ia", "/descanse", "/suporte", "/redacao", "/desempenho", "/assinatura", "/configuracoes", "/admin", "/grupos", "/perfil", "/u", "/notificacoes"];

function useActive() {
  const path = usePathname();
  const under = (p: string) => path === p || path.startsWith(p + "/");
  return (href: string) =>
    href === "/praticar" ? PRACTICE.some(under) : href === "/mais" ? MORE.some(under) : under(href) || (href === "/preparacoes" && under("/estudar"));
}

export function SideNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const isActive = useActive();
  const items = isAdmin ? [...ITEMS, { href: "/admin", label: "Admin", icon: Shield }] : ITEMS;
  return (
    <nav className="space-y-1">
      {items.map((i) => (
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
      <div className="grid grid-cols-5">
        {MOBILE.map((i) => (
          <Link key={i.href} href={i.href} className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", isActive(i.href) ? "text-primary" : "text-muted")}>
            <i.icon size={20} />
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
