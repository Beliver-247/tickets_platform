self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    title: "New ticket request",
    body: "A new ticket request needs review.",
    url: "/admin/orders",
  };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // Keep a visible fallback notification if a push payload cannot be parsed.
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      requireInteraction: true,
      data: { url: data.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? "/admin/orders", self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((window) => window.url.startsWith(self.location.origin));
      if (existing) {
        existing.focus();
        return existing.navigate(url);
      }
      return clients.openWindow(url);
    }),
  );
});
