import Link from "next/link";
import { ActionButton, ActionSwitch } from "@/components/action-button";
import { ActionForm } from "@/components/action-form";
import { PushToggle } from "@/components/push-toggle";
import { SubmitButton } from "@/components/submit-button";
import { buttonClass } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { quickStats } from "@/lib/bookings";
import { ARRIVE_HOURS, CLIENT_NOSHOW_WAIT_MIN, PRO_QUICK_BAN_DAYS, QUICK_MIN_SAMPLE, UNIT_LABEL, acceptRate, acceptTier, category, formatBRL, quickHourPrice, quickPrice, isQuickCategory } from "@/lib/domain";
import { getSettings } from "@/lib/settings";
import { acceptQuickTermsAction, leaveQuickAction, setQuickAction } from "./actions";

const fmt = (d: Date) => d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

/** Contrate rápido no painel: só plano Completo; primeiro aceita as regras (caixinha), depois liga o Disponível. */
export async function QuickCard({ pro, full, visible }: { pro: { id: string; quickOn: boolean; quickTermsAt: Date | null; quickBannedUntil: Date | null; services: { category: string; unit?: string; hourCents?: number | null }[] }; full: boolean; visible: boolean }) {
  const banned = pro.quickBannedUntil && pro.quickBannedUntil > new Date() ? pro.quickBannedUntil : null;
  const { quickPrices, quickHourPrices } = await getSettings();
  const prices = (
    <ul className="divide-y divide-border rounded-xl bg-surface-2 px-3 text-sm">
      {pro.services.filter((s) => isQuickCategory(s.category)).map((s) => {
        const c = category(s.category);
        const hour = quickHourPrice(s.category, quickPrices, quickHourPrices);
        const byHour = hour != null && c?.unit !== "HORA" && (s.hourCents || s.unit === "HORA");
        return (
          <li key={s.category} className="flex justify-between gap-2 py-2">
            <span>{c?.emoji} {c?.label}</span>
            <span className="text-right">
              <strong>{formatBRL(quickPrice(s.category, quickPrices) ?? 0)} <span className="text-xs font-normal text-muted">{c && UNIT_LABEL[c.unit].per}</span></strong>
              {byHour && <span className="block text-xs text-muted">e {formatBRL(hour)} por hora</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
  const outside = pro.services.filter((s) => !isQuickCategory(s.category));
  const outsideNote = outside.length > 0 && (
    <p className="text-xs text-muted">
      {outside.map((s) => category(s.category)?.label ?? s.category).join(", ")}: {outside.length === 1 ? "essa profissão não entra" : "essas profissões não entram"} no Contrate rápido (o valor depende do trabalho). O cliente contrata pela vitrine, com o seu valor.
    </p>
  );

  if (!full) {
    return (
      <Card className="space-y-2">
        <CardTitle>⚡ Contrate rápido</CardTitle>
        <p className="text-sm text-muted">Receba chamados na hora, como num app de corrida, com valor fixo por profissão. É exclusivo do plano <strong className="text-foreground">Completo</strong>.</p>
        <Link href="/painel/plano" className={buttonClass("primary", "md", "w-full")}>Quero o plano Completo</Link>
      </Card>
    );
  }

  if (!pro.quickTermsAt) {
    return (
      <Card className="space-y-3 border-primary/40">
        <CardTitle>⚡ Participar do Contrate rápido</CardTitle>
        <p className="text-sm text-muted">Clientes perto de você chamam na hora e o seu celular toca. As regras:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li><strong>Valor fixo</strong> por profissão, o mesmo para todos (você recebe tudo, sem taxa sobre o serviço).</li>
          <li>O primeiro que aceitar leva e tem <strong>{ARRIVE_HOURS} horas para chegar</strong>. Não chegou: {PRO_QUICK_BAN_DAYS} dias fora do Contrate rápido.</li>
          <li>Você pode recusar, mas <strong>quem aceita mais toca primeiro</strong>. Quem recusa muito (ou deixa tocar sem responder) desce na fila e quase não recebe chamado.</li>
          <li>Cliente não estava? Marque “Cheguei” e, depois de {CLIENT_NOSHOW_WAIT_MIN} minutos, registre: o cliente é penalizado.</li>
          <li>Terminou um serviço? Você volta a receber chamados na hora.</li>
          <li><strong>Chamados por hora</strong> só tocam para quem marcou “Também trabalho por hora” no perfil. A diária é de até 8 horas.</li>
        </ul>
        <p className="text-sm font-medium">Valores fixos dos seus serviços:</p>
        {prices}
        {outsideNote}
        <ActionForm action={acceptQuickTermsAction} className="space-y-3">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>Li e aceito as regras e os valores fixos do Contrate rápido.</span>
          </label>
          <SubmitButton className="w-full" pendingText="Salvando…">Quero participar</SubmitButton>
        </ActionForm>
      </Card>
    );
  }

  const stats = (await quickStats([pro.id])).get(pro.id) ?? { accepted: 0, missed: 0 };
  const rate = acceptRate(stats);
  const tier = acceptTier(rate);
  return (
    <Card className="space-y-3">
      <ActionSwitch
        on={pro.quickOn && !banned && visible}
        action={setQuickAction}
        label="⚡ Disponível para o Contrate rápido"
        hint="Ligado, seu celular toca quando um cliente perto chamar. Quem aceitar primeiro leva e tem 2 horas para chegar."
      />
      {banned && <p className="rounded-lg bg-danger/10 p-2 text-xs text-danger">Você aceitou um chamado e não chegou em 2 horas. Fica fora do Contrate rápido até {fmt(banned)}. Os pedidos normais continuam.</p>}
      <div className="rounded-xl bg-surface-2 p-3 text-sm">
        <p className="flex justify-between"><span>Sua taxa de aceite (30 dias)</span><strong>{rate == null ? "—" : `${Math.round(rate * 100)}%`}</strong></p>
        <p className="mt-1 text-xs text-muted">
          {rate == null
            ? `Ainda poucos chamados (menos de ${QUICK_MIN_SAMPLE}). Você está no topo da fila.`
            : tier === 0
              ? "Ótimo! Você está no topo da fila dos chamados."
              : tier === 1
                ? "Você está no meio da fila. Aceite mais chamados para tocar primeiro."
                : "Você recusa muitos chamados e quase não está tocando. Aceite mais para voltar ao topo."}
          {" "}({stats.accepted} aceito(s), {stats.missed} recusado(s) ou sem resposta)
        </p>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-primary">Valores fixos dos seus serviços</summary>
        <div className="mt-2 space-y-2">{prices}{outsideNote}</div>
      </details>
      <PushToggle />
      <ActionButton action={leaveQuickAction} variant="ghost" size="sm" className="text-muted" confirm="Sair do Contrate rápido?">Sair do Contrate rápido</ActionButton>
    </Card>
  );
}
