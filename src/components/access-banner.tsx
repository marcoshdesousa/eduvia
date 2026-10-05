import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { daysLeft, renewSoon, type Access } from "@/lib/billing";
import { formatDay } from "@/lib/core/dates";

function timeLeft(until: Date) {
  const h = Math.max(0, Math.floor((until.getTime() - Date.now()) / 3_600_000));
  if (h < 24) return h <= 1 ? "menos de 1 hora" : `${h} horas`;
  const d = Math.ceil(h / 24);
  return d === 1 ? "1 dia" : `${d} dias`;
}

/** "vence hoje", "vence amanhã", "vence em 2 dias" (pelo calendário do aluno). */
export function dueText(until: Date, tz?: string) {
  const d = daysLeft(until, tz);
  const day = formatDay(until, { day: "2-digit", month: "2-digit" });
  return d <= 0 ? `vence hoje (${day})` : d === 1 ? `vence amanhã (${day})` : `vence em ${d} dias (${day})`;
}

/** Aviso fixo no topo de todas as telas: teste grátis, plano perto de vencer (2 dias antes) ou plano vencido. */
export function AccessBanner({ access, tz }: { access: Access; tz?: string }) {
  if (access.reason === "dev") return null;
  if (access.reason === "subscription") {
    if (!renewSoon(access, tz)) return null;
    return <Bar tone="warning" icon={<Sparkles size={15} />} text={`Seu plano ${access.planName} ${dueText(access.until, tz)}. Pague o próximo mês para não parar.`} cta="Pagar agora" />;
  }
  if (access.reason === "trial") {
    return <Bar tone="warning" icon={<Sparkles size={15} />} text={`Teste grátis: faltam ${timeLeft(access.until)}. Assine e continue estudando.`} cta="Assinar" />;
  }
  if (access.ended) {
    return <Bar tone="danger" icon={<Lock size={15} />} text={`Seu plano ${access.ended.planName} venceu. Pague o próximo mês e volte a estudar na hora.`} cta="Pagar agora" />;
  }
  return <Bar tone="danger" icon={<Lock size={15} />} text="Seu teste grátis acabou. Assine um plano para continuar estudando." cta="Assinar" />;
}

function Bar({ tone, icon, text, cta }: { tone: "primary" | "warning" | "danger"; icon: React.ReactNode; text: string; cta: string }) {
  const colors = { primary: "border-primary/30 bg-primary/10 text-primary", warning: "border-warning/30 bg-warning/10 text-warning", danger: "border-danger/30 bg-danger/10 text-danger" }[tone];
  return (
    <div className={`flex items-center justify-center gap-3 border-b px-4 py-2 text-xs sm:text-sm ${colors}`} role="status">
      <span className="inline-flex items-center gap-1.5">{icon}{text}</span>
      <Link href="/assinatura" className="shrink-0 rounded-md border border-current px-2 py-0.5 font-semibold underline-offset-2 hover:underline">
        {cta}
      </Link>
    </div>
  );
}
