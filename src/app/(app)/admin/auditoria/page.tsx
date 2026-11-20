import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AdminAudit() {
  await requireAdmin();
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { admin: { select: { name: true } } } });
  return (
    <div className="space-y-4">
      <PageTitle title="Auditoria" subtitle="Operações administrativas sensíveis (quem, o quê, quando)." />
      <Card>
        <ul className="divide-y divide-border text-sm">
          {logs.map((l) => (
            <li key={l.id} className="py-2">
              <span className="font-mono text-xs">{l.action}</span> · {l.targetType} {l.targetId?.slice(0, 8) ?? ""}
              <span className="block text-xs text-muted">{l.createdAt.toLocaleString("pt-BR")} · {l.admin?.name ?? "sistema"}{l.details ? ` · ${JSON.stringify(l.details).slice(0, 160)}` : ""}</span>
            </li>
          ))}
          {!logs.length && <li className="py-2 text-muted">Nada registrado ainda.</li>}
        </ul>
      </Card>
    </div>
  );
}
