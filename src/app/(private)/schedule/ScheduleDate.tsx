"use client";

import { Button } from "@/components/ui/button";
import { useSchedule } from "@/context/ScheduleProvider";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {};
export default function ScheduleDate({}: Props) {
  const {
    currentDay: { formatted },
    canScrollPrevDay,
    scrollPrevDay,
    canScrollNextDay,
    scrollNextDay,
  } = useSchedule();

  return (
    <div className="flex justify-between items-center gap-2 mt-3 mb-7">
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => scrollPrevDay()}
        disabled={!canScrollPrevDay}
      >
        <ArrowLeft />
      </Button>
      <h2
        className="text-xl font-semibold p-1 bg-secondary
      rounded-xl capitalize px-3"
      >
        {formatted}
      </h2>
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => scrollNextDay()}
        disabled={!canScrollNextDay}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
