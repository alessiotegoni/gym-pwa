"use client";

import { format, isToday } from "date-fns";
import { it } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { Pencil, Repeat, Trash2 } from "lucide-react";
import TrainingDatePicker from "@/components/TrainingDatePicker";
import { useState } from "react";
import TrainingImg from "@/components/TrainingImg";
import type { Training } from "@/types";
import { toast } from "sonner";
import { deleteTraining } from "@/actions/dailyTrainings";
import SubmitBtn from "@/components/SubmitBtn";
import { isTrainingEditable } from "@/lib/utils";

type Props = {
  eventId: number;
  eventName: string;
  training: Training;
};

export default function Training({ eventId, eventName, training }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(trainingId: number) {
    setIsDeleting(true);
    const res = await deleteTraining(trainingId);

    if (res?.error) {
      toast.error("Errore nell'eliminazione dell'allenamento");

      setIsDeleting(false);
      return;
    }

    toast.success("Allenamento eliminato con successo");

    setIsDeleting(false);
  }

  const formattedDate = format(training.trainingDate, "d MMMM yyyy", {
    locale: it,
  });

  return (
    <Card key={training.id}>
      <CardHeader>
        <CardTitle className="text-lg">
          {isToday(formattedDate) ? "Oggi" : formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrainingImg
          training={training}
          alt={
            training.description ||
            `Allenamento ${eventName} del giorno ${training.trainingDate}`
          }
        />
        <p className="text-sm text-white/80 mt-2">{training.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isTrainingEditable(training.trainingDate) ? (
          <>
            <TrainingDatePicker
              eventId={eventId}
              eventName={eventName}
              training={training}
              className="rounded-md px-3 font-semibold"
            >
              <Pencil className="size-4" />
              Modifica
            </TrainingDatePicker>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SubmitBtn
                  label="Elimina"
                  size="sm"
                  variant="destructive"
                  className="w-fit h-9"
                  isLoading={isDeleting}
                >
                  <Trash2 />
                </SubmitBtn>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Questo eliminerà
                    permanentemente l'allenamento del {formattedDate}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => handleDelete(training.id)}
                  >
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <TrainingDatePicker
            eventId={eventId}
            eventName={eventName}
            training={training}
            className="rounded-md px-3"
          >
            <Repeat className="size-4" />
            Riproponi
          </TrainingDatePicker>
        )}
      </CardFooter>
    </Card>
  );
}
