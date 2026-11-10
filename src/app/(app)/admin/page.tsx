import Link from "next/link";
import type { Metadata } from "next";
import { PageTitle } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/domain";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminHome() {
  await requireAdmin();
  const now = new Date();
  const month = new Date(now.getTime() - 30 * 86_400_000);
  const [clients, pros, approved, pending, subsActive, subsExpired, waiting, accepted, refused, completed, canceled, expired, reviews, revenueMonth, revenueAll, openReports, openTickets] = await Promise.all([
    db.user.count({ where: { role: "CLIENT" } }),
    db.professionalProfile.count(),
    db.professionalProfile.count({ where: { status: "APPROVED" } }),
    db.professionalProfile.count({ where: { status: "PENDING" } }),
    db.subscription.count({ where: { currentPeriodEnd: { gt: now } } }),
    db.subscription.count({ where: { currentPeriodEnd: { lte: now } } }),
    db.booking.count({ where: { status: "WAITING_PRO" } }),
    db.booking.count({ where: { acceptedAt: { not: null } } }),
    db.booking.count({ where: { status: "REFUSED" } }),
    db.booking.count({ where: { status: "COMPLETED" } }),
    db.booking.count({ where: { status: { in: ["CANCELED_CLIENT", "CANCELED_PRO"] } } }),
    db.booking.count({ where: { status: "EXPIRED" } }),
    db.review.count(),
    db.subscriptionPayment.aggregate({ where: { status: "PAID", provider: "SYNCPAY", paidAt: { gt: month } }, _sum: { amountCents: true } }),
    db.subscriptionPayment.aggregate({ where: { status: "PAID", provider: "SYNCPAY" }, _sum: { amountCents: true } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.supportTicket.count({ where: { status: "OPEN" } }),
  ]);
  const total = await db.booking.count();
  return (
    <div className="space-y-5">
      <PageTitle title="Painel administrativo" subtitle="Visão geral da HoraLimp" />
      {(pending > 0 || openReports > 0 || openTickets > 0) && (
        <Card className="flex flex-wrap gap-2 border-warning/40 bg-warning/5">
          {pending > 0 && <Link href="/admin/profissionais" className={buttonClass("primary", "sm")}>{pending} profissional(is) para verificar</Link>}
          {openReports > 0 && <Link href="/admin/denuncias" className={buttonClass("outline", "sm")}>{openReports} denúncia(s) abertas</Link>}
          {openTickets > 0 && <Link href="/admin/suporte" className={buttonClass("outline", "sm")}>{openTickets} chamado(s) abertos</Link>}
        </Card>
      )}
      <section className="space-y-2">
        <CardTitle>Pessoas</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Clientes" value={clients} />
          <Stat label="Profissionais" value={pros} hint={`${approved} aprovados`} />
          <Stat label="Assinaturas ativas" value={subsActive} />
          <Stat label="Assinaturas vencidas" value={subsExpired} />
        </div>
      </section>
      <section className="space-y-2">
        <CardTitle>Solicitações</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total" value={total} hint={`${waiting} aguardando resposta`} />
          <Stat label="Aceites" value={accepted} hint={`${refused} recusadas · ${expired} expiradas`} />
          <Stat label="Concluídos" value={completed} />
          <Stat label="Cancelamentos" value={canceled} />
        </div>
      </section>
      <section className="space-y-2">
        <CardTitle>Receita e qualidade</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Receita (30 dias)" value={formatBRL(revenueMonth._sum.amountCents ?? 0)} hint="Assinaturas pagas por Pix" />
          <Stat label="Receita total" value={formatBRL(revenueAll._sum.amountCents ?? 0)} />
          <Stat label="Avaliações" value={reviews} />
          <Stat label="Denúncias abertas" value={openReports} />
        </div>
      </section>
      <Card className="flex flex-wrap gap-2">
        {[
          ["/admin/profissionais", "Verificação"],
          ["/admin/usuarios", "Usuários"],
          ["/admin/pedidos", "Solicitações"],
          ["/admin/assinaturas", "Assinaturas"],
          ["/admin/denuncias", "Denúncias"],
          ["/admin/suporte", "Suporte"],
          ["/admin/config", "Configurações"],
          ["/admin/auditoria", "Auditoria"],
        ].map(([href, label]) => <Link key={href} href={href} className={buttonClass("outline", "sm")}>{label}</Link>)}
      </Card>
    </div>
  );
}
