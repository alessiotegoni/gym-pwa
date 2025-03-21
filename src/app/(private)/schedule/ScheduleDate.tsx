"use client";

import {
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { getNext7Dates } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ScheduleDate() {
  const { api } = useCarousel();

  const [dateIndex, setDateIndex] = useState(api?.selectedScrollSnap() ?? 0);

  const nextDates = useMemo(getNext7Dates, []);
  const currentDate = useMemo(
    () => nextDates[dateIndex],
    [nextDates, dateIndex]
  );

  const onSelect = useCallback(
    (e: UseEmblaCarouselType[1]) => e && setDateIndex(e.selectedScrollSnap()),
    [api]
  );

  useEffect(() => {
    api?.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex justify-between items-center gap-2 mt-3 mb-4">
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
