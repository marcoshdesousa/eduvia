import Link from "next/link";
import { ClipboardCheck, PenLine, RotateCcw, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { today } from "@/lib/core/dates";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Praticar" };

export default async function Page() {
  const user = await requireReadyUser();
  const day = today(user.timezone);
  const [due, errors, quick] = await Promise.all([
    db.reviewItem.count({ where: { userId: user.id, dueAt: { lte: day } } }),
    db.reviewItem.count({ where: { userId: user.id, inErrorBank: true } }),
    db.gameRun.count({ where: { userId: user.id, gameSlug: "teste-rapido" } }),
  ]);
  const cards = [
    { href: "/revisoes", icon: RotateCcw, title: "Revisões e banco de erros", text: "Veja as questões que você errou e aprenda a resposta certa com o seu material.", badge: due ? `${due} para hoje` : errors ? `${errors} no banco de erros` : null },
    { href: "/teste-rapido", icon: Zap, title: "Teste rápido", text: "10, 15 ou 20 perguntas cronometradas. Acertou, o bonequinho pula; errou, ele cai.", badge: quick ? `${quick} feito(s)` : null },
    { href: "/simulados", icon: ClipboardCheck, title: "Simulados", text: "Prova cronometrada com nota, desempenho por disciplina e gabarito comentado.", badge: null },
    { href: "/redacao", icon: PenLine, title: "Redação", text: "Tema sorteado, correção no estilo ENEM e teste de português.", badge: null },
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
