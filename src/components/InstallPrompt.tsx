"use client";

import { useEffect, useState } from "react";
import { Share, PlusCircle, Download } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA installata con successo!");
      setDeferredPrompt(null);
    } else {
      console.log("PWA non installata.");
    }
  };

  if (isStandalone) return null;

  return isIOS ? (
    <div className="relative card-primary mb-3">
      <h4 className="text-md font-semibold mb-2">📲 Installazione su iOS</h4>
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
  ) : deferredPrompt ? (
    <div className="relative card-primary mb-3">
      <h4 className="text-md font-semibold mb-2">📲 Installazione dell'app</h4>
      <p className="text-sm">
        Installa questa applicazione sul tuo dispositivo per un accesso più
        rapido e un'esperienza migliore.
      </p>
      <div className="mt-4">
        <Button onClick={handleInstallClick} className="w-full">
          <Download /> Installa app
        </Button>
      </div>
    </div>
  ) : null;
}
