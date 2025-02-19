"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BookingList from "./BookingList";
import { ChevronDown, Dot } from "lucide-react";
import { addMinutes, isAfter, isToday, isWithinInterval } from "date-fns";
import { cn, getBookingTime, getCurrentTime } from "@/lib/utils";
import BookingStatusBadge from "./BookingStatusBadge";
import { Bookings } from "@/types";
import { useEffect, useState } from "react";

type Props = {
  bookingDate: Date;
  day: string;
  times: [string, Bookings | undefined][];
  event: { name: string; durationMinutes: number };
  values: { progressTime?: string; futureTime?: string; userTime?: string };
};
export default function BookingTimeAccordion({
  bookingDate,
  day,
  times,
  event: { name: eventName, durationMinutes },
  values: { progressTime, futureTime, userTime },
}: Props) {
  const defaultValue = `${eventName}-${day}-${
    userTime || progressTime || futureTime
  }`;

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultValue}
      value={value}
      onValueChange={setValue}
    >
      {times.map(([startTime, bookings]) => {
        const bookingTime = getBookingTime(startTime);
        const isInProgress =
          isToday(bookingDate) &&
          isWithinInterval(new Date(), {
            start: bookingTime,
            end: addMinutes(bookingTime, durationMinutes),
          });
        const isOpen =
          isToday(bookingDate) && isAfter(bookingTime, getCurrentTime());

        const courseStatus = isInProgress
          ? "in_progress"
          : futureTime === startTime
          ? "coming"
          : isOpen
          ? "open"
          : "terminated";

        return (
          !!bookings?.length && (
            <AccordionItem
              value={`${eventName}-${day}-${startTime}`}
              key={`${eventName}-${day}-${startTime}`}
              className={cn(
                "last:border-0",
                courseStatus === "terminated" &&
                  "[&[data-state=closed]]:opacity-75"
              )}
            >
              <AccordionTrigger className="pt-2 pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Dot size={40} />
                    <span className="group-data-[state=open]:underline">
                      {startTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isToday(bookingDate) && (
                    <BookingStatusBadge status={courseStatus} className="" />
                  )}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <BookingList bookings={bookings} />
              </AccordionContent>
            </AccordionItem>
          )
        );
      })}
    </Accordion>
  );
}
