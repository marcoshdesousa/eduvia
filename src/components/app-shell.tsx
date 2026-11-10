import Link from "next/link";
import { Bell } from "lucide-react";
import { Logo } from "@/components/brand";
import { BottomNav, TopNav, type NavItem } from "@/components/nav-links";
import { buttonClass } from "@/components/ui/button";
import { db } from "@/lib/db";
import { unreadCount } from "@/lib/notifications";
import type { CurrentUser } from "@/lib/session";

async function itemsFor(user: CurrentUser): Promise<NavItem[]> {
  if (user.role === "ADMIN") {
    return [
      { href: "/admin", label: "Resumo", icon: "LayoutDashboard" },
      { href: "/admin/profissionais", label: "Verificar", icon: "ShieldCheck" },
      { href: "/admin/usuarios", label: "Usuários", icon: "Users" },
      { href: "/admin/denuncias", label: "Denúncias", icon: "Flag" },
      { href: "/admin/suporte", label: "Suporte", icon: "LifeBuoy" },
      { href: "/conta", label: "Conta", icon: "Settings" },
    ];
  }
  if (user.role === "PRO") {
    const waiting = user.pro ? await db.booking.count({ where: { proId: user.pro.id, status: "WAITING_PRO" } }) : 0;
    return [
      { href: "/painel", label: "Painel", icon: "LayoutDashboard" },
      { href: "/pedidos", label: "Pedidos", icon: "CalendarCheck", badge: waiting },
      { href: "/painel/perfil", label: "Perfil", icon: "User" },
      { href: "/painel/assinatura", label: "Assinatura", icon: "CreditCard" },
      { href: "/conta", label: "Conta", icon: "Settings" },
    ];
  }
  return [
    { href: "/buscar", label: "Buscar", icon: "Search" },
    { href: "/pedidos", label: "Pedidos", icon: "CalendarCheck" },
    { href: "/favoritos", label: "Favoritos", icon: "Heart" },
    { href: "/conta", label: "Conta", icon: "User" },
  ];
}

/** Moldura das telas: topo com logo e avisos, menu de baixo no celular. Sem login, mostra Entrar/Cadastrar. */
export async function AppShell({ user, children }: { user: CurrentUser | null; children: React.ReactNode }) {
  const items = user ? await itemsFor(user) : [];
  const unread = user ? await unreadCount(user.id) : 0;
  return (
    <div className="min-h-dvh pb-20 md:pb-8">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Logo href={user ? (user.role === "ADMIN" ? "/admin" : user.role === "PRO" ? "/painel" : "/buscar") : "/"} />
          <div className="flex-1" />
          {user ? (
            <>
              <TopNav items={items} />
              <Link href="/notificacoes" className="relative rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-foreground" aria-label={`Notificações${unread ? ` (${unread} novas)` : ""}`}>
                <Bell size={20} />
                {unread > 0 && <span className="absolute right-1 top-1 min-w-4 rounded-full bg-danger px-1 text-center text-[10px] leading-4 text-white">{unread > 9 ? "9+" : unread}</span>}
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/entrar" className={buttonClass("ghost", "sm")}>Entrar</Link>
              <Link href="/cadastro" className={buttonClass("primary", "sm")}>Criar conta</Link>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
      {user && <BottomNav items={items} />}
    </div>
  );
}
