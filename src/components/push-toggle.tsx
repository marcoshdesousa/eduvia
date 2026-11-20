"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensurePushSubscribed } from "@/lib/push-client";

/** Liga/desliga as notificações no celular (push). */
export function PushToggle() {
  const [state, setState] = useState<"loading" | "off" | "on" | "unsupported" | "denied">("loading");
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return setState("unsupported");
    if (Notification.permission === "denied") return setState("denied");
    void navigator.serviceWorker.register("/sw.js").then(async (reg) => setState((await reg.pushManager.getSubscription()) ? "on" : "off")).catch(() => setState("unsupported"));
  }, []);
  const toggle = async () => {
    const reg = await navigator.serviceWorker.ready;
    if (state === "on") {
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      return setState("off");
    }
    setState("loading");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return setState(perm === "denied" ? "denied" : "off");
    setState((await ensurePushSubscribed()) ? "on" : "unsupported");
  };
  if (state === "unsupported") return <p className="text-sm text-muted">Este navegador não recebe notificações. No iPhone, adicione o Diária Paga à tela de início primeiro (veja “Instalar o app”).</p>;
  if (state === "denied") return <p className="text-sm text-muted">As notificações estão bloqueadas nas configurações do navegador.</p>;
  return (
    <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={state === "loading"}>
      {state === "loading" ? <Loader2 size={16} className="animate-spin" /> : state === "on" ? <BellOff size={16} /> : <Bell size={16} />}
      {state === "on" ? "Desligar notificações no celular" : "Ligar notificações no celular"}
    </Button>
  );
}
