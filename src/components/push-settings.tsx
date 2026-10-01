"use client";
import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff } from "lucide-react";
import { setRemindersAction } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    // guarda o convite de instalação do navegador (Android/Chrome) para o botão "Instalar"
    const onPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __eduviaInstall?: Event }).__eduviaInstall = e;
      window.dispatchEvent(new Event("eduvia-install-ready"));
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  return null;
}

type State = "unsupported" | "denied" | "off" | "on" | "loading";

/** Pede permissão e inscreve este aparelho para receber notificações. */
export async function enablePush(vapidKey: string): Promise<"on" | "denied" | "off" | { error: string }> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";
  // não deixa o botão travado se o celular demorar a responder
  const reg = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 15_000)),
  ]);
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) });
  const res = await fetch("/api/push", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub.toJSON()) });
  if (!res.ok) {
    await sub.unsubscribe();
    return { error: (await res.json().catch(() => ({}))).error ?? "Não foi possível ativar." };
  }
  return "on";
}

/**
 * Convite para ativar as notificações (aparece enquanto o aparelho não estiver inscrito).
 * Fechar esconde só até a próxima visita.
 */
export function EnableNotificationsBanner({ vapidKey }: { vapidKey: string | null }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      if (!vapidKey || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
      if (Notification.permission === "denied") return;
      try {
        if (sessionStorage.getItem("eduvia:push-later") === "1") return;
      } catch {}
      const reg = await navigator.serviceWorker.register("/sw.js");
      if (!(await reg.pushManager.getSubscription())) setShow(true);
    })().catch(() => {});
  }, [vapidKey]);
  if (note) {
    return (
      <div role="status" className="border-b border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm">
        {note}
      </div>
    );
  }
  if (!show) return null;
  const later = () => {
    try {
      sessionStorage.setItem("eduvia:push-later", "1");
    } catch {}
  };
  return (
    <div className="flex items-center gap-3 border-b border-primary/30 bg-primary/10 px-4 py-2 text-sm">
      <Bell size={16} className="shrink-0 text-primary" />
      <span className="min-w-0 flex-1">Ative as notificações para receber o lembrete na hora de estudar.</span>
      <Button
        size="sm"
        disabled={busy}
        onClick={async () => {
          // o aviso some assim que a pessoa toca, dando certo ou não
          setBusy(true);
          later();
          const r = await enablePush(vapidKey!).catch(() => ({ error: "Não foi possível ativar agora." }));
          setBusy(false);
          setShow(false);
          setNote(
            r === "on"
              ? "Pronto! Notificações ativadas ✅"
              : r === "denied"
                ? "As notificações ficaram bloqueadas. Dá para liberar nos ajustes do celular."
                : r === "off"
                  ? null
                  : `${r.error} Você pode tentar de novo em Mais → Configurações.`,
          );
          setTimeout(() => setNote(null), 5000);
        }}
      >
        Ativar
      </Button>
      <button
        type="button"
        aria-label="Agora não"
        className="text-xs text-muted hover:text-foreground"
        onClick={() => {
          setShow(false);
          later();
        }}
      >
        Agora não
      </button>
    </div>
  );
}

export function PushSettings({ vapidKey, remindersEnabled }: { vapidKey: string | null; remindersEnabled: boolean }) {
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [reminders, setReminders] = useState(remindersEnabled);
  const [pending, start] = useTransition();

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !vapidKey) return setState("unsupported");
      if (Notification.permission === "denied") return setState("denied");
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, [vapidKey]);

  async function enable() {
    setMessage(null);
    const r = await enablePush(vapidKey!);
    if (r === "on") {
      setState("on");
      setMessage("Pronto! Enviamos uma notificação de teste.");
    } else if (r === "denied" || r === "off") setState(r);
    else setMessage(r.error);
  }

  async function disable() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
      await sub.unsubscribe();
    }
    setState("off");
  }

  return (
    <div className="space-y-3 text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={reminders}
          disabled={pending}
          onChange={(e) => {
            const v = e.target.checked;
            setReminders(v);
            start(() => setRemindersAction(v));
          }}
          className="accent-[var(--primary)]"
        />
        Lembrete no horário de estudo de cada preparação
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {state === "on" ? (
          <Button type="button" variant="outline" size="sm" onClick={disable}><BellOff size={15} /> Desativar neste aparelho</Button>
        ) : state === "off" ? (
          <Button type="button" size="sm" onClick={enable}><Bell size={15} /> Ativar notificações neste aparelho</Button>
        ) : null}
        <span className="text-muted">
          {state === "on" && "Notificações ativas neste aparelho."}
          {state === "denied" && "As notificações estão bloqueadas no navegador. Libere nas configurações do site."}
          {state === "unsupported" && (vapidKey ? "Este navegador não suporta notificações. No iPhone, adicione o Eduvia à tela de início primeiro." : "Notificações push ainda não foram configuradas no servidor.")}
        </span>
      </div>
      {message && <p className="text-success">{message}</p>}
      <p className="text-xs text-muted">Os avisos também ficam no sino 🔔 do app.</p>
    </div>
  );
}
