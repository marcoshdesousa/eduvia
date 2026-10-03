import { KeyRound } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { Card, CardTitle } from "@/components/ui/card";
import { AiTestButton } from "@/components/ai-test-button";
import { AiConnectCard } from "@/components/extra-ai-keys";
import { ALL_PROVIDERS, disabledProviders } from "@/lib/ai/providers";

export const metadata = { title: "Minhas IAs" };

const HINT = { gemini: "geminiKeyHint", cerebras: "cerebrasKeyHint", groq: "groqKeyHint", openrouter: "openrouterKeyHint" } as const;

/** As IAs do aluno: ver, testar e trocar as chaves. */
export default async function Page() {
  const user = await requireReadyUser();
  const off = await disabledProviders();
  const providers = ALL_PROVIDERS.filter((p) => !off.includes(p));
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><KeyRound className="text-primary" /> Minhas IAs</h1>
      <p className="text-sm text-muted">
        O Eduvia usa as {providers.length} IAs juntas: quando uma está ocupada ou no limite do dia, a outra responde na hora.
      </p>
      <Card className="space-y-3">
        <CardTitle>Testar</CardTitle>
        <p className="text-sm text-muted">Faz um pedido bem pequeno para conferir se está tudo funcionando.</p>
        <AiTestButton />
      </Card>
      {providers.map((p) => (
        <AiConnectCard key={p} provider={p} hint={(user[HINT[p]] as string | null) ?? null} removable={false} />
      ))}
    </div>
  );
}
