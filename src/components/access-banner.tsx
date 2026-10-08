import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { daysLeft, renewSoon, type Access } from "@/lib/billing";
import { formatDay } from "@/lib/core/dates";

/** "vence hoje", "vence amanhã", "vence em 2 dias" (pelo calendário do aluno). */
export function dueText(until: Date, tz?: string) {
  const d = daysLeft(until, tz);
  const day = formatDay(until, { day: "2-digit", month: "2-digit" });
  return d <= 0 ? `vence hoje (${day})` : d === 1 ? `vence amanhã (${day})` : `vence em ${d} dias (${day})`;
}

/** Aviso fixo no topo de todas as telas: plano perto de vencer (2 dias antes) ou plano que venceu há pouco. */
export function AccessBanner({ access, tz }: { access: Access; tz?: string }) {
  if (access.reason === "dev") return null;
  if (access.reason === "subscription") {
    if (!renewSoon(access, tz)) return null;
    return <Bar tone="warning" icon={<Sparkles size={15} />} text={`Seu plano ${access.planName} ${dueText(access.until, tz)}. Pague o próximo mês para não parar.`} cta="Pagar agora" />;
  }
  if (access.ended) {
    return <Bar tone="danger" icon={<Lock size={15} />} text={`Seu plano ${access.ended.planName} venceu e você voltou para o Grátis. Renove e libere tudo de novo.`} cta="Renovar" />;
  }
  return null;
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
