import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell({ count }: { count: number }) {
  return (
    <Link href="/notificacoes" className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground" aria-label={count ? `Notificações: ${count} não lidas` : "Notificações"}>
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold leading-4 text-white">{count > 9 ? "9+" : count}</span>
      )}
    </Link>
  );
}
