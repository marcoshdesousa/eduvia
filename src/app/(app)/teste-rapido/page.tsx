import Link from "next/link";
import { Zap } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatDay } from "@/lib/core/dates";
import { parseQuickConfig, QUICK_TEST_SLUG } from "@/lib/quick-test";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { NewQuickTestForm } from "./new-quick-test-form";

export const metadata = { title: "Teste rápido" };

export default async function Page() {
  const user = await requireReadyUser();
  const [runs, total] = await Promise.all([
    db.gameRun.findMany({ where: { userId: user.id, gameSlug: QUICK_TEST_SLUG }, orderBy: { startedAt: "desc" }, take: 30 }),
    db.gameRun.count({ where: { userId: user.id, gameSlug: QUICK_TEST_SLUG } }),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Zap className="text-primary" /> Teste rápido</h1>
        <p className="text-sm text-muted">Questões reais do ENEM, cronometradas. O que você errar vai para o banco de erros; quando acertar depois, sai de lá.</p>
      </div>
      <NewQuickTestForm defaultName={`Teste ${total + 1}`} />
      {runs.length > 0 && (
        <Card>
          <CardTitle>Seus testes</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {runs.map((r) => {
              const cfg = parseQuickConfig(r.config);
              return (
                <li key={r.id}>
                  <Link href={`/teste-rapido/${r.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:text-primary">
                    <span className="min-w-0 flex-1 truncate font-medium">{r.name ?? "Teste rápido"}</span>
                    <span className="text-xs text-muted">{formatDay(r.startedAt)} · {cfg.count} perguntas · {cfg.seconds >= 60 ? `${cfg.seconds / 60} min` : `${cfg.seconds}s`}</span>
                    {r.endedAt ? <Badge tone={r.correct >= r.questionIds.length * 0.7 ? "success" : "neutral"}>{r.correct}/{r.questionIds.length} acertos</Badge> : <Badge tone="warning">Continuar</Badge>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
