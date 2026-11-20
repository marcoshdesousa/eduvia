import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgeCheck, MessageCircle, Wallet, Zap } from "lucide-react";
import { PageTitle } from "@/components/bits";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { MIN_AGE, PLANS, TRIAL_DAYS, formatBRL } from "@/lib/domain";
import { homeOf, requireUser } from "@/lib/session";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Seja prestador" };

export default async function BecomeProviderPage() {
  const user = await requireUser("/seja-prestador");
  if (user.provider) redirect("/painel");
  if (user.role === "ADMIN") redirect(homeOf(user));
  const ledger = await db.cpfLedger.findUnique({ where: { cpfHash: user.cpfHash } });
  const trial = !ledger?.trialStartedAt;
  const now = new Date();
  const maxBirth = new Date(Date.UTC(now.getUTCFullYear() - MIN_AGE, now.getUTCMonth(), now.getUTCDate())).toISOString().slice(0, 10);
  const perks = [
    { icon: Zap, t: "Chamados na hora", d: "Clientes perto de você chamam pelo Contrate rápido." },
    { icon: Wallet, t: "Sem comissão", d: "O cliente paga direto para você: Pix, dinheiro ou cartão." },
    { icon: MessageCircle, t: "Chat completo", d: "Texto, áudio, foto e vídeo, tudo dentro do app." },
    { icon: BadgeCheck, t: "Seu perfil", d: "Fotos dos seus trabalhos, avaliações e Instagram." },
  ];
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageTitle title="Trabalhe com o Diária Paga" subtitle={trial ? `Comece com ${TRIAL_DAYS} dias grátis do plano Completo. Depois, a partir de ${formatBRL(PLANS.BASIC.priceCents)} por mês.` : `Planos a partir de ${formatBRL(PLANS.BASIC.priceCents)} por mês. Este CPF já usou o teste grátis.`} />
      <div className="grid grid-cols-2 gap-3">
        {perks.map((p) => (
          <Card key={p.t} className="p-3">
            <p.icon size={20} className="text-primary" />
            <p className="mt-1 text-sm font-semibold">{p.t}</p>
            <p className="text-xs text-muted">{p.d}</p>
          </Card>
        ))}
      </div>
      <OnboardingForm maxBirth={maxBirth} trial={trial} />
    </div>
  );
}
