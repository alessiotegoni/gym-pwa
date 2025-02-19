"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { cancelSubscription } from "@/actions/subscriptions";
import { Subscription } from "@/types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import SubmitBtn from "./SubmitBtn";
import { cn } from "@/lib/utils";

type Props = {
  subscription?: Partial<Subscription>;
  className?: string;
};

export default function DeleteSubscription({ subscription, className }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await cancelSubscription(subscription!);

    if (res?.error)
      toast({
        title: "Errore",
        description:
          "Impossibile cancellare l'abbonamento, contattattare la palestra",
        variant: "destructive",
      });

    setLoading(false);
  };

  return subscription &&
    !["expired", "canceled"].includes(subscription.status!) ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SubmitBtn
          isLoading={loading}
          label="Cancella Abbonamento"
          loadingLabel="Cancellando"
          className={cn("grow !mt-0 !bg-destructive text-white", className)}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sei sicuro di voler cancellare l'abbonamento?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione sara' irreversibile e non verra effetuatto nessun
            rimborso se non concordato con i titolari della palestra
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Chiudi</AlertDialogCancel>
          <AlertDialogAction asChild>
            <form
              onSubmit={handleCancelSubscription}
              className="!bg-transparent !p-0"
            >
              <SubmitBtn
                isLoading={loading}
                label="Cancella Abbonamento"
                loadingLabel="Cancellando"
              />
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
