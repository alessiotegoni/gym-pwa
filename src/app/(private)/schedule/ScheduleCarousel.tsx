import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { EventsWithSchedules } from "@/types";
import { getDay, getNext7Dates } from "@/lib/utils";
import EventSchedulesList from "./EventSchedulesList";

type Props = {
  events: EventsWithSchedules;
  userId: number;
};

export default function ScheduleCarousel({ events, userId }: Props) {
  return (
    <CarouselContent>
      {getNext7Dates().map((date) => {
        const dateDay = getDay(date);

        const scheduleEvents = events.filter((event) =>
          event.schedules.some((eventSchedule) => eventSchedule.day === dateDay)
        );

        if (!scheduleEvents.length) {
          return (
            <CarouselItem key={date.toString()} data-day={dateDay}>
              <h3 className="text-center text-2xl mt-5 font-semibold">
                Nessuna programmazione per questa data
              </h3>
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
                <section
                  key={event.id}
                  data-event={event.name}
                  className="last:mt-4"
                >
                  <h3 className="text-lg font-semibold capitalize">
                    {event.name}
                  </h3>
                  {event.bookingCutoffMinutes && (
                    <p className="font-medium text-sm text-muted-foreground">
                      Le prenotazioni chiudono
                      {event.bookingCutoffMinutes} minuti prima dell'inizio
                    </p>
                  )}
                  <EventSchedulesList
                    event={event}
                    schedules={eventSchedules}
                    userId={userId}
                    date={date}
                  />
                </section>
              );
            })}
          </CarouselItem>
        );
      })}
    </CarouselContent>
  );
}
