import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { formatBRL, getAccess, listPlans, usage } from "@/lib/billing";
import { planOffers, type PlanOffer } from "@/lib/pix-billing";
import { formatLimit, isUnlimited, planFeatures, type PlanLimits } from "@/lib/plans";
import { formatDay } from "@/lib/core/dates";
import { PixCheckout } from "@/components/pix-checkout";
import { ReferralBars, ReferralShare } from "@/components/referral-share";
import { syncpayConfigured } from "@/lib/syncpay";
import { ArrowUpCircle, CalendarClock, Check, CheckCircle2, Gift } from "lucide-react";
import { Badge, Progress } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Assinatura" };

const longDate = (d: Date) => formatDay(d, { day: "2-digit", month: "long", year: "numeric" });
const shortDate = (d: Date) => formatDay(d, { day: "2-digit", month: "2-digit" });

/** Limite que vale para mostrar: o do dia, se houver; senão, o do mês. */
function meter(label: string, l: PlanLimits, day: keyof PlanLimits, month: keyof PlanLimits, usedDay: number, usedMonth: number) {
  const d = l[day] as number;
  const m = l[month] as number;
  if (!isUnlimited(d)) return { label: `${label} hoje`, used: usedDay, max: d };
  return { label: `${label} este mês`, used: usedMonth, max: m };
}

