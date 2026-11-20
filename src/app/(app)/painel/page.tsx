import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, CalendarClock, ChevronRight, Clock, Crown, Eye, Images, MapPin, User, Wallet, Wrench } from "lucide-react";
import { ActionSwitch } from "@/components/action-button";
import { PageTitle, ProPhoto, Rating } from "@/components/bits";
import { PushToggle } from "@/components/push-toggle";
import { Card } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";
import { db } from "@/lib/db";
import { PLANS, formatBRL, placesLimit, providerVisible, ratingOf } from "@/lib/domain";
import { providerFinance } from "@/lib/finance";
import { providerPhotoUrl } from "@/lib/providers";
import { requireProvider } from "@/lib/session";
import { subscriptionActive } from "@/lib/subscription";
import { setPausedAction, setQuickAction } from "./actions";

export const metadata: Metadata = { title: "Painel" };

const fmtDate = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function PanelPage({ searchParams }: { searchParams: Promise<{ novo?: string }> }) {
  const user = await requireProvider();
  const { novo } = await searchParams;
  const pro = await db.providerProfile.findUniqueOrThrow({
    where: { id: user.provider.id },
    include: { subscription: true, _count: { select: { services: true, posts: true, places: { where: { active: true } } } } },
  });
  const sub = pro.subscription;
  const active = subscriptionActive(sub);
  const visible = providerVisible({ ...pro, subscriptionEnd: sub?.currentPeriodEnd ?? null, blocked: false, services: pro._count.services, places: pro._count.places });
  const banned = pro.quickBannedUntil && pro.quickBannedUntil > new Date() ? pro.quickBannedUntil : null;
  const [fin, waiting, current] = await Promise.all([
    providerFinance(pro.id),
    db.booking.count({ where: { proId: pro.id, status: "WAITING_PRO" } }),
    db.booking.findMany({ where: { proId: pro.id, status: { in: ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "STARTED"] } }, orderBy: { scheduledAt: "asc" }, take: 3 }),
  ]);
  const hoursLeft = sub?.currentPeriodEnd ? Math.max(0, Math.round((sub.currentPeriodEnd.getTime() - Date.now()) / 3_600_000)) : 0;

  const menu = [
    { href: "/painel/perfil", icon: User, t: "Perfil", d: "Foto, bio e Instagram" },
    { href: "/painel/servicos", icon: Wrench, t: "Serviços e preços", d: `${pro._count.services} serviço(s)` },
    { href: "/painel/enderecos", icon: MapPin, t: "Endereços", d: `${pro._count.places} de ${sub ? placesLimit(sub.plan, sub.packs) : 1}` },
    { href: "/painel/portfolio", icon: Images, t: "Portfólio", d: `${pro._count.posts} de 8 fotos` },
    { href: "/painel/agenda", icon: CalendarClock, t: "Horários", d: "Dias e horas que você atende" },
    { href: "/painel/financeiro", icon: Wallet, t: "Financeiro", d: "Quanto você recebeu" },
    { href: "/painel/plano", icon: Crown, t: "Plano", d: sub ? `${PLANS[sub.plan].name}${sub.trial ? " (teste)" : ""}` : "Escolher plano" },
    { href: `/prestador/${pro.id}`, icon: Eye, t: "Ver meu perfil", d: "Como os clientes veem" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ProPhoto url={providerPhotoUrl(pro)} name={user.name} size={56} />
        <div className="min-w-0">
          <PageTitle title={`Olá, ${user.name.split(" ")[0]}!`} subtitle={<Rating value={ratingOf(pro)} count={pro.ratingCount} />} />
        </div>
      </div>

      {novo && sub?.trial && (
        <Card className="border-primary/40 bg-primary/5">
          <p className="font-semibold">🎉 Seu perfil está no ar!</p>
          <p className="text-sm text-muted">Você tem 3 dias grátis do plano Completo. Inclua fotos no portfólio e ligue o Disponível para receber chamados.</p>
        </Card>
      )}

      {!active ? (
        <Card className="border-warning/50 bg-warning/10">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={18} className="text-warning" /> {sub ? "Seu plano venceu" : "Escolha um plano"}</p>
          <p className="mt-1 text-sm">Sem plano em dia você não aparece para os clientes nem recebe chamados.</p>
          <Link href="/painel/plano" className={buttonClass("primary", "md", "mt-3 w-full")}>Pagar com Pix</Link>
        </Card>
      ) : sub?.trial ? (
        <Card className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Teste grátis do Completo</p>
            <p className="text-xs text-muted">Faltam {hoursLeft > 24 ? `${Math.ceil(hoursLeft / 24)} dias` : `${hoursLeft} horas`} · termina {fmtDate(sub.currentPeriodEnd!)}</p>
          </div>
          <Link href="/painel/plano" className={buttonClass("secondary", "sm")}>Garantir plano</Link>
        </Card>
      ) : (
        <p className="text-sm text-muted">Plano <strong className="text-foreground">{PLANS[sub!.plan].name}</strong> em dia até {sub!.currentPeriodEnd!.toLocaleDateString("pt-BR")}.</p>
      )}

      <Card className="space-y-3">
        <ActionSwitch
          on={pro.quickOn && !banned && visible}
          action={setQuickAction}
          label="⚡ Disponível para o Contrate rápido"
          hint="Ligado, você recebe chamados de clientes perto de você. Quem aceitar primeiro leva — e tem 2 horas para chegar."
        />
        {banned && <p className="rounded-lg bg-danger/10 p-2 text-xs text-danger">Você aceitou um chamado e não chegou em 2 horas. Fica fora do Contrate rápido até {fmtDate(banned)}. Os pedidos normais continuam.</p>}
        <PushToggle />
      </Card>

      {!visible && active && (
        <Card className="border-warning/50">
          <p className="text-sm font-semibold">Você ainda não aparece na busca</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted">
            {pro.paused && <li>O perfil está pausado.</li>}
            {!pro.photoKey && <li>Falta a foto do perfil.</li>}
            {!pro._count.services && <li>Falta um serviço.</li>}
            {!pro._count.places && <li>Falta um endereço.</li>}
          </ul>
        </Card>
      )}

      {(waiting > 0 || current.length > 0) && (
        <Link href="/pedidos?aba=recebi" className="block">
          <Card className="flex items-center justify-between border-primary/40 bg-primary/5">
            <span className="flex items-center gap-2 text-sm font-semibold"><Clock size={18} className="text-primary" /> {waiting > 0 ? `${waiting} pedido(s) esperando sua resposta` : `${current.length} serviço(s) em andamento`}</span>
            <ChevronRight size={18} />
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center"><p className="text-xs text-muted">Semana</p><p className="font-bold">{formatBRL(fin.week.cents)}</p></Card>
        <Card className="p-3 text-center"><p className="text-xs text-muted">Mês</p><p className="font-bold">{formatBRL(fin.month.cents)}</p></Card>
        <Card className="p-3 text-center"><p className="text-xs text-muted">Serviços no mês</p><p className="font-bold">{fin.month.count}</p></Card>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {menu.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="flex items-center gap-3 p-3 transition-colors hover:border-primary/50">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><m.icon size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{m.t}</span>
                <span className="block truncate text-xs text-muted">{m.d}</span>
              </span>
              <ChevronRight size={16} className="text-muted" />
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <ActionSwitch on={pro.paused} action={setPausedAction} label="Pausar perfil" hint="Some da busca e do Contrate rápido (férias, folga). Os pedidos já aceitos continuam." />
      </Card>
    </div>
  );
}
