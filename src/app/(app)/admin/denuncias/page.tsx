import Link from "next/link";
import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { Empty, PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { resolveReport } from "../actions";

export const metadata: Metadata = { title: "Denúncias" };

export default async function AdminReports({ searchParams }: { searchParams: Promise<{ todas?: string }> }) {
  await requireAdmin();
  const all = !!(await searchParams).todas;
  const reports = await db.report.findMany({
    where: all ? {} : { status: "OPEN" },
    orderBy: { createdAt: all ? "desc" : "asc" },
    take: 100,
    include: { reporter: { select: { name: true } }, target: { select: { name: true, role: true } } },
  });
  const reviewIds = reports.map((r) => r.reviewId).filter(Boolean) as string[];
  const reviews = new Map((await db.review.findMany({ where: { id: { in: reviewIds } } })).map((r) => [r.id, r]));
  return (
    <div className="space-y-4">
      <PageTitle title="Denúncias">
        <div className="flex gap-2 text-sm">
          <Link href="/admin/denuncias" className={cn(!all && "font-semibold text-primary")}>Abertas</Link>
          <Link href="/admin/denuncias?todas=1" className={cn(all && "font-semibold text-primary")}>Todas</Link>
        </div>
      </PageTitle>
      {reports.length ? (
        <ul className="space-y-3">
          {reports.map((r) => {
            const rev = r.reviewId ? reviews.get(r.reviewId) : null;
            return (
              <li key={r.id}>
                <Card className="space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{r.reason}</strong>
                    <Badge tone={r.status === "OPEN" ? "warning" : r.status === "RESOLVED" ? "success" : "neutral"}>{r.status === "OPEN" ? "Aberta" : r.status === "RESOLVED" ? "Resolvida" : "Arquivada"}</Badge>
                    <span className="text-xs text-muted">{r.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                  <p>De: {r.reporter.name} · Sobre: {r.target ? `${r.target.name} (${r.target.role === "PRO" ? "profissional" : "cliente"})` : "—"}</p>
                  {r.details && <p className="rounded bg-surface-2 p-2">{r.details}</p>}
                  {rev && <p className="text-muted">Avaliação denunciada: {rev.stars}★ “{rev.comment ?? ""}” {rev.hiddenAt && "(escondida)"}</p>}
                  <div className="flex flex-wrap gap-3 text-xs">
                    {r.bookingId && <Link href={`/pedidos/${r.bookingId}`} className="text-primary hover:underline">Ver contratação</Link>}
                    {r.target && <Link href={`/admin/usuarios?q=${encodeURIComponent(r.target.name)}`} className="text-primary hover:underline">Ver usuário (bloquear)</Link>}
                  </div>
                  {r.status === "OPEN" ? (
                    <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                      <ActionForm action={resolveReport.bind(null, r.id, "RESOLVED")} className="flex flex-1 flex-wrap items-center gap-2">
                        <Input name="resolution" placeholder="O que foi feito (o denunciante vê)" className="h-8 min-w-48 flex-1" maxLength={500} />
                        {rev && !rev.hiddenAt && <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="hideReview" /> esconder a avaliação</label>}
                        <SubmitButton size="sm" pendingText="…">Resolver</SubmitButton>
                      </ActionForm>
                      <ActionForm action={resolveReport.bind(null, r.id, "DISMISSED")}>
                        <SubmitButton size="sm" variant="ghost" pendingText="…">Arquivar</SubmitButton>
                      </ActionForm>
                    </div>
                  ) : (
                    r.resolution && <p className="text-xs text-muted">Resolução: {r.resolution}</p>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title="Nenhuma denúncia aberta" />
      )}
    </div>
  );
}