export default async function Page() {
  const user = await requireReadyUser();
  const [access, plans, used, payments] = await Promise.all([
    getAccess(user),
    listPlans(),
    usage(user),
    db.payment.findMany({ where: { subscription: { userId: user.id }, status: "PAID" }, include: { subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const paidPlans = plans.filter((p) => p.slug !== "gratis" && p.active && p.priceMonthCents > 0);
  const free = plans.find((p) => p.slug === "gratis");
  const l = access.limits;
  const meters = [
    meter("Simulados", l, "examsPerDay", "examsPerMonth", used.examsToday, used.examsThisMonth),
    meter("Redações corrigidas", l, "essaysPerDay", "essaysPerMonth", used.essaysToday, used.essaysThisMonth),
    meter("Testes rápidos", l, "gamesPerDay", "gamesPerMonth", used.gamesToday, used.gamesThisMonth),
    meter("Perguntas ao Professor IA", l, "tutorMessagesPerDay", "tutorMessagesPerMonth", used.tutorToday, used.tutorThisMonth),
  ];
  const subscribed = access.reason === "subscription";
  const pixEnabled = syncpayConfigured();
  const offers = await planOffers(user, paidPlans);
  const lessonsText = l.lessonsPct >= 100 ? "todas as aulas" : `${l.lessonsPct}% das aulas de cada matéria`;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinatura</h1>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Seu plano: {access.planName}</CardTitle>
          {subscribed ? (
            <Badge tone="success">Ativo até {formatDay(access.until, { day: "2-digit", month: "short" })}</Badge>
          ) : access.reason === "dev" ? (
            <Badge>Liberado</Badge>
          ) : access.ended ? (
            <Badge tone="warning">Plano {access.ended.planName} vencido</Badge>
          ) : (
            <Badge>Grátis</Badge>
          )}
        </div>
        <p className="text-sm text-muted">
          {access.reason === "subscription"
            ? `Plano válido até ${longDate(access.until)}, com ${lessonsText}. A renovação abre 2 dias antes de vencer.`
            : access.reason === "dev"
              ? "Tudo liberado (conta de administrador)."
              : access.ended
                ? `Seu plano ${access.ended.planName} venceu em ${longDate(access.ended.at)} e você voltou para o Grátis. Seu progresso continua guardado: renove abaixo e tudo volta na hora.`
                : `No plano Grátis você estuda todas as matérias com ${lessonsText}. Assine para liberar mais aulas e atividades.`}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {meters.map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted">{m.label}</span>
                <span className="font-medium">{m.used} / {formatLimit(m.max)}</span>
              </div>
              <Progress value={isUnlimited(m.max) ? 0 : m.max === 0 ? 1 : m.used / m.max} tone={!isUnlimited(m.max) && m.used >= m.max ? "danger" : "primary"} />
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold">Planos</h2>
          <p className="text-sm text-muted">Planos de 30 dias, pagos com Pix. Sem cobrança automática.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paidPlans.map((p) => {
            const offer = offers.get(p.slug)!;
            const current = subscribed && access.planSlug === p.slug;
            return offer.referral ? (
              <ReferralPlanCard key={p.slug} name={p.name} limits={p.limits} offer={offer} current={current} pixEnabled={pixEnabled} />
            ) : (
              <PlanCard key={p.slug} name={p.name} slug={p.slug} limits={p.limits} offer={offer} current={current} best={p.slug === "completo"} pixEnabled={pixEnabled} />
            );
          })}
        </div>
      </div>

      {free && (
        <Card className="text-sm">
          <CardTitle>Grátis</CardTitle>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{planFeatures(free.limits).map((f) => <li key={f}>{f}</li>)}</ul>
        </Card>
      )}

      <Card className="space-y-2 text-sm">
        <CardTitle>Como funciona</CardTitle>
        <ol className="list-decimal space-y-1 pl-5 text-muted">
          <li>Escolha o plano e toque em &quot;Pagar com Pix&quot;. Pague pelo app do seu banco (QR Code ou Pix Copia e Cola): o plano libera sozinho assim que o Pix cair.</li>
          <li>Cada pagamento vale 30 dias. Não há cobrança automática.</li>
          <li>Quer um plano maior? É só assinar: o plano novo vale 30 dias a partir do pagamento e o anterior acaba na hora. Não há desconto pelos dias que sobraram.</li>
          <li>Plano menor só fica disponível quando o seu plano atual acabar. O seu próprio plano pode ser renovado a partir de 2 dias antes de vencer.</li>
          <li>Plano Indicação: compartilhe o seu código. Quando as pessoas criarem a conta com ele, você libera o plano com preço especial (tudo do Completo).</li>
        </ol>
      </Card>

      {payments.length > 0 && (
        <Card>
          <CardTitle>Histórico</CardTitle>
          <ul className="mt-3 divide-y divide-border text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="w-28 text-muted">{formatDay(p.dueDate, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span className="flex-1">Plano {p.subscription.plan.name} (30 dias)</span>
                <span className="font-medium">{formatBRL(p.valueCents)}</span>
                <Badge tone="success">Pago</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/** Botão de pagar (ou o motivo de não dar para pagar agora). */
function PlanAction({ slug, name, offer, current, pixEnabled }: { slug: string; name: string; offer: PlanOffer; current: boolean; pixEnabled: boolean }) {
  const { option } = offer;
  if (option.kind === "current") {
    return (
      <p className="flex items-center justify-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-center text-sm font-semibold text-success">
        <CheckCircle2 size={16} /> Seu plano · até {shortDate(option.until)}
      </p>
    );
  }
  if (option.kind === "lower") {
    return (
      <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-center text-sm" aria-label={`${name} indisponível`}>
        <p className="font-semibold text-muted">Indisponível</p>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <CalendarClock size={14} /> Disponível para trocar de plano em {shortDate(option.availableAt)}
        </p>
      </div>
    );
  }
  if (!pixEnabled) return <p className="rounded-lg border border-border px-3 py-2 text-center text-sm text-muted">Pagamento por Pix indisponível no momento. Tente de novo em alguns minutos.</p>;
  if (option.kind === "renew" || current) return <PixCheckout planSlug={slug} label={`Renovar ${name} com Pix`} />;
  if (offer.referral) return <PixCheckout planSlug={slug} label={`Liberar o plano ${name} com Pix`} />;
  return <PixCheckout planSlug={slug} label={`${option.kind === "upgrade" ? "Mudar para o" : "Assinar o"} ${name} com Pix`} />;
}

function PlanCard({ name, slug, limits, offer, current, best, pixEnabled }: { name: string; slug: string; limits: PlanLimits; offer: PlanOffer; current: boolean; best: boolean; pixEnabled: boolean }) {
  const { quote: q, promo } = offer;
  return (
    <Card className={`flex flex-col gap-3 ${current ? "border-primary bg-primary/5" : best ? "border-primary" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <CardTitle>{name}</CardTitle>
        {current ? <Badge tone="success">Seu plano</Badge> : best ? <Badge tone="primary">Tudo liberado</Badge> : null}
      </div>
      {promo ? (
        <div className="space-y-1" aria-label={`Promoção do plano ${name}`}>
          <Badge tone="warning">Promoção: {promo.months} primeiros meses</Badge>
          <div>
            <span className="mr-2 text-base text-muted line-through">{formatBRL(promo.normalCents)}</span>
            <span className="text-3xl font-bold">{formatBRL(q.priceCents)}</span>
            <span className="text-sm text-muted"> / 30 dias</span>
          </div>
          <p className="text-xs text-muted">
            {promo.month === 1
              ? `${formatBRL(q.priceCents)} nos ${promo.months} primeiros meses. Depois, ${formatBRL(promo.normalCents)} por mês.`
              : `Você está no ${promo.month}º de ${promo.months} meses com promoção. Depois, ${formatBRL(promo.normalCents)} por mês.`}
          </p>
        </div>
      ) : (
        <div>
          <span className="text-3xl font-bold">{formatBRL(q.priceCents)}</span>
          <span className="text-sm text-muted"> / 30 dias</span>
        </div>
      )}
      <ul className="flex-1 space-y-1.5 text-sm">
        {planFeatures(limits).map((f) => (
          <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
        ))}
      </ul>
      {offer.option.kind === "upgrade" && q.change && (
        <p className="flex items-start gap-1.5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted" aria-label={`Mudar para o plano ${name}`}>
          <ArrowUpCircle size={15} className="mt-0.5 shrink-0 text-primary" />
          Mudando do {q.change.fromName} para o {name}: você paga {formatBRL(q.payCents)} e o {name} vale 30 dias a partir do pagamento. O {q.change.fromName} acaba na hora.
        </p>
      )}
      <PlanAction slug={slug} name={name} offer={offer} current={current} pixEnabled={pixEnabled} />
    </Card>
  );
}

/** Plano por indicação: código para compartilhar, tracinhos das indicações e, quando libera, o Pix com o preço especial. */
function ReferralPlanCard({ name, limits, offer, current, pixEnabled }: { name: string; limits: PlanLimits; offer: PlanOffer; current: boolean; pixEnabled: boolean }) {
  const r = offer.referral!;
  const left = r.needed - r.count;
  return (
    <Card id="indicacao" className={`flex scroll-mt-20 flex-col gap-3 ${current ? "border-primary bg-primary/5" : "border-success/50"}`} aria-label="Plano Indicação">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2"><Gift size={18} className="text-success" /> {name}</CardTitle>
        {current ? <Badge tone="success">Seu plano</Badge> : <Badge tone="success">Com indicação</Badge>}
      </div>
      <div>
        <span className="text-3xl font-bold">{formatBRL(r.priceCents)}</span>
        <span className="text-sm text-muted"> / 30 dias</span>
      </div>
      <p className="text-sm text-muted">
        {r.firstTime
          ? `Compartilhe o seu código com ${r.needed} pessoas. Quando elas criarem a conta usando o código, você paga só ${formatBRL(r.priceCents)} e tem tudo do plano Completo por 30 dias.`
          : `Indique mais ${r.needed} pessoa${r.needed === 1 ? "" : "s"} e pague ${formatBRL(r.priceCents)} para ter tudo do plano Completo por mais 30 dias.`}
      </p>
      <ReferralBars count={r.count} needed={r.needed} />
      <ReferralShare code={r.code} link={r.link} />
      <ul className="flex-1 space-y-1.5 text-sm">
        {planFeatures(limits).slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{f}</li>
        ))}
        <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />Tudo o que o plano Completo tem</li>
      </ul>
      {r.unlocked ? (
        <PlanAction slug="indicacao" name={name} offer={offer} current={current} pixEnabled={pixEnabled} />
      ) : (
        <p className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-center text-sm text-muted">
          Falta{left === 1 ? "" : "m"} {left} indicaç{left === 1 ? "ão" : "ões"} para liberar
        </p>
      )}
    </Card>
  );
}
