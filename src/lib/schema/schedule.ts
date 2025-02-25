import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { z } from "zod";
import { getBookingTime } from "../utils";
import { isAfter, isBefore, isEqual } from "date-fns";
import { WeekDay } from "@/types";

const timeSlotSchema = z
  .object({
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato orario non valido"),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato orario non valido"),
    isActive: z.boolean(),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    const start = getBookingTime(startTime);
    const end = getBookingTime(endTime);

    if (isAfter(start, end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'orario di inizio deve essere prima dell'orario di fine",
        path: ["startTime"],
      });
    }
  });

export const eventScheduleSchema = z
  .record(z.enum(DAYS_OF_WEEK_IN_ORDER), z.array(timeSlotSchema))
  .superRefine((schedule, ctx) => {
    for (const day in schedule) {
      const timeSlots = schedule[day as WeekDay]!;

      for (let i = 0; i < timeSlots.length; i++) {
        const { startTime, endTime } = timeSlots[i];
        const start = getBookingTime(startTime);
        const end = getBookingTime(endTime);

        for (let j = 0; j < timeSlots.length; j++) {
          if (i === j) continue;

          const otherStart = getBookingTime(timeSlots[j].startTime);
          const otherEnd = getBookingTime(timeSlots[j].endTime);

          if (
            (isAfter(start, otherStart) && isBefore(start, otherEnd)) || // Il nuovo inizio è dentro un altro intervallo
            (isAfter(end, otherStart) && isBefore(end, otherEnd)) || // Il nuovo fine è dentro un altro intervallo
            (isBefore(start, otherStart) && isAfter(end, otherEnd)) || // Il nuovo intervallo contiene completamente un
            // altro
            isEqual(start, otherStart) ||
            isEqual(end, otherEnd)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `L'orario ${startTime}-${endTime} si sovrappone con ${timeSlots[j].startTime}-${timeSlots[j].endTime}`,
              path: [`${day}.${i}.startTime`],
            });
          }
        }
      }
    }
  });
