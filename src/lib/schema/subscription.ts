import { startOfDay } from "date-fns";
import * as z from "zod";

export const createSubscriptionSchema = z.object({
  userId: z.string({ message: "L'utente e' obbligatorio" }),
  isTrial: z.boolean().default(false).optional(),
  endDate: z
    .date()
    .refine(
      (date) => date >= startOfDay(new Date()),
      "La data deve essere maggiore o uguale di quella di oggi"
    ),
});
