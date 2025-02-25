"use client";

import { createBooking } from "@/actions/bookings";
import { toast } from "sonner";
import { useTransition } from "react";
import SubmitBtn from "./SubmitBtn";
import { NotebookPen } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  scheduleId: number;
  bookingDate: Date;
  bookingCutoffMinutes: number | null;
} & ButtonProps;

export default function CreateBookingBtn({
  scheduleId,
  bookingDate,
  bookingCutoffMinutes,
  className,
  ...props
}: Props) {
  const [isPending, startCreateTransition] = useTransition();

  function handleCreate() {
    if (isPending) return;
    startCreateTransition(async () => {
      const res = await createBooking(
        scheduleId,
        bookingDate,
        bookingCutoffMinutes
      );
      if (res?.error) {
        toast.error(res.message ?? "Errore nella creazione della prenotazione");
        return;
      }

      toast.success("Prenotazione creata con successo!", {
        action: (
          <Button size="sm" asChild>
            <Link href="/user">Vedi prenotazioni</Link>
          </Button>
        ),
      });
    });
  }

  return (
    <SubmitBtn
      onClick={handleCreate}
      label="Prenota"
      className={cn("w-fit", className)}
      isLoading={isPending}
      {...props}
    >
      <NotebookPen />
    </SubmitBtn>
  );
}
