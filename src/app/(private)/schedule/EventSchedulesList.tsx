import { Event, EventsWithSchedules } from "@/types";
import { addMinutes, format, isAfter, isEqual } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarDays, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import DeleteBookingBtn from "../../../components/DeleteBookingBtn";
import { getBookingDateTime, isBookingOperable } from "@/lib/utils";
import CreateBookingBtn from "@/components/CreateBookingBtn";
import BookingDetails from "@/components/BookingDetails";
import { fromZonedTime } from "date-fns-tz";

type Props = {
  event: Event;
  schedules: EventsWithSchedules[0]["schedules"];
  userId: number;
  date: Date;
  hasSubscription: boolean;
};

export default function EventSchedulesList({
  event,
  schedules,
  userId,
  date,
  hasSubscription,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 mt-2">
      {schedules.map((schedule) => {
        const bookingDate = getBookingDateTime(date, schedule.startTime);
        const bookingDateUtc = fromZonedTime(bookingDate, "Europe/Rome");

        const endTime = format(
          addMinutes(bookingDate, event.durationMinutes),
          "HH:mm"
        );

        // console.log(bookingDate, bookingDate.getHours());

        const userBooking = schedule.bookings.find(
          (booking) =>
            booking.user.id === userId &&
            isEqual(booking.bookingDate, bookingDateUtc)
        );

        return (
          <Card key={schedule.id} className="card-primary">
            <CardContent className="p-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      objectFit="cover"
                      fill
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {
                        giorniSettimana[
                          DAYS_OF_WEEK_IN_ORDER.indexOf(schedule.day)
                        ]
                      }
                    </h3>
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <CalendarDays className="size-4" />
                      {format(date, "d MMMM", {
                        locale: it,
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {format(bookingDate, "HH:mm")}
                  </p>
                  <p className="text-sm text-end text-muted-foreground">
                    {endTime}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <BookingDetails
                  scheduleId={schedule.id}
                  userId={userId}
                  bookingDate={bookingDateUtc}
                  bookingsCount={schedule.bookings.length}
                  eventCapacity={event.capacity}
                />
                {hasSubscription &&
                  (!userBooking ? (
                    <CreateBookingBtn
                      scheduleId={schedule.id}
                      bookingDate={bookingDate}
                      bookingCutoffMinutes={event.bookingCutoffMinutes}
                      eventCapacity={event.capacity}
                      disabled={
                        !isBookingOperable({
                          type: "create",
                          bookingDate,
                          cutoffMinutes: event.bookingCutoffMinutes,
                          eventCapacity: event.capacity,
                          bookingsCount: schedule.bookings.length,
                        })
                      }
                    />
                  ) : (
                    <DeleteBookingBtn
                      variant="destructive"
                      bookingId={userBooking.id}
                      bookingDate={bookingDate}
                      cancellationCutoffMinutes={
                        event.cancellationCutoffMinutes
                      }
                      disabled={
                        !isBookingOperable({
                          type: "delete",
                          bookingDate,
                          cutoffMinutes: event.cancellationCutoffMinutes,
                        })
                      }
                    >
                      <Trash2 />
                      Elimina
                    </DeleteBookingBtn>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
