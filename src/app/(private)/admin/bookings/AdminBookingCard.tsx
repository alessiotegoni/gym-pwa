import { Bookings, GroupedBookings } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrainingDialog from "@/components/TrainingDialog";
import { addMinutes, isAfter, isToday, isWithinInterval } from "date-fns";
import BookingTimeAccordion from "./BookingTimeAccordion";
import { getBookingTime, getCurrentTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
  event: {
    id: number;
    name: string;
    durationMinutes: number
  }
  todayBookings: number;
  days: GroupedBookings[string];
  isAdmin: boolean;
  search?: string;
};

export default function AdminBookingCard({
  event: { id, name, durationMinutes },
  todayBookings,
  days,
  isAdmin,
  search,
}: Props) {
  const getProgressTime = (date: Date, times: any) => {
    if (!isToday(date)) return;
    return Object.keys(times).find((time) => {
      const bookingTime = getBookingTime(time);
      return isWithinInterval(new Date(), {
        start: bookingTime,
        end: addMinutes(bookingTime, durationMinutes),
      });
    });
  };
  const getFutureTime = (date: Date, times: any) => {
    if (!isToday(date)) return;
    return Object.keys(times).find((time) => {
      const bookingTime = getBookingTime(time);
      return isAfter(bookingTime, getCurrentTime());
    });
  };
  const getUserTime = (date: Date, times: any) => {
    if (!isToday(date) || !search) return;
    return Object.keys(times).find((time) =>
      times[time]?.some(
        (booking: any) =>
          booking.user.firstName.toLowerCase().includes(search) ||
          booking.user.lastName.toLowerCase().includes(search) ||
          booking.user.email.toLowerCase().includes(search)
      )
    );
  };

  return (
    <Card className="rounded-xl border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900">
      <CardHeader className="flex-row justify-between">
        <CardTitle className="text-xl">{name}</CardTitle>
        <Badge className="rounded-full text-black">
          Prenotati oggi:
          <strong className="ml-1">{todayBookings}</strong>
        </Badge>
      </CardHeader>
      <CardContent className="p-2">
        {Object.entries(days).map(([day, times], i) => {
          const timesEntries = Object.entries(times);

          const bookingDate = timesEntries[0][1]![0].bookingDate;
          const progressTime = getProgressTime(bookingDate, times);
          const futureTime = getFutureTime(bookingDate, times);
          const userTime = getUserTime(bookingDate, times);

          return (
            <div
              key={day + i}
              className="mt-2 first:mt-0 card-primary !bg-zinc-950"
            >
              <div className="flex justify-between items-center">
                <p className="text-base font-semibold capitalize">
                  {isToday(bookingDate) ? "oggi" : day}
                </p>
                <TrainingDialog
                  eventId={id}
                  eventName={name}
                  isAdmin={isAdmin}
                  trainingTimestamp={bookingDate}
                />
              </div>
              <BookingTimeAccordion
                bookingDate={bookingDate}
                day={day}
                times={timesEntries}
                event={{ name, durationMinutes }}
                values={{ progressTime, futureTime, userTime }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
