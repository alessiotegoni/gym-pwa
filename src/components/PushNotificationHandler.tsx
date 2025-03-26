"use client";

import usePushNotifications from "@/hooks/usePushNotifications";
import { BellOff, BellRing } from "lucide-react";
import { Button } from "./ui/button";

export default function PushNotificationHandler() {
  const {
    isSupported,
    loading,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  } = usePushNotifications();

  if (loading || !isSupported) return null;

  // if (!isSupported)
  //   return (
  //     <Button
  //       variant="ghost"
  //       size="icon"
  //       onClick={() =>
  //         toast.error("Il tuo dispositivo non supporta le notifiche push")
  //       }
  //     >
  //       <BellOff className="!size-5" />
  //     </Button>
  //   );

  return subscription ? (
    <Button variant="ghost" size="icon" onClick={unsubscribeFromPush}>
      <BellRing className="!size-5" />
    </Button>
  ) : (
    <Button variant="ghost" size="icon" onClick={subscribeToPush}>
      <BellOff className="!size-5" />
    </Button>
  );
}
