import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgeCheck, CalendarDays, MessageCircle, Wallet, Zap } from "lucide-react";
import { ActionForm } from "@/components/action-form";
import { PageTitle } from "@/components/bits";
import { PhoneInput } from "@/components/masked-inputs";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/form";
import { db } from "@/lib/db";
import { PLANS, TRIAL_DAYS, formatBRL } from "@/lib/domain";
import { homeOf, requireUser } from "@/lib/session";
import { becomeWorkerAction } from "./actions";

export const metadata: Metadata = { title: "Turbinar conta" };

export default async function BecomeWorkerPage() {
  const user = await requireUser("/seja-prestador");
  if (user.provider) redirect("/painel");
  if (user.role === "ADMIN") redirect(homeOf(user));
  const ledger = await db.cpfLedger.findUnique({ where: { cpfHash: user.cpfHash } });
  const trial = !ledger?.trialStartedAt;
  const perks = [
    { icon: Zap, t: "Chamados na hora", d: "Clientes perto chamam pelo Contrate rápido (plano Completo)." },
    { icon: Wallet, t: "Sem comissão", d: "O cliente paga direto para você. Gestão financeira no app." },
    { icon: CalendarDays, t: "Sua agenda", d: "Agende pela conversa e receba lembretes." },
    { icon: MessageCircle, t: "Mensagens", d: "Texto, áudio, foto e vídeo, com mensagens rápidas." },
    { icon: BadgeCheck, t: "Vários perfis", d: "Um perfil para cada profissão que você faz." },
  ];
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageTitle title="🚀 Turbinar conta para trabalhador" subtitle={trial ? `${TRIAL_DAYS} dias grátis. Depois, planos a partir de ${formatBRL(PLANS.BASIC.priceCents)} por mês.` : `Planos a partir de ${formatBRL(PLANS.BASIC.priceCents)} por mês. Este CPF já usou o teste grátis.`} />
      <div className="grid grid-cols-2 gap-3">
        {perks.map((p) => (
          <Card key={p.t} className="p-3">
            <p.icon size={20} className="text-primary" />
            <p className="mt-1 text-sm font-semibold">{p.t}</p>
            <p className="text-xs text-muted">{p.d}</p>
          </Card>
        ))}
      </div>
      <Card>
        <ActionForm action={becomeWorkerAction} className="space-y-4">
          <div>
            <Label htmlFor="phone">Seu WhatsApp</Label>
            <PhoneInput />
            <p className="mt-1 text-xs text-muted">Só para a plataforma (segurança e Pix). Nunca aparece para os clientes.</p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="adult" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>Tenho 18 anos ou mais e sei que não posso passar telefone ou WhatsApp para os clientes.</span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>Li e aceito os <Link href="/termos" target="_blank" className="text-primary underline">Termos de uso</Link>.</span>
          </label>
          <SubmitButton className="w-full" size="lg" pendingText="Turbinando…">{trial ? `Turbinar e ganhar ${TRIAL_DAYS} dias grátis` : "Turbinar conta"}</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
