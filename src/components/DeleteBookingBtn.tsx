"use client";

import { deleteBooking } from "@/actions/bookings";
import { ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { ReactNode, useTransition } from "react";
import { cn } from "@/lib/utils";
import SubmitBtn from "./SubmitBtn";
import { sendNotification } from "@/actions/pushNotifications";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

type Props = {
  bookingId: number;
  bookingDate?: Date;
  userId?: number;
  cancellationCutoffMinutes?: number | null;
  children?: ReactNode;
} & ButtonProps;

export default function DeleteBookingBtn({
  bookingId,
  userId,
  bookingDate,
  cancellationCutoffMinutes,
  children,
  className,
  ...props
}: Props) {
  const [isPending, startDeleteTransition] = useTransition();

  const pathname = usePathname();

  async function handleDelete() {
    if (isPending) return;
    startDeleteTransition(async () => {
      const res = await deleteBooking(
        bookingId,
        pathname,
        bookingDate,
        cancellationCutoffMinutes
      );
      if (res?.error) {
        toast.error(
          res.message ?? "Errore nell'eliminazione della prenotazione"
        );
        return;
      }

      toast.success("Prenotazione eliminata con successo!");
    });

    if (userId && bookingDate) {
      const zonedBookingDate = toZonedTime(bookingDate, "Europe/Rome");
      await sendNotification({
        userId,
        title: "Prenotazione eliminata",
        body: `La tua prenotazione in data ${zonedBookingDate.toLocaleDateString()} delle ore ${format(
          zonedBookingDate,
          "HH:mm"
        )} e' stata cancellata`,
      });
    }
  }

  return (
    <SubmitBtn
      className={cn("w-fit", className)}
      onClick={handleDelete}
      isLoading={isPending}
      {...props}
    >
      {children}
    </SubmitBtn>
  );
}
