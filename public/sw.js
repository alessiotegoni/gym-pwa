self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    // console.log(data);

    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/icon.png",
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

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // console.log("Finestre aperte:", clientList.length);

      let matchingClient = null;

      for (const client of clientList) {
        // console.log(client);

        const clientPathname = new URL(client.url).pathname;

        // console.log(
        //   "Path corrente:",
        //   clientPathname,
        //   "URL da aprire:",
        //   urlToOpen
        // );
        // console.log("Finestra attiva:", client.focused);

        if (clientPathname === urlToOpen) {
          matchingClient = client;
          break;
        }
      }

      if (matchingClient) {
        if (!matchingClient.focused && "focus" in matchingClient) {
          // console.log("Focalizza la finestra esistente");
          return matchingClient.focus();
        }
      } else {
        // console.log("Apre una nuova finestra");
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
