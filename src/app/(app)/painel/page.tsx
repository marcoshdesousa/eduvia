import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, CalendarCheck, CheckCircle2, Circle, CreditCard, Eye, EyeOff, Star } from "lucide-react";
import { BookingBadge, PageTitle, ProStatusBadge, Rating } from "@/components/bits";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle, Stat } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ACTIVE_STATUSES, formatBRL, proVisible, ratingOf, serviceLabel } from "@/lib/domain";
import { formatWhen } from "@/lib/places";
import { missingForReview } from "@/lib/pro-profile";
import { requirePro } from "@/lib/session";
import { subscriptionActive } from "@/lib/subscription";
import { PauseToggle, SubmitReview } from "./panel-buttons";

export const metadata: Metadata = { title: "Painel" };

export default async function ProPanel() {
  const user = await requirePro();
  const pro = await db.professionalProfile.findUniqueOrThrow({ where: { id: user.pro.id }, include: { subscription: true, areas: true, availability: true } });
  const [waiting, upcoming, missing] = await Promise.all([
    db.booking.count({ where: { proId: pro.id, status: "WAITING_PRO" } }),
    db.booking.findMany({ where: { proId: pro.id, status: { in: ACTIVE_STATUSES } }, orderBy: { scheduledAt: "asc" }, take: 5 }),
    missingForReview(pro.id),
  ]);
  const subOk = subscriptionActive(pro.subscription);
  const visible = proVisible({ ...pro, subscriptionEnd: pro.subscription?.currentPeriodEnd });
  const steps = [
    { done: !!pro.photoKey, label: "Foto do rosto", href: "/painel/perfil" },
    { done: !!pro.hourlyCents && pro.services.length > 0, label: "Preço por hora e serviços", href: "/painel/perfil" },
    { done: pro.areas.length > 0, label: "Município de atendimento", href: "/painel/perfil" },
    { done: pro.status === "APPROVED", label: "Verificação aprovada pela HoraLimp", href: null },
    { done: subOk, label: "Assinatura em dia", href: "/painel/assinatura" },
  ];

  return (
    <div className="space-y-5">
      <PageTitle title={`Olá, ${user.name.split(" ")[0]}!`} subtitle="Seu painel de profissional">
        <ProStatusBadge status={pro.status} />
      </PageTitle>

      <Card className={visible ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"}>
        <div className="flex items-start gap-3">
          {visible ? <Eye className="mt-0.5 shrink-0 text-success" /> : <EyeOff className="mt-0.5 shrink-0 text-warning" />}
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{visible ? "Você está aparecendo na vitrine" : "Você ainda não aparece na vitrine"}</p>
            <p className="text-sm text-muted">
              {visible
                ? `Clientes de ${pro.areas.map((a) => a.city).join(", ")} podem te encontrar e enviar pedidos.`
                : pro.paused
                  ? "Novos pedidos estão pausados. Volte a receber quando quiser."
                  : "Para aparecer, complete os passos abaixo."}
            </p>
          </div>
        </div>
        {pro.status === "APPROVED" && subOk && <div className="mt-3"><PauseToggle paused={pro.paused} /></div>}
      </Card>

      {(pro.status === "REJECTED" || pro.status === "SUSPENDED") && (
        <Card className="flex gap-3 border-danger/40 bg-danger/5">
          <AlertTriangle className="shrink-0 text-danger" />
          <div className="text-sm">
            <p className="font-semibold">{pro.status === "REJECTED" ? "Cadastro reprovado" : "Conta suspensa"}</p>
            {pro.statusReason && <p className="text-muted">Motivo: {pro.statusReason}</p>}
            <p className="text-muted">{pro.status === "REJECTED" ? "Corrija o que foi pedido e envie de novo." : "Fale com o suporte para entender o que fazer."}</p>
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        <CardTitle>Passo a passo</CardTitle>
        <ul className="space-y-2">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-sm">
              {s.done ? <CheckCircle2 size={18} className="text-success" /> : <Circle size={18} className="text-muted" />}
              {s.href && !s.done ? <Link href={s.href} className="text-primary hover:underline">{s.label}</Link> : <span className={s.done ? "" : "text-muted"}>{s.label}</span>}
              {s.label.startsWith("Verificação") && pro.status === "PENDING" && <span className="text-xs text-warning">(em análise)</span>}
            </li>
          ))}
        </ul>
        {(pro.status === "INCOMPLETE" || pro.status === "REJECTED") && <SubmitReview missing={missing} />}
        {pro.status === "PENDING" && <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm">Seu perfil está em análise pela equipe da HoraLimp. Avisamos você assim que for aprovado.</p>}
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/pedidos?aba=aguardando"><Stat label="Pedidos novos" value={waiting} hint={waiting ? "Responda logo" : "Nenhum agora"} className={waiting ? "border-warning/50" : ""} /></Link>
        <Stat label="Próximos serviços" value={upcoming.length} />
        <Stat label="Avaliação" value={<Rating value={ratingOf(pro)} count={pro.ratingCount} />} />
        <Stat label="Concluídos" value={pro.completedCount} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><CalendarCheck size={18} /> Próximos serviços</CardTitle>
            <Link href="/pedidos" className="text-sm text-primary hover:underline">Ver todos</Link>
          </div>
          {upcoming.length ? (
            <ul className="divide-y divide-border">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <Link href={`/pedidos/${b.id}`} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <span>
                      <span className="font-medium">{formatWhen(b.scheduledAt, b.addrUf)}</span>
                      <span className="block text-muted">{b.hours} h · {b.addrCity} · {b.services.map(serviceLabel).join(", ")}</span>
                    </span>
                    <BookingBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nenhum serviço confirmado ainda.</p>
          )}
        </Card>
        <Card className="space-y-3">
          <CardTitle className="flex items-center gap-2"><CreditCard size={18} /> Assinatura</CardTitle>
          {subOk ? (
            <p className="text-sm">Em dia até <strong>{pro.subscription!.currentPeriodEnd!.toLocaleDateString("pt-BR")}</strong>.</p>
          ) : (
            <p className="text-sm text-muted">{pro.subscription?.currentPeriodEnd ? "Sua assinatura venceu. Renove para voltar à vitrine." : "Você ainda não assinou."} O seu histórico fica guardado.</p>
          )}
          <Link href="/painel/assinatura" className={buttonClass(subOk ? "outline" : "primary", "sm")}>{subOk ? "Ver assinatura" : "Assinar por Pix"}</Link>
          <div className="border-t border-border pt-3 text-sm text-muted">
            <p className="flex items-center gap-1"><Star size={14} /> Seu preço: <strong className="text-foreground">{pro.hourlyCents ? `${formatBRL(pro.hourlyCents)}/hora` : "não definido"}</strong></p>
            <p>Atende em: {pro.areas.map((a) => `${a.city}/${a.uf}`).join(", ") || "—"}</p>
            <p>Agenda: {pro.availability.length ? `${pro.availability.length} dia(s) da semana` : "sem dias fixos"} · <Link href="/painel/agenda" className="text-primary hover:underline">editar</Link></p>
          </div>
        </Card>
      </div>
    </div>
  );
}
