"use client";

import { getNext7Days } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSchedule } from "@/context/ScheduleProvider";
import { getEventsWithSchedules } from "@/lib/queries";

type Props = {
  events: Awaited<ReturnType<typeof getEventsWithSchedules>>;
};

export default function ScheduleCarousel({ events }: Props) {
  const { currentDay } = useSchedule();

  console.log(currentDay);

  const currentSchedule = events.filter((event) =>
    event.schedules.filter(
      (eventSchedule) => eventSchedule.day === currentDay.day
    )
  );

  console.log(currentSchedule);

  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {getNext7Days().map(({ formatted }, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold capitalize">
                    {formatted}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
