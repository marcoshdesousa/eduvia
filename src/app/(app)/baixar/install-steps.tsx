"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Download, Share, SquarePlus } from "lucide-react";
import { PushToggle } from "@/components/push-toggle";
import { isStandalone, useServiceWorker } from "@/components/install-app";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallSteps() {
  useServiceWorker();
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    setInstalled(isStandalone());
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return (
    <div className="space-y-4">
      {installed ? (
        <Card className="flex items-center gap-3 border-success/40 bg-success/5">
          <CheckCircle2 className="text-success" /> <p className="text-sm font-medium">O app já está instalado neste aparelho. 🎉</p>
        </Card>
      ) : evt ? (
        <Button size="lg" className="dp-ring w-full" onClick={async () => { await evt.prompt(); const r = await evt.userChoice; if (r.outcome === "accepted") setInstalled(true); }}>
          <Download size={18} /> Instalar o Diária Paga
        </Button>
      ) : null}

      <Card className={`space-y-3 ${ios ? "border-primary/50" : ""}`}>
        <CardTitle>📱 iPhone (Safari)</CardTitle>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-bold">1.</span> Abra este site no <strong>Safari</strong>.</li>
          <li className="flex gap-2"><span className="font-bold">2.</span> Toque em <Share size={16} className="inline text-primary" /> <strong>Compartilhar</strong> (na barra de baixo).</li>
          <li className="flex gap-2"><span className="font-bold">3.</span> Escolha <SquarePlus size={16} className="inline text-primary" /> <strong>Adicionar à Tela de Início</strong> e toque em Adicionar.</li>
          <li className="flex gap-2"><span className="font-bold">4.</span> Abra o Diária Paga pelo ícone novo e ligue as notificações abaixo.</li>
        </ol>
      </Card>
      <Card className={`space-y-3 ${!ios ? "border-primary/50" : ""}`}>
        <CardTitle>🤖 Android (Chrome)</CardTitle>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-bold">1.</span> Toque no botão <strong>Instalar</strong> acima, ou no menu <strong>⋮</strong> do Chrome.</li>
          <li className="flex gap-2"><span className="font-bold">2.</span> Escolha <strong>Instalar app</strong> (ou “Adicionar à tela inicial”).</li>
          <li className="flex gap-2"><span className="font-bold">3.</span> Abra pelo ícone e ligue as notificações abaixo.</li>
        </ol>
      </Card>
      <Card className="space-y-3">
        <CardTitle>🔔 Notificações</CardTitle>
        <p className="text-sm text-muted">Ligue para saber na hora quando o prestador aceitar, quando chegar mensagem e, se você é prestador, quando tocar um chamado do Contrate rápido.</p>
        <PushToggle />
        <p className="text-xs text-muted">Com o app aberto, os chamados tocam com som. Com o celular bloqueado, chegam como notificação com vibração forte (o som é o de notificação do seu celular).</p>
      </Card>
    </div>
  );
}
