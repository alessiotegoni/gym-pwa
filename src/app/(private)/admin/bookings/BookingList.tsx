import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookings } from "@/types";
import { Trash2 } from "lucide-react";
import DeleteBookingBtn from "../../../../components/DeleteBookingBtn";
import MorphingDialogBasicImage from "@/components/MorphingDialogBasicImage";

export default function BookingList({ bookings }: { bookings: Bookings }) {
  return (
    <ScrollArea className="h-[300px]">
      <p className="mb-4 font-medium">
        Prenotati:
        <strong> {bookings.length}</strong>{" "}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between space-x-2 p-2 bg-secondary rounded-md"
          >
            <div className="flex items-center gap-2">
              {booking.user.image ? (
                <MorphingDialogBasicImage
                  src={booking.user.image}
                  alt={`${booking.user.firstName} ${booking.user.lastName}`}
                  className="size-10"
                />
              ) : (
                <div className="size-10 rounded-[4px] grid place-content-center bg-zinc-950">
                  {booking.user.firstName.charAt(0).toUpperCase()}
                  {booking.user.lastName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">
                  {booking.user.firstName} {booking.user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.user.email}
                </p>
              </div>
            </div>
            <DeleteBookingBtn bookingId={booking.id} variant="ghost">
              <Trash2 className="!size-5 text-destructive" />
            </DeleteBookingBtn>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
