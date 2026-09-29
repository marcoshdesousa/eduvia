import Link from "next/link";
import { ClipboardCheck, Gamepad2, PenLine, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { today } from "@/lib/core/dates";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Praticar" };

export default async function Page() {
  const user = await requireReadyUser();
  const day = today(user.timezone);
  const [due, errors, best] = await Promise.all([
    db.reviewItem.count({ where: { userId: user.id, dueAt: { lte: day } } }),
    db.reviewItem.count({ where: { userId: user.id, inErrorBank: true } }),
    db.gameRun.aggregate({ _max: { score: true }, where: { userId: user.id, gameSlug: "cobrinha" } }),
  ]);
  const cards = [
    { href: "/revisoes", icon: RotateCcw, title: "Revisões e banco de erros", text: "Refaça as questões que você errou e as que vencem hoje.", badge: due ? `${due} para hoje` : errors ? `${errors} no banco de erros` : null },
    { href: "/jogos", icon: Gamepad2, title: "Jogos", text: "Jogo da cobrinha: responda rápido antes que ela te alcance.", badge: best._max.score ? `Recorde: ${best._max.score}` : null },
    { href: "/simulados", icon: ClipboardCheck, title: "Simulados", text: "Prova cronometrada com nota, desempenho por disciplina e gabarito comentado.", badge: null },
    { href: "/redacao", icon: PenLine, title: "Redação", text: "Escreva e receba a correção com os trechos marcados.", badge: null },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Praticar</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <div className="flex items-start justify-between gap-2">
                <c.icon className="text-primary" size={24} />
                {c.badge && <Badge tone="primary">{c.badge}</Badge>}
              </div>
              <h2 className="mt-3 font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-muted">{c.text}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
