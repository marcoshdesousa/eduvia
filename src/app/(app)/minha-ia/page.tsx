import { BrainCircuit } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { db } from "@/lib/db";
import { localDayStart } from "@/lib/billing";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ConnectAiForm } from "@/components/connect-ai-form";
import { formatDay } from "@/lib/core/dates";

export const metadata = { title: "Minha IA" };

export default async function Page() {
  const user = await requireReadyUser();
  const usesToday = await db.aiUsage.count({ where: { userId: user.id, createdAt: { gte: localDayStart(user.timezone) } } });
  const paused = user.aiPausedUntil && user.aiPausedUntil > new Date() ? user.aiPausedUntil : null;
  const time = (d: Date) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: user.timezone });
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><BrainCircuit className="text-primary" /> Minha IA</h1>
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Google Gemini</CardTitle>
          {paused ? <Badge tone="warning">Em pausa até {time(paused)}</Badge> : <Badge tone="success">✅ IA conectada</Badge>}
        </div>
        <ul className="space-y-1 text-sm text-muted">
          <li>Chave terminando em <span className="font-mono text-foreground">…{user.geminiKeyHint}</span>{user.geminiConnectedAt && <> · conectada em {formatDay(user.geminiConnectedAt, { day: "2-digit", month: "short", year: "numeric" })}</>}</li>
          <li>Usos da IA hoje: <span className="text-foreground">{usesToday}</span></li>
        </ul>
        {paused && (
          <p className="text-sm text-warning">
            O Google pediu uma pausa para a sua chave (limite grátis). Ela volta sozinha às {time(paused)}. Enquanto isso, revisões, banco de erros e leitura dos seus PDFs continuam funcionando.
          </p>
        )}
      </Card>
      <Card className="space-y-4">
        <CardTitle>Trocar a chave</CardTitle>
        <ConnectAiForm hint={user.geminiKeyHint} />
      </Card>
      <Card className="space-y-2 text-sm">
        <CardTitle>Quer uma IA com mais fôlego?</CardTitle>
        <p className="text-muted">
          A chave grátis dá conta de um dia normal de estudo. Se quiser limites maiores no Google, ative o <strong className="text-foreground">faturamento</strong> no seu projeto do Google AI Studio
          (você paga só o que usar, direto ao Google, e nesse modo o Google não usa seus dados para treinar a IA). A chave continua a mesma.
        </p>
        <p className="text-muted">
          Atenção: assinar o app Gemini (Google AI Pro) <strong className="text-foreground">não</strong> aumenta nada aqui, porque essa assinatura não vale para chaves de API.
        </p>
      </Card>
    </div>
  );
}
