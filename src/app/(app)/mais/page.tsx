import Link from "next/link";
import { Award, Gift, BarChart3, ChevronRight, LifeBuoy, Smartphone, Users, CreditCard, PenLine, RotateCcw, Settings, Shield } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ThemeToggle } from "@/components/theme";

export const metadata = { title: "Mais" };

export default async function Page() {
  const user = await requireReadyUser();
  const [invites, replies] = await Promise.all([
    db.groupInvite.count({ where: { inviteeId: user.id, status: "PENDING" } }),
    db.supportMessage.count({ where: { fromStaff: true, readAt: null, ticket: { userId: user.id } } }),
  ]);
  const badge: Record<string, number> = { "/grupos": invites, "/suporte": replies };
  const links = [
    { href: "/instalar", label: "Baixar o app do Eduvia", icon: Smartphone },
    { href: "/assinatura#indicacao", label: "Indique e pague menos", icon: Gift },
    { href: "/perfil", label: "Meu perfil e conquistas", icon: Award },
    { href: "/grupos", label: "Grupos de estudo", icon: Users },
    { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
    { href: "/redacao", label: "Redação", icon: PenLine },
    { href: "/revisoes", label: "Revisões e banco de erros", icon: RotateCcw },
    { href: "/assinatura", label: "Assinatura", icon: CreditCard },
    { href: "/suporte", label: "Suporte (fale com a gente)", icon: LifeBuoy },
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
              {!!badge[l.href] && <span className="grid min-w-5 place-items-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">{badge[l.href]}</span>}
              <ChevronRight size={16} className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <ThemeToggle withLabel />
    </div>
  );
}
