"use client";

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useSchedule } from "@/context/ScheduleProvider";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type Props = {};
export default function ScheduleDate({}: Props) {
  const { currentDate } = useSchedule();

  return (
    <div className="flex justify-between items-center gap-2 mt-3 mb-7">
      <CarouselPrevious />
      <h2
        className="text-xl font-semibold p-1 bg-secondary
      rounded-xl capitalize px-3"
      >
        {format(currentDate, "EEEE dd/MM/yyyy", { locale: it })}
      </h2>
      <CarouselNext />
    </div>
  );
}
