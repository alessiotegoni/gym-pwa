import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarX } from "lucide-react";
import { EventsWithSchedules } from "@/types";
import { getDay, getNext7Dates } from "@/lib/utils";
import EventSchedulesList from "./EventSchedulesList";
import CreateSubscriptionCard from "@/components/CreateSubscriptionCard";
import { BorderTrail } from "@/components/ui/border-trail";

type Props = {
  events: EventsWithSchedules;
  userId: number;
  hasSubscription: boolean;
};

export default function ScheduleCarousel({
  events,
  userId,
  hasSubscription,
}: Props) {
  return (
    <>
      {!hasSubscription && <CreateSubscriptionCard className="mb-5" />}
      <CarouselContent className="h-full">
        {getNext7Dates().map((date) => {
          const dateDay = getDay(date);

          const scheduleEvents = events.filter((event) =>
            event.schedules.some(
              (eventSchedule) => eventSchedule.day === dateDay
            )
          );

          if (!scheduleEvents.length) {
            return (
              <CarouselItem key={date.toString()} data-day={dateDay}>
                <Card className="card-primary !p-8 relative overflow-hidden mt-2">
                  <BorderTrail
                    className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
                    size={120}
                  />
                  <CardContent className="flex flex-col items-center justify-center text-center p-0">
                    <CalendarX
                      className="size text-muted-foreground"
                      size={50}
                    />
                    <CardTitle className="text-xl font-semibold my-2">
                      Nessuna programmazione
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Non ci sono eventi disponibili per questa data
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          }

          return (
            <CarouselItem key={date.toString()} data-day={dateDay}>
              {scheduleEvents.map(({ schedules, ...event }) => {
                const eventSchedules = schedules.filter(
                  (s) => s.day === getDay(date)
                );

                return (
                  <section key={event.id} data-event={event.name} className="mt-3">
                    <h3 className="text-lg font-semibold capitalize">
                      {event.name}
                    </h3>
                    {event.bookingCutoffMinutes && (
                      <p className="font-medium text-sm text-muted-foreground">
                        Le prenotazioni chiudono {event.bookingCutoffMinutes}{" "}
                        minuti prima dell'inizio
                      </p>
                    )}
                    <EventSchedulesList
                      userId={userId}
                      hasSubscription={hasSubscription}
                      schedules={eventSchedules}
                      event={event}
                      date={date}
                    />
                  </section>
                );
              })}
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </>
  );
}
