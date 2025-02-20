"use client";

import { getNext7Days } from "@/lib/utils";
import { createContext, ReactNode, useContext, useState } from "react";

export type ScheduleDay = ReturnType<typeof getNext7Days>[0];

interface scheduleContext {
  nextDays: ScheduleDay[];
  currentDay: ScheduleDay;
  canScrollPrevDay: boolean;
  scrollPrevDay: () => void;
  canScrollNextDay: boolean;
  scrollNextDay: () => void;
}

const ScheduleContext = createContext<scheduleContext | null>(null);

export default function ScheduleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dayIndex, setDayIndex] = useState(0);

  const nextDays = getNext7Days();
  const currentDay = nextDays[dayIndex];

  const canScrollPrevDay = dayIndex > 0;
  const scrollPrevDay = () => canScrollPrevDay && setDayIndex(dayIndex - 1);

  const canScrollNextDay = dayIndex + 1 < nextDays.length;
  const scrollNextDay = () => canScrollNextDay && setDayIndex(dayIndex + 1);


  return (
    <ScheduleContext.Provider
      value={{
        canScrollPrevDay,
        scrollPrevDay,
        canScrollNextDay,
        scrollNextDay,
        nextDays,
        currentDay,
      }}
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
