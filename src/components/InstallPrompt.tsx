"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlowEffect } from "./ui/glow-effect";
import { Share, PlusCircle } from "lucide-react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Intercetta l'evento di installazione PWA per Android
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (!isStandalone && !isIOS && deferredPrompt)
      toast.info("Aggiungi app", {
        action: { label: "Scarica", onClick: handleInstallClick },
      });
  }, [isIOS, deferredPrompt, isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA installata con successo!");
    } else {
      console.log("PWA non installata.");
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) return null;

  return (
    isIOS && (
      <div className="relative mb-3">
        {/* <GlowEffect
          colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
          className="opacity-30"
          mode="colorShift"
          blur="medium"
        /> */}
        <div className="relative card-primary">
          <h4 className="text-md font-semibold mb-2">
            📲 Installazione su iOS
          </h4>
          <p className="text-sm">Per installare l'app sul tuo iPhone o iPad:</p>
          <ol className="mt-2 space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Share className="text-blue-500 w-5 h-5" />
              <span>
                Tocca il pulsante <strong>Condividi</strong> in basso
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <PlusCircle className="text-green-500 w-5 h-5" />
              <span>
                Seleziona <strong>Aggiungi alla schermata Home</strong>
              </span>
            </li>
          </ol>
        </div>
      </div>
    )
  );
}

// Definizione del tipo per BeforeInstallPromptEvent (non esiste in TypeScript di default)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
