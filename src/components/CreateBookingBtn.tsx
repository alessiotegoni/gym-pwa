"use client";

import { createBooking } from "@/actions/bookings";
import { toast } from "sonner";
import { useTransition } from "react";
import SubmitBtn from "./SubmitBtn";
import { isBefore, isToday } from "date-fns";
import { NotebookPen } from "lucide-react";

type Props = {
  scheduleId: number;
  bookingDate: Date;
};

export default function CreateBookingBtn({ scheduleId, bookingDate }: Props) {
  const [isPending, startCreateTransition] = useTransition();

  function handleCreate() {
    if (isPending) return;
    startCreateTransition(async () => {
      const res = await createBooking(scheduleId, bookingDate);
      if (res?.error) {
        toast.error("Errore nella creazione della prenotazione");
        return;
      }

      toast.success("Prenotazione creata con successo!");
    });
  }

  return (
    <SubmitBtn
      onClick={handleCreate}
      label="Prenota"
      className="w-fit"
      disabled={isToday(bookingDate) && isBefore(bookingDate, new Date())}
      isLoading={isPending}
    >
      <NotebookPen />
    </SubmitBtn>
  );
}
