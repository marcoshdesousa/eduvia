import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/brand";
import { requireUser } from "@/lib/session";
import { AiConnectCard } from "@/components/extra-ai-keys";
import { Steps } from "@/app/cadastro/signup-form";
import { signOutAction } from "@/app/actions/account";
import { buttonClass, Button } from "@/components/ui/button";
import { ALL_PROVIDERS, disabledProviders, hasKey, type AiProvider } from "@/lib/ai/providers";

export const metadata = { title: "Conecte suas IAs" };

const HINT = { gemini: "geminiKeyHint", cerebras: "cerebrasKeyHint", groq: "groqKeyHint", openrouter: "openrouterKeyHint" } as const;

/** Passo 2 do cadastro: conectar as IAs (todas obrigatórias). Cada uma é salva na hora. */
export default async function Page() {
  const user = await requireUser();
  if (!user.handle || !user.termsAcceptedAt || !user.cpf || !user.phone) redirect("/boas-vindas");
  const off = await disabledProviders();
  const providers = ALL_PROVIDERS.filter((p) => !off.includes(p));
  const done = providers.filter((p) => hasKey(user, p)).length;
  const all = done === providers.length;
  return (
    <AuthShell title="Conecte suas IAs" subtitle={`Passo final: ${done} de ${providers.length} conectadas.`}>
      <div className="space-y-4">
        <Steps step={2} />
        <div className="space-y-2 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-primary" /> Esse processo é importante</p>
          <p className="text-muted">
            Vamos conectar {providers.length} IAs ao seu Eduvia para o sistema funcionar corretamente, rápido e sem pausas, e para você ter
            seus próprios dados nas suas contas. Nosso sistema funciona com todas essas IAs, e elas são grátis: não precisa de plano
            nem de cartão para conectar.
          </p>
          <p className="text-muted">Cada uma leva uns 2 minutos. Pode fazer com calma: o que você conectar fica salvo, mesmo se sair da tela.</p>
        </div>
        {providers.map((p: AiProvider, i) => (
          <AiConnectCard key={p} provider={p} step={i + 1} hint={(user[HINT[p]] as string | null) ?? null} removable={false} />
        ))}
        {all ? (
          <Link href="/inicio" className={buttonClass("primary", "md", "w-full")}>
            <CheckCircle2 size={16} /> Tudo pronto! Começar a estudar
          </Link>
        ) : (
          <p className="text-center text-sm text-muted">Conecte as {providers.length - done} IA(s) que faltam para começar.</p>
        )}
        <form action={signOutAction}>
          <Button variant="ghost" className="w-full">Continuar depois (sair)</Button>
        </form>
      </div>
    </AuthShell>
  );
}
