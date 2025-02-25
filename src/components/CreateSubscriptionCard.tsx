"use client";
import { motion } from "motion/react";
import { GlowEffect } from "@/components/ui/glow-effect";
import { ComponentProps, useState } from "react";
import { TextMorph } from "./ui/text-morph";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { userCreateSubscription } from "@/actions/subscriptions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateSubscriptionCard({
  className,
  ...props
}: ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateSubscription() {
    if (isLoading) return;
    setIsLoading(true);

    const res = await userCreateSubscription();
    setIsLoading(false);

    if (res?.error) {
      toast.error("Errore durante l'iscrizione, riprova piu tardi");
      return;
    }
  }

  return (
    <div className={cn("relative", className)} {...props}>
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          opacity: isLoading ? 0.33 : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        {isLoading && (
          <GlowEffect
            colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
            mode="colorShift"
            blur="medium"
            duration={4}
          />
        )}
      </motion.div>
      <div className="relative flex flex-col gap-4 items-start rounded-xl border border-zinc-300/40 bg-zinc-100 px-4 py-3 dark:border-zinc-700/40 dark:bg-zinc-900">
        <div className="flex items-start gap-2">
          <AlertCircle className="!size-12" />
          <div>
            <p className="font-semibold">Non hai abbonamenti attivi.</p>
            <p className="text-xs mt-0.5 text-muted-foreground">
              Per accedere al servizio attiva un abbonamento
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateSubscription}
          disabled={isLoading}
          className="self-end"
        >
          <TextMorph>{isLoading ? "Attivando..." : "Attiva ora"}</TextMorph>
        </Button>
      </div>
    </div>
  );
}
