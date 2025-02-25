"use client";

import { deleteBooking } from "@/actions/bookings";
import { ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { ReactNode, useTransition } from "react";
import { cn } from "@/lib/utils";
import SubmitBtn from "./SubmitBtn";

type Props = {
  bookingId: number;
  bookingDate: Date;
  cancellationCutoffMinutes: number | null;
  children?: ReactNode;
} & ButtonProps;

export default function DeleteBookingBtn({
  bookingId,
  bookingDate,
  cancellationCutoffMinutes,
  children,
  className,
  ...props
}: Props) {
  const [isPending, startDeleteTransition] = useTransition();

  const pathname = usePathname();

  function handleDelete() {
    if (isPending) return;
    startDeleteTransition(async () => {
      const res = await deleteBooking(
        bookingId,
        bookingDate,
        cancellationCutoffMinutes,
        pathname
      );
      if (res?.error) {
        toast.error(
          res.message ?? "Errore nell'eliminazione della prenotazione"
        );
        return;
      }

      toast.success("Prenotazione eliminata con successo!");
    });
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
