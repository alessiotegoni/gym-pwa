self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    console.log(data);
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
        url: data.url || "/user",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  console.log(event);
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(clients.openWindow(urlToOpen));
});
