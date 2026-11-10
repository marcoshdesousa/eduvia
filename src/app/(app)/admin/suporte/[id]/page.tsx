import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { adminReply } from "../../actions";
import { ResetLinkButton } from "../../admin-bits";

export const metadata: Metadata = { title: "Chamado (admin)" };

export default async function AdminTicket({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const t = await db.supportTicket.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, role: true } }, messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  return (
    <div className="space-y-4">
      <Link href="/admin/suporte" className="text-sm text-muted hover:text-foreground">← Chamados</Link>
      <PageTitle title={t.subject} subtitle={`${t.user.name} (${t.user.role === "PRO" ? "profissional" : t.user.role === "ADMIN" ? "admin" : "cliente"})`} />
      <div className="flex flex-wrap gap-2 text-sm">
        {t.bookingId && <Link href={`/pedidos/${t.bookingId}`} className="text-primary hover:underline">Ver contratação</Link>}
        <Link href={`/admin/usuarios?q=${encodeURIComponent(t.user.name)}`} className="text-primary hover:underline">Ver usuário</Link>
      </div>
      {t.subject === "Recuperar senha" && (
        <Card className="space-y-2 border-warning/40 bg-warning/5 text-sm">
          <p>Confirme a identidade pelo contato informado (nome, CPF). Depois gere o link e envie para a pessoa. Ele vale 24 horas, uma vez só.</p>
          <ResetLinkButton userId={t.user.id} />
        </Card>
      )}
      <div className="space-y-2">
        {t.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.fromAdmin ? "justify-end" : "justify-start")}>
            <Card className={cn("max-w-[85%] py-2", m.fromAdmin && "bg-surface-2")}>
              <p className="text-xs font-medium text-muted">{m.fromAdmin ? "Suporte" : t.user.name.split(" ")[0]} · {m.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
              <p className="whitespace-pre-wrap text-sm">{m.text}</p>
            </Card>
          </div>
        ))}
      </div>
      {t.status !== "CLOSED" && (
        <Card>
          <ActionForm action={adminReply.bind(null, t.id)} className="space-y-3" resetOnOk>
            <Textarea name="text" maxLength={3000} placeholder="Resposta do suporte" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="close" /> Encerrar o chamado</label>
            <SubmitButton pendingText="Enviando…">Enviar</SubmitButton>
          </ActionForm>
        </Card>
      )}
    </div>
  );
}
