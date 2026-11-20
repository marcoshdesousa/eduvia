import Link from "next/link";
import { Bell, ClipboardList } from "lucide-react";
import { Logo } from "@/components/brand";
import { PushAutoSubscribe } from "@/components/app-gate";
import { BottomNav, TopNav, type NavItem } from "@/components/nav-links";
import { QuickRinger } from "@/components/quick-ringer";
import { buttonClass } from "@/components/ui/button";
import { unreadMessages } from "@/lib/chat";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES } from "@/lib/domain";
import { unreadCount } from "@/lib/notifications";
import { getMode, type CurrentUser, type Mode } from "@/lib/session";

async function itemsFor(user: CurrentUser, mode: Mode): Promise<NavItem[]> {
  if (user.role === "ADMIN") {
    return [
      { href: "/admin", label: "Resumo", icon: "LayoutDashboard" },
      { href: "/admin/prestadores", label: "Prestadores", icon: "ShieldCheck" },
      { href: "/admin/usuarios", label: "Usuários", icon: "Users" },
      { href: "/admin/denuncias", label: "Denúncias", icon: "Flag" },
      { href: "/admin/suporte", label: "Suporte", icon: "LifeBuoy" },
      { href: "/conta", label: "Conta", icon: "Settings" },
    ];
  }
  const messages = await unreadMessages(user, mode === "trabalho" ? "pro" : "client");
  if (mode === "trabalho") {
    return [
      { href: "/painel", label: "Minha área", icon: "Briefcase" },
      { href: "/painel/agenda", label: "Agenda", icon: "CalendarDays" },
      { href: "/painel/financeiro", label: "Financeiro", icon: "Wallet" },
      { href: "/mensagens", label: "Mensagens", icon: "MessageCircle", badge: messages },
      { href: "/conta", label: "Conta", icon: "User" },
    ];
  }
  return [
    { href: "/inicio", label: "Início", icon: "Home" },
    { href: "/rapido", label: "Rápido", icon: "Zap", big: true },
    { href: "/mensagens", label: "Mensagens", icon: "MessageCircle", badge: messages },
    { href: "/conta", label: "Conta", icon: "User" },
  ];
}

/** Moldura das telas: topo com logo, Pedidos e avisos; menu de baixo no celular. Sem login, mostra Entrar/Criar conta. */
export async function AppShell({ user, children }: { user: CurrentUser | null; children: React.ReactNode }) {
  const mode = await getMode(user);
  const items = user ? await itemsFor(user, mode) : [];
  const unread = user ? await unreadCount(user.id) : 0;
  const pending =
    user && user.role !== "ADMIN"
      ? mode === "trabalho" && user.provider
        ? await db.booking.count({ where: { proId: user.provider.id, status: { in: ["WAITING_PRO", ...ACTIVE_STATUSES] } } })
        : await db.booking.count({ where: { clientId: user.id, status: { in: ["PROPOSED", "SEARCHING", "WAITING_PRO", ...ACTIVE_STATUSES] } } })
      : 0;
  return (
    <div className="min-h-dvh pb-24 md:pb-8">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          <Logo href={user ? (user.role === "ADMIN" ? "/admin" : mode === "trabalho" ? "/painel" : "/inicio") : "/"} />
          {mode === "trabalho" && <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary sm:inline">modo trabalho</span>}
          <div className="flex-1" />
          {user ? (
            <>
              <TopNav items={items} />
              {user.role !== "ADMIN" && (
                <Link href="/pedidos" className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold hover:bg-surface-2" aria-label={`Pedidos${pending ? ` (${pending} em andamento)` : ""}`}>
                  <ClipboardList size={17} className="text-primary" /> Pedidos
                  {pending > 0 && <span className="min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 text-primary-foreground">{pending > 9 ? "9+" : pending}</span>}
                </Link>
              )}
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
      {user?.provider && <QuickRinger />}
      {user && <PushAutoSubscribe />}
    </div>
  );
}
