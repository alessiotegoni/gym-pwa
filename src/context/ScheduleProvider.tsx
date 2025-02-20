"use client";

import { useCarousel } from "@/components/ui/carousel";
import { getNext7Dates } from "@/lib/utils";
import { UseEmblaCarouselType } from "embla-carousel-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type ScheduleDay = ReturnType<typeof getNext7Dates>[0];

interface scheduleContext {
  currentDate: ScheduleDay;
}

const ScheduleContext = createContext<scheduleContext | null>(null);

export default function ScheduleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { api } = useCarousel();

  const [dateIndex, setDateIndex] = useState(api?.selectedScrollSnap() ?? 0);

  const nextDates = getNext7Dates();
  const currentDate = nextDates[dateIndex];

  const onSelect = (e: UseEmblaCarouselType[1]) =>
    e && setDateIndex(e.selectedScrollSnap());

  useEffect(() => {
    api?.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api]);

  return (
    <ScheduleContext.Provider
      value={{ currentDate }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context)
    throw new Error("Schedule context must be used within his provider");

  return context;
};
