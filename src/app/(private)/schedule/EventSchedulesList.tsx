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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-2">
      {schedules.map((schedule) => {
        const bookingDate = getBookingDateTime(date, schedule.startTime);

        const startTime = new Date(`2000-01-01T${schedule.startTime}`);
        const endTime = format(
          addMinutes(startTime, event.durationMinutes),
          "HH:mm"
        );

        const userBooking = schedule.bookings.find(
          (booking) =>
            booking.user.id === userId &&
            isEqual(booking.bookingDate, bookingDate)
        );

        return (
          <Card key={schedule.id} className="rounded-xl border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900">
            <CardContent className="p-4">
              <div className="grid grid-cols-[auto_1fr_auto]">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
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
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {format(startTime, "HH:mm")}
                  </p>
                  <p className="text-sm text-muted-foreground">- {endTime}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <BookingDetails
                  scheduleId={schedule.id}
                  userId={userId}
                  bookingDate={bookingDate}
                  usersCount={schedule.bookings.length}
                  eventCapacity={event.capacity}
                />
                {hasSubscription &&
                  (!userBooking ? (
                    <CreateBookingBtn
                      scheduleId={schedule.id}
                      bookingDate={bookingDate}
                      bookingCutoffMinutes={event.bookingCutoffMinutes}
                      disabled={
                        !isBookingOperable(
                          bookingDate,
                          event.bookingCutoffMinutes,
                          "create"
                        )
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
                        !isBookingOperable(
                          bookingDate,
                          event.cancellationCutoffMinutes,
                          "delete"
                        )
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
