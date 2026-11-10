import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { Empty, PageTitle } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { isValidCpf, onlyDigits } from "@/lib/core/cpf";
import { maskCpf } from "@/lib/core/phone";
import { cpfHash, openCpf } from "@/lib/cpf";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { setBlocked } from "../actions";
import { ResetLinkButton, Reveal } from "../admin-bits";

export const metadata: Metadata = { title: "Usuários" };
const ROLE = { CLIENT: "Cliente", PRO: "Profissional", ADMIN: "Admin" } as const;

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = ((await searchParams).q ?? "").trim();
  const digits = onlyDigits(q);
  const users = await db.user.findMany({
    where: q ? (isValidCpf(digits) ? { cpfHash: cpfHash(digits) } : { name: { contains: q, mode: "insensitive" } }) : {},
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { clientBookings: true } }, pro: { select: { id: true, status: true } } },
  });
  return (
    <div className="space-y-4">
      <PageTitle title="Usuários" subtitle="Busque por nome ou CPF completo." />
      <form className="flex gap-2">
        <Input name="q" defaultValue={q} placeholder="Nome ou CPF" />
        <Button type="submit">Buscar</Button>
      </form>
      {users.length ? (
        <ul className="space-y-2">
          {users.map((u) => {
            const cpf = openCpf(u.cpfSealed);
            return (
              <li key={u.id}>
                <Card className="space-y-2 py-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{u.name}</span>
                    <Badge tone={u.role === "PRO" ? "primary" : u.role === "ADMIN" ? "warning" : "neutral"}>{ROLE[u.role]}</Badge>
                    {u.blockedAt && <Badge tone="danger">Bloqueado{u.blockReason ? `: ${u.blockReason}` : ""}</Badge>}
                  </div>
                  <p className="text-muted">CPF {cpf ? <Reveal userId={u.id} what="cpf" masked={maskCpf(cpf)} /> : "—"} · desde {u.createdAt.toLocaleDateString("pt-BR")} · {u._count.clientBookings} pedido(s) como cliente</p>
                  <div className="flex flex-wrap items-start gap-2">
                    <ResetLinkButton userId={u.id} />
                    {u.role !== "ADMIN" && (
                      <ActionForm action={setBlocked.bind(null, u.id, !u.blockedAt)} className="flex gap-2">
                        {!u.blockedAt && <Input name="reason" placeholder="Motivo do bloqueio" className="h-8 w-48" maxLength={300} />}
                        <SubmitButton size="sm" variant={u.blockedAt ? "outline" : "danger"} pendingText="…">{u.blockedAt ? "Desbloquear" : "Bloquear"}</SubmitButton>
                      </ActionForm>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title="Nenhum usuário encontrado" />
      )}
    </div>
  );
}
