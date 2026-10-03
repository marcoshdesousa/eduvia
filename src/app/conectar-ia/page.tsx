import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/brand";
import { requireUser } from "@/lib/session";
import { AiConnectCard } from "@/components/extra-ai-keys";
import { Steps } from "@/app/cadastro/signup-form";
import { signOutAction } from "@/app/actions/account";
import { buttonClass, Button } from "@/components/ui/button";
import { ALL_PROVIDERS, disabledProviders, hasKey, providerLabel } from "@/lib/ai/providers";
import { cn } from "@/lib/utils";

export const metadata = { title: "Conecte suas IAs" };

const HINT = { gemini: "geminiKeyHint", groq: "groqKeyHint", openrouter: "openrouterKeyHint" } as const;

/**
 * Passo 2 do cadastro: conectar as IAs (todas obrigatórias), UMA POR TELA para não confundir.
 * Cada uma é salva na hora; ao conectar, a tela já mostra a próxima. Se sair, volta de onde parou.
 */
export default async function Page() {
  const user = await requireUser();
  if (!user.handle || !user.termsAcceptedAt || !user.cpf || !user.phone) redirect("/boas-vindas");
  const off = await disabledProviders();
  const providers = ALL_PROVIDERS.filter((p) => !off.includes(p));
  const done = providers.filter((p) => hasKey(user, p));
  const current = providers.find((p) => !hasKey(user, p));
  const index = current ? providers.indexOf(current) : providers.length;
  return (
    <AuthShell title="Conecte suas IAs" subtitle={current ? `IA ${index + 1} de ${providers.length}` : "Tudo conectado!"}>
      <div className="space-y-4">
        <Steps step={2} />
        <ol className="flex gap-1.5" aria-label="Andamento">
          {providers.map((p, i) => (
            <li
              key={p}
              title={providerLabel(p)}
              className={cn("h-1.5 flex-1 rounded-full", hasKey(user, p) ? "bg-success" : i === index ? "bg-primary" : "bg-surface-2")}
            />
          ))}
        </ol>
        {current ? (
          <>
            {done.length === 0 && (
              <div className="space-y-2 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-primary" /> Esse processo é importante</p>
                <p className="text-muted">
                  Vamos conectar {providers.length} IAs ao seu Eduvia, uma de cada vez, para o sistema funcionar corretamente, rápido e
                  sem pausas, e para você ter seus próprios dados nas suas contas. Nosso sistema funciona com todas essas IAs, e elas são
                  grátis: não precisa de plano nem de cartão para conectar.
                </p>
              </div>
            )}
            {done.length > 0 && (
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 size={16} /> {done.map(providerLabel).join(", ")} conectada{done.length > 1 ? "s" : ""}. Agora a próxima:
              </p>
            )}
            <AiConnectCard key={current} provider={current} step={index + 1} hint={(user[HINT[current]] as string | null) ?? null} removable={false} />
            <p className="text-center text-xs text-muted">O que você conectar fica salvo, mesmo se sair da tela.</p>
          </>
        ) : (
          <div className="space-y-4 rounded-xl border border-success/40 bg-success/10 p-5 text-center">
            <CheckCircle2 size={36} className="mx-auto text-success" />
            <p className="font-semibold">Suas {providers.length} IAs estão conectadas!</p>
            <p className="text-sm text-muted">Agora é só enviar seus materiais e começar a estudar.</p>
            <Link href="/inicio" className={buttonClass("primary", "md", "w-full")}>Tudo pronto! Começar a estudar</Link>
          </div>
        )}
        <form action={signOutAction}>
          <Button variant="ghost" className="w-full">Continuar depois (sair)</Button>
        </form>
      </div>
    </AuthShell>
  );
}
