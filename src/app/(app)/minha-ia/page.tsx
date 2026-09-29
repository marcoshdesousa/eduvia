import { KeyRound } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ConnectAiForm } from "@/components/connect-ai-form";
import { formatDay } from "@/lib/core/dates";

export const metadata = { title: "Chave de acesso" };

/** Ver ou trocar a chave do Google usada na ativação (fica só em Ajustes, sem destaque). */
export default async function Page() {
  const user = await requireReadyUser();
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><KeyRound className="text-primary" /> Chave de acesso</h1>
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
      <Card className="space-y-4">
        <CardTitle>Trocar a chave</CardTitle>
        <ConnectAiForm hint={user.geminiKeyHint} />
      </Card>
    </div>
  );
}
