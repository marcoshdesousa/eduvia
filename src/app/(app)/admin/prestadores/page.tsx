import Link from "next/link";
import type { Metadata } from "next";
import { ActionButton } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { Empty, PageTitle, ProPhoto } from "@/components/bits";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import type { Prisma } from "@/generated/prisma/client";
import { maskCpf } from "@/lib/core/phone";
import { openCpf } from "@/lib/cpf";
import { db } from "@/lib/db";
import { PLANS, ageOn, category, formatBRL, ratingOf } from "@/lib/domain";
import { accountPhotoUrl } from "@/lib/providers";
import { requireAdmin } from "@/lib/session";
import { subscriptionActive } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { grantPlan, liftQuickBan, setProviderStatus } from "../actions";
import { Reveal } from "../admin-bits";

export const metadata: Metadata = { title: "Prestadores" };

const FILTERS = { todos: "Todos", ativos: "Plano em dia", vencidos: "Plano vencido", suspensos: "Suspensos" } as const;
type F = keyof typeof FILTERS;

export default async function AdminProviders({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const f: F = sp.f && sp.f in FILTERS ? (sp.f as F) : "todos";
  const q = (sp.q ?? "").trim();
  const now = new Date();
  const where: Prisma.ProviderProfileWhereInput = {
    ...(q ? { user: { name: { contains: q, mode: "insensitive" } } } : {}),
    ...(f === "ativos" ? { subscription: { currentPeriodEnd: { gt: now } } } : f === "vencidos" ? { OR: [{ subscription: null }, { subscription: { OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { lte: now } }] } }] } : f === "suspensos" ? { status: "SUSPENDED" } : {}),
  };
  const pros = await db.providerProfile.findMany({ where, orderBy: { createdAt: "desc" }, take: 50, include: { user: true, services: true, places: { where: { active: true } }, subscription: true } });
  return (
    <div className="space-y-4">
      <PageTitle title="Prestadores" subtitle="Não há aprovação prévia: quem paga o plano aparece. Suspenda quem não segue as regras." />
      <form className="flex gap-2">
        <input type="hidden" name="f" value={f} />
        <Input name="q" defaultValue={q} placeholder="Buscar pelo nome" />
        <SubmitButton variant="outline">Buscar</SubmitButton>
      </form>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(FILTERS) as F[]).map((k) => (
          <Link key={k} href={`/admin/prestadores?f=${k}`} className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-sm", k === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted")}>{FILTERS[k]}</Link>
        ))}
      </div>
      {pros.length ? (
        <ul className="space-y-3">
          {pros.map((p) => {
            const cpf = openCpf(p.user.cpfSealed);
            const sub = p.subscription;
            const banned = p.quickBannedUntil && p.quickBannedUntil > now;
            return (
              <li key={p.id}>
                <Card className="space-y-3">
                  <div className="flex flex-wrap items-start gap-3">
                    <ProPhoto url={accountPhotoUrl(p)} name={p.user.name} size={72} className="rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-1 text-sm">
                      <p className="flex flex-wrap items-center gap-2 text-base font-semibold">
                        <Link href={`/prestador/${p.id}`} className="hover:underline">{p.user.name}</Link>
                        {p.status === "SUSPENDED" && <Badge tone="danger">Suspenso</Badge>}
                        {p.paused && <Badge>Pausado</Badge>}
                        {p.quickOn && <Badge tone="success">⚡ Disponível</Badge>}
                        {banned && <Badge tone="warning">Fora do rápido até {p.quickBannedUntil!.toLocaleDateString("pt-BR")}</Badge>}
                      </p>
                      <p>{p.birthDate ? `${ageOn(p.birthDate)} anos · ` : ""}CPF {cpf ? <Reveal userId={p.userId} what="cpf" masked={maskCpf(cpf)} /> : "—"} · Celular <Reveal userId={p.userId} what="phone" masked="(**) *****-****" /></p>
                      <p className="text-muted">{p.services.map((s) => `${category(s.category)?.label ?? s.category} ${formatBRL(s.priceCents)}`).join(" · ")}</p>
                      <p className="text-muted">{p.places.map((pl) => `${pl.city}/${pl.uf}`).join(", ")} · nota {ratingOf(p)?.toFixed(1) ?? "—"} ({p.ratingCount}) · {p.completedCount} serviços</p>
                      <p className="text-xs text-muted">Plano: {sub ? `${PLANS[sub.plan].name}${sub.trial ? " (teste)" : ""}${sub.packs ? ` + ${sub.packs} pacote(s)` : ""} · ${subscriptionActive(sub) ? `em dia até ${sub.currentPeriodEnd!.toLocaleDateString("pt-BR")}` : "vencido"}` : "nenhum"}</p>
                      {p.statusReason && <p className="text-xs text-danger">Motivo: {p.statusReason}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 border-t border-border pt-3">
                    {p.status === "SUSPENDED" ? (
                      <ActionForm action={setProviderStatus.bind(null, p.id, "ACTIVE")}><SubmitButton size="sm" pendingText="…">Reativar</SubmitButton></ActionForm>
                    ) : (
                      <ActionForm action={setProviderStatus.bind(null, p.id, "SUSPENDED")} className="flex min-w-60 flex-1 gap-2">
                        <Input name="reason" placeholder="Motivo da suspensão (a pessoa vê)" maxLength={500} className="h-8" />
                        <SubmitButton size="sm" variant="outline" pendingText="…">Suspender</SubmitButton>
                      </ActionForm>
                    )}
                    <ActionForm action={grantPlan.bind(null, p.userId)} className="flex gap-2">
                      <Select name="plan" className="h-8 w-28" defaultValue="FULL"><option value="FULL">Completo</option><option value="BASIC">Básico</option></Select>
                      <Input name="days" type="number" min={1} max={365} defaultValue={30} className="h-8 w-20" aria-label="Dias" />
                      <SubmitButton size="sm" variant="outline" pendingText="…">Liberar dias</SubmitButton>
                    </ActionForm>
                    {banned && <ActionButton action={liftQuickBan.bind(null, p.id)} size="sm" variant="outline" confirm="Tirar a penalidade do Contrate rápido?">Tirar penalidade</ActionButton>}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title="Nenhum prestador encontrado" />
      )}
    </div>
  );
}
