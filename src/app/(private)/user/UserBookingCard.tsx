import { format, addMinutes } from "date-fns";
import { it } from "date-fns/locale";
import Image from "next/image";
import { CalendarDays, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DeleteBookingBtn from "../../../components/DeleteBookingBtn";
import { getUserBookings } from "@/lib/queries";
import BookingDetails from "@/components/BookingDetails";
import { isBookingOperable } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";

type Props = {
  booking: Awaited<ReturnType<typeof getUserBookings>>[0];
  userId: number;
};

export default function UserBookingCard({ booking, userId }: Props) {
  const zonedBookingDate = toZonedTime(booking.bookingDate, "Europe/Rome");

  return (
    <Card className="card-primary">
      <CardContent className="p-0">
        <div className="grid grid-cols-[auto_1fr_auto]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={booking.schedule!.event.imageUrl}
                alt={booking.schedule!.event.name}
                objectFit="cover"
                fill
              />
            </div>
            <div>
              <h3 className="font-semibold">{booking.schedule!.event.name}</h3>
              <p className="text-sm flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="size-4" />
                {format(booking.bookingDate, "d MMMM", { locale: it })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {format(zonedBookingDate, "HH:mm")}
            </p>
            <p className="text-sm text-muted-foreground">
              {" "}
              {format(
                addMinutes(
                  zonedBookingDate,
                  booking.schedule!.event.durationMinutes
                ),
                "HH:mm"
              )}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <BookingDetails
            scheduleId={booking.scheduleId!}
            userId={userId}
            bookingDate={booking.bookingDate}
            eventCapacity={booking.schedule!.event.capacity}
            bookingsCount={booking.schedule!.bookings.length}
          />
          <DeleteBookingBtn
            bookingId={booking.id}
            variant="destructive"
            disabled={
              !isBookingOperable({
                type: "delete",
                bookingDate: zonedBookingDate,
                cutoffMinutes:
                  booking.schedule!.event.cancellationCutoffMinutes,
              })
            }
          >
            <Trash2 />
            Elimina
          </DeleteBookingBtn>
        </div>
      </CardContent>
    </Card>
  );
}
