// Notificações (push) no aparelho: inscrever esta conta para receber os avisos.
const b64 = (s: string) => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

export const pushSupported = () => typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

/** Inscreve o aparelho (com a permissão já dada). Devolve true se ficou inscrito. */
export async function ensurePushSubscribed() {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready);
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { key } = await fetch("/api/push").then((r) => (r.ok ? r.json() : { key: null })).catch(() => ({ key: null }));
    if (!key) return false;
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
  }
  const r = await fetch("/api/push", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub) }).catch(() => null);
  return !!r?.ok;
}
