import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { RUBRICS } from "@/lib/core/essay";
import { formatDay } from "@/lib/core/dates";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Redação" };

export default async function Page() {
  const user = await requireReadyUser();
  const essays = await db.essay.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Redação</h1>
          <p className="text-sm text-muted">Tema sorteado, correção no estilo ENEM e teste de português, com os trechos marcados.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/redacao/nova" className={buttonClass("primary")}><Plus size={16} /> Nova redação</Link>
          <Link href="/redacao/nova?tipo=portugues" className={buttonClass("outline")}>Teste de português</Link>
        </div>
      </div>
      {!essays.length && (
        <Card className="text-center">
          <p className="font-medium">Nenhuma redação ainda</p>
          <p className="mt-1 text-sm text-muted">O tema é sorteado na hora. Escreva do zero, sem IA, e veja sua nota.</p>
          <Link href="/redacao/nova" className={buttonClass("primary", "md", "mt-4")}>Escrever redação</Link>
        </Card>
      )}
      <div className="space-y-3">
        {essays.map((e) => (
          <Link key={e.id} href={`/redacao/${e.id}`} className="block">
            <Card className="flex items-center gap-3 transition-colors hover:border-primary/50">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{e.theme}</div>
                <div className="text-xs text-muted">{RUBRICS[e.rubric].label} · {formatDay(e.createdAt)}</div>
              </div>
              {e.status === "EVALUATED" ? (
                <span className="text-lg font-bold">{e.score?.toLocaleString("pt-BR")}<span className="text-sm font-normal text-muted">/{e.maxScore}</span></span>
              ) : e.status === "ERROR" ? (
                <Badge tone="danger">Erro na correção</Badge>
              ) : (
                <Badge>Corrigindo</Badge>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
