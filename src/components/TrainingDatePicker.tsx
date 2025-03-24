"use client";

import { format, startOfDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Training } from "@/types";
import TrainingForm from "./forms/TrainingForm";
import { useState } from "react";

type Props = {
  eventId: number;
  eventName: string;
  training?: Training;
  className?: string;
  children?: React.ReactNode;
};

export default function TrainingDatePicker({
  children,
  eventId,
  eventName,
  training,
  className,
}: Props) {
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const formatDate = (date: string | Date) =>
    format(date, "d MMMM yyyy", { locale: it });

  console.log(date);

  return (
    <>
      {date && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {training ? "Modifica Allenamento" : "Crea Nuovo Allenamento"}
              </DialogTitle>
              <DialogDescription>
                {training
                  ? `Modifica i dettagli per l'allenamento dell'evento ${eventName} in data ${formatDate(
                      training.trainingDate
                    )} per la data ${formatDate(date!)}`
                  : `Inserisci i dettagli per il nuovo allenamento dell'evento ${eventName} in data ${formatDate(
                      date!
                    )}`}
                .
              </DialogDescription>
            </DialogHeader>

            <TrainingForm
              eventId={eventId}
              eventName={eventName}
              trainingTimestamp={date}
              training={training}
              onSubmitSuccess={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          className={cn(
            `text-xs rounded-full font-medium gap-[6px]`,
            className
          )}
          asChild
        >
          <Button>{children}</Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={(day) => day < startOfDay(new Date())}
          />

          <div className="p-3 pt-0">
            <Button
              className="w-full"
              onClick={() => {
                if (!date) return;
                setIsPopoverOpen(false);
                setTimeout(() => setIsDialogOpen(true), 100);
              }}
              disabled={!date}
            >
              Scegli data
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
