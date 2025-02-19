import * as z from "zod";

export const createSubscriptionSchema = z.object({
  userId: z.string({ message: "L'utente e' obbligatorio" }),
  isTrial: z.boolean().default(false).optional(),
  endDate: z
    .date()
    .refine(
      (date) => date > new Date(),
      "La data deve essere maggiore di quella di oggi"
    ),
});
