"use client";

import { subscribeUser, unsubscribeUser } from "@/actions/pushNotifications";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setLoading(false);
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    console.log("Service worker registered");

    const sub = await registration.pushManager.getSubscription();
    if (!sub)
      toast.info(
        "Attiva le notifiche per ricevere informazioni su abbonamenti, corsi e novita"
      );
    setSubscription(sub);
    setLoading(false);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      toast.success("Notifiche attive");
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
    } catch (err) {
      await unsubscribeUser();
      toast.info("Riattiva manualmente le notifiche");
    }
  }

  async function unsubscribeFromPush() {
    const success = await subscription?.unsubscribe();

    if (success) {
      setSubscription(null);
      await unsubscribeUser();
    }
  }

  return {
    isSupported,
    loading,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  };
}
