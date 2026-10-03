import { Bell, Smartphone } from "lucide-react";
import { requireReadyUser } from "@/lib/session";
import { vapidPublicKey } from "@/lib/notifications";
import { Card, CardTitle } from "@/components/ui/card";
import { InstallSteps } from "@/components/install-app";
import { PushSettings } from "@/components/push-settings";

export const metadata = { title: "Instalar o app" };

export default async function Page() {
  const user = await requireReadyUser();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Smartphone className="text-primary" /> Instalar o app</h1>
        <p className="text-sm text-muted">O Eduvia vira um app no seu celular direto pelo navegador, sem precisar de loja. Leva menos de 1 minuto.</p>
      </div>
      <Card className="space-y-3">
        <CardTitle>1. Instale</CardTitle>
        <InstallSteps />
      </Card>
      <Card className="space-y-3">
        <CardTitle className="flex items-center gap-2"><Bell size={18} className="text-primary" /> 2. Ative as notificações</CardTitle>
        <p className="text-sm text-muted">Assim você recebe o lembrete na hora de estudar, as respostas do suporte, convites de grupo e conquistas. No iPhone, ative depois de abrir o app pelo ícone.</p>
        <PushSettings vapidKey={await vapidPublicKey()} remindersEnabled={user.remindersEnabled} />
      </Card>
    </div>
  );
}
