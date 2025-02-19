"use client";

import { deleteBooking } from "@/actions/bookings";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useTransition } from "react";

type Props = {
  bookingId: number;
  children?: ReactNode;
} & ButtonProps;

export default function DeleteBookingBtn({
  bookingId,
  children,
  className,
  ...props
}: Props) {
  const [isPending, startDeleteTransition] = useTransition();

  const pathname = usePathname();

  function handleclick() {
    if (isPending) return;
    startDeleteTransition(async () => {
      const res = await deleteBooking(bookingId, pathname);
      if (res?.error) {
        toast.error("Errore nell'eliminazione della prenotazione");
        return;
      }

      toast.success("Prenotazione eliminata con successo!");
    });
  }

  return (
    <Button
      size="sm"
      className={className}
      onClick={handleclick}
      disabled={isPending}
      {...props}
    >
      {isPending ? <LoaderCircle className="animate-spin !size-5" /> : children}
    </Button>
  );
}
