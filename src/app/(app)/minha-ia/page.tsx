import { KeyRound } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ConnectAiForm } from "@/components/connect-ai-form";
import { AiTestButton } from "@/components/ai-test-button";
import { formatDay } from "@/lib/core/dates";
import { ExtraAiCard } from "@/components/extra-ai-keys";
import { IA_EXTRA_XP } from "@/lib/ai/extra";

export const metadata = { title: "Minhas IAs" };

/** Ver ou trocar a chave do Google usada na ativação (fica só em Ajustes, sem destaque). */
export default async function Page() {
  const user = await requireReadyUser();
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><KeyRound className="text-primary" /> Minhas IAs</h1>
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Chave do Google</CardTitle>
          <Badge tone="success">✅ Conectada</Badge>
        </div>
        <p className="text-sm text-muted">
          Termina em <span className="font-mono text-foreground">…{user.geminiKeyHint}</span>
          {user.geminiConnectedAt && <> · conectada em {formatDay(user.geminiConnectedAt, { day: "2-digit", month: "short", year: "numeric" })}</>}
        </p>
      </Card>
      <Card id="turbo" className="space-y-4">
        <div className="space-y-1">
          <CardTitle>⚡ Turbine sua IA ({1 + Number(!!user.groqKeyHint) + Number(!!user.cerebrasKeyHint)} de 3)</CardTitle>
          <p className="text-sm text-muted">
            Conecte mais 2 IAs grátis e o Eduvia passa a usar as 3 juntas: quando uma está ocupada ou no limite do dia, a outra
            responde na hora. Menos espera, nada de &quot;descanse&quot; e perguntas mais rápidas. Cada uma leva uns 2 minutos e
            vale <strong className="text-foreground">+{IA_EXTRA_XP} XP</strong>.
          </p>
        </div>
        <ExtraAiCard provider="groq" hint={user.groqKeyHint} />
        <ExtraAiCard provider="cerebras" hint={user.cerebrasKeyHint} />
      </Card>
      <Card className="space-y-3">
        <CardTitle>Testar</CardTitle>
        <p className="text-sm text-muted">Faz um pedido bem pequeno para conferir se está tudo funcionando.</p>
        <AiTestButton />
      </Card>
      <Card className="space-y-4">
        <CardTitle>Trocar a chave</CardTitle>
        <ConnectAiForm hint={user.geminiKeyHint} />
      </Card>
    </div>
  );
}
