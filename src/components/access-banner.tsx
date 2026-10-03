import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import type { Access } from "@/lib/billing";

function timeLeft(until: Date) {
  const h = Math.max(0, Math.floor((until.getTime() - Date.now()) / 3_600_000));
  if (h < 24) return h <= 1 ? "menos de 1 hora" : `${h} horas`;
  const d = Math.ceil(h / 24);
  return d === 1 ? "1 dia" : `${d} dias`;
}

/** Aviso fixo no topo: plano Grátis ou assinatura perto de vencer. */
export function AccessBanner({ access }: { access: Access }) {
  if (access.reason === "dev") return null;
  if (access.reason === "subscription") {
    const soon = access.until.getTime() - Date.now() < 2 * 86_400_000;
    if (!soon) return null;
    return (
      <Bar tone="warning" icon={<Sparkles size={15} />} text={`Seu plano ${access.planName} vence em ${timeLeft(access.until)}.`} cta="Renovar" />
    );
  }
  if (access.reason === "trial") {
    return <Bar tone="warning" icon={<Sparkles size={15} />} text={`Teste grátis: faltam ${timeLeft(access.until)}. Assine e continue estudando.`} cta="Assinar" />;
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
