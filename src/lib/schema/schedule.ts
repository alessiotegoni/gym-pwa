import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { z } from "zod";

const timeSlotSchema = z.object({
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato orario non valido"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato orario non valido"),
  isActive: z.boolean(),
});

export const eventScheduleSchema = z.record(
  z.enum(DAYS_OF_WEEK_IN_ORDER),
  z.array(timeSlotSchema)
);
