// Service worker do Diária Paga: recebe as notificações (inclusive o "toque" dos chamados do Contrate rápido)
// e abre a tela certa ao tocar.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = { title: "Diária Paga", body: "", href: "/notificacoes" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  const quick = data.kind === "quick";
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { href: data.href },
      lang: "pt-BR",
      tag: quick ? "chamado" : undefined,
      renotify: quick,
      requireInteraction: quick,
      // chamado: vibração longa, tipo toque de corrida (o som é o do celular; com o app aberto toca o som do chamado)
      vibrate: quick ? [600, 250, 600, 250, 600, 250, 900] : [200],
      actions: quick ? [{ action: "abrir", title: "Ver chamado" }] : [],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = (event.notification.data && event.notification.data.href) || "/notificacoes";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ("focus" in w) {
          w.navigate(href);
          return w.focus();
        }
      }
      return self.clients.openWindow(href);
    }),
  );
});

// necessário para o app ser instalável; não guarda nada em cache (o conteúdo é sempre do servidor)
self.addEventListener("fetch", () => {});
