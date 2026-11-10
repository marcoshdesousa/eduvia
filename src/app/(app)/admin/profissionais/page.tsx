import Link from "next/link";
import type { Metadata } from "next";
import type { ProStatus } from "@/generated/prisma/enums";
import { ActionForm } from "@/components/action-form";
import { Empty, PageTitle, ProPhoto, ProStatusBadge } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { PRO_STATUS_LABEL, ageOn, formatBRL, serviceLabel } from "@/lib/domain";
import { maskCpf } from "@/lib/core/phone";
import { openCpf } from "@/lib/cpf";
import { proPhotoUrl } from "@/lib/pros";
import { requireAdmin } from "@/lib/session";
import { subscriptionActive } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { setProStatus } from "../actions";
import { GrantButton, Reveal } from "../admin-bits";

export const metadata: Metadata = { title: "Verificação de profissionais" };
const FILTERS: ProStatus[] = ["PENDING", "INCOMPLETE", "APPROVED", "REJECTED", "SUSPENDED"];

export default async function AdminPros({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = FILTERS.includes(sp.status as ProStatus) ? (sp.status as ProStatus) : "PENDING";
  const pros = await db.professionalProfile.findMany({
    where: { status },
    orderBy: { updatedAt: "asc" },
    take: 50,
    include: { user: true, areas: true, subscription: true, approvals: { orderBy: { createdAt: "desc" }, take: 3 } },
  });
  return (
    <div className="space-y-4">
      <PageTitle title="Verificação de profissionais" subtitle="Só aprovados e com assinatura em dia aparecem na vitrine." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link key={f} href={`/admin/profissionais?status=${f}`} className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-sm", f === status ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted")}>{PRO_STATUS_LABEL[f]}</Link>
        ))}
      </div>
      {pros.length ? (
        <ul className="space-y-3">
          {pros.map((p) => {
            const cpf = openCpf(p.user.cpfSealed);
            return (
              <li key={p.id}>
                <Card className="space-y-3">
                  <div className="flex flex-wrap items-start gap-3">
                    <a href={proPhotoUrl(p) ?? "#"} target="_blank" rel="noreferrer"><ProPhoto url={proPhotoUrl(p)} name={p.user.name} size={88} className="rounded-xl" /></a>
                    <div className="min-w-0 flex-1 space-y-1 text-sm">
                      <p className="text-base font-semibold">{p.user.name} <ProStatusBadge status={p.status} /></p>
                      <p>Idade: <strong>{ageOn(p.birthDate)} anos</strong> (nasc. {p.birthDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })})</p>
                      <p>CPF: {cpf ? <Reveal userId={p.userId} what="cpf" masked={maskCpf(cpf)} /> : "—"} · WhatsApp: <Reveal userId={p.userId} what="whatsapp" masked="(**) *****-****" /></p>
                      <p>Atende: {p.areas.map((a) => `${a.city}/${a.uf}`).join(", ")}</p>
                      <p>Preço: {p.hourlyCents ? `${formatBRL(p.hourlyCents)}/h` : "—"} · Serviços: {p.services.map(serviceLabel).join(", ") || "—"}</p>
                      {p.bio && <p className="text-muted">“{p.bio}”</p>}
                      <p className="text-xs text-muted">Cadastro em {p.createdAt.toLocaleDateString("pt-BR")} · Assinatura: {subscriptionActive(p.subscription) ? `em dia até ${p.subscription!.currentPeriodEnd!.toLocaleDateString("pt-BR")}` : "não ativa"}</p>
                      {p.approvals.length > 0 && <p className="text-xs text-muted">Histórico: {p.approvals.map((a) => `${PRO_STATUS_LABEL[a.status]} (${a.createdAt.toLocaleDateString("pt-BR")}${a.reason ? `: ${a.reason}` : ""})`).join(" · ")}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 border-t border-border pt-3">
                    {p.status !== "APPROVED" && (
                      <ActionForm action={setProStatus.bind(null, p.id, "APPROVED")}>
                        <SubmitButton size="sm" pendingText="…">Aprovar</SubmitButton>
                      </ActionForm>
                    )}
                    <ActionForm action={setProStatus.bind(null, p.id, p.status === "APPROVED" ? "SUSPENDED" : "REJECTED")} className="flex min-w-64 flex-1 gap-2">
                      <Input name="reason" placeholder={p.status === "APPROVED" ? "Motivo da suspensão" : "O que precisa corrigir (a pessoa vê)"} maxLength={500} className="h-8" />
                      <SubmitButton size="sm" variant="outline" pendingText="…">{p.status === "APPROVED" ? "Suspender" : "Pedir correção"}</SubmitButton>
                    </ActionForm>
                    <GrantButton proId={p.id} />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title={`Nenhum profissional: ${PRO_STATUS_LABEL[status]}`} />
      )}
    </div>
  );
}
