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
  const [users, pros, full, basic, trial, expiredSubs, quickOn, searching, quickTotal, quickAccepted, noProvider, normal, completed, noShowPro, noShowClient, revenueMonth, revenueAll, openReports, openTickets, clientBlocks, quickBans] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.providerProfile.count(),
    db.subscription.count({ where: { currentPeriodEnd: { gt: now }, plan: "FULL", trial: false } }),
    db.subscription.count({ where: { currentPeriodEnd: { gt: now }, plan: "BASIC" } }),
    db.subscription.count({ where: { currentPeriodEnd: { gt: now }, trial: true } }),
    db.subscription.count({ where: { OR: [{ currentPeriodEnd: { lte: now } }, { currentPeriodEnd: null }] } }),
    db.providerProfile.count({ where: { quickOn: true } }),
    db.booking.count({ where: { status: "SEARCHING" } }),
    db.booking.count({ where: { mode: "QUICK" } }),
    db.booking.count({ where: { mode: "QUICK", acceptedAt: { not: null } } }),
    db.booking.count({ where: { status: "NO_PROVIDER" } }),
    db.booking.count({ where: { mode: "NORMAL" } }),
    db.booking.count({ where: { status: "COMPLETED" } }),
    db.booking.count({ where: { status: "NO_SHOW_PRO" } }),
    db.booking.count({ where: { status: "NO_SHOW_CLIENT" } }),
    db.payment.aggregate({ where: { status: "PAID", provider: "SYNCPAY", paidAt: { gt: month } }, _sum: { amountCents: true } }),
    db.payment.aggregate({ where: { status: "PAID", provider: "SYNCPAY" }, _sum: { amountCents: true } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.supportTicket.count({ where: { status: "OPEN" } }),
    db.cpfLedger.count({ where: { clientBlockedUntil: { gt: now } } }),
    db.providerProfile.count({ where: { quickBannedUntil: { gt: now } } }),
  ]);
  return (
    <div className="space-y-5">
      <PageTitle title="Painel administrativo" subtitle="Visão geral do Diária Paga" />
      {(openReports > 0 || openTickets > 0) && (
        <Card className="flex flex-wrap gap-2 border-warning/40 bg-warning/5">
          {openReports > 0 && <Link href="/admin/denuncias" className={buttonClass("primary", "sm")}>{openReports} denúncia(s) abertas</Link>}
          {openTickets > 0 && <Link href="/admin/suporte" className={buttonClass("outline", "sm")}>{openTickets} chamado(s) abertos</Link>}
        </Card>
      )}
      <section className="space-y-2">
        <CardTitle>Pessoas e planos</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Contas" value={users} hint={`${pros} prestadores`} />
          <Stat label="Plano Completo" value={full} hint={`${basic} no Básico`} />
          <Stat label="Em teste grátis" value={trial} />
          <Stat label="Planos vencidos" value={expiredSubs} />
        </div>
      </section>
      <section className="space-y-2">
        <CardTitle>Contrate rápido</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Disponíveis agora" value={quickOn} hint={`${searching} chamado(s) procurando`} />
          <Stat label="Chamados" value={quickTotal} hint={`${quickAccepted} aceitos · ${noProvider} sem prestador`} />
          <Stat label="Prestador não chegou" value={noShowPro} hint={`${quickBans} penalizado(s) agora`} />
          <Stat label="Cliente não estava" value={noShowClient} hint={`${clientBlocks} bloqueado(s) agora`} />
        </div>
      </section>
      <section className="space-y-2">
        <CardTitle>Pedidos e receita</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Pedidos normais" value={normal} />
          <Stat label="Serviços concluídos" value={completed} />
          <Stat label="Receita (30 dias)" value={formatBRL(revenueMonth._sum.amountCents ?? 0)} hint="Planos e taxas pagas por Pix" />
          <Stat label="Receita total" value={formatBRL(revenueAll._sum.amountCents ?? 0)} />
        </div>
      </section>
      <Card className="flex flex-wrap gap-2">
        {[
          ["/admin/prestadores", "Prestadores"],
          ["/admin/usuarios", "Usuários"],
          ["/admin/pedidos", "Pedidos"],
          ["/admin/pagamentos", "Pagamentos"],
          ["/admin/penalidades", "Penalidades"],
          ["/admin/denuncias", "Denúncias"],
          ["/admin/suporte", "Suporte"],
          ["/admin/config", "Configurações"],
          ["/admin/auditoria", "Auditoria"],
        ].map(([href, label]) => <Link key={href} href={href} className={buttonClass("outline", "sm")}>{label}</Link>)}
      </Card>
    </div>
  );
}
