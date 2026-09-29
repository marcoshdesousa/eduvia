import Link from "next/link";
import { BarChart3, ChevronRight, CreditCard, PenLine, RotateCcw, Settings, Shield } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { ThemeToggle } from "@/components/theme";

export const metadata = { title: "Mais" };

export default async function Page() {
  const user = await requireReadyUser();
  const links = [
    { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
    { href: "/redacao", label: "Redação", icon: PenLine },
    { href: "/revisoes", label: "Revisões e banco de erros", icon: RotateCcw },
    { href: "/assinatura", label: "Assinatura", icon: CreditCard },
    { href: "/configuracoes", label: "Ajustes", icon: Settings },
    ...(user.isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mais</h1>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex items-center gap-3 p-4 hover:bg-surface-2">
              <l.icon size={18} className="text-primary" />
              <span className="flex-1 font-medium">{l.label}</span>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <ThemeToggle withLabel />
    </div>
  );
}
