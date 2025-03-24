import { startOfDay } from "date-fns";
import { z } from "zod";
import { imageSchema } from "./image";
import { toZonedTime } from "date-fns-tz";

export const dailyTrainingSchema = z
  .object({
    eventId: z.number().positive("L'id dell'evento e' obbligatorio"),
    trainingTimestamp: z
      .date({ message: "Formato della data dell'allenamento invalido" })
      .transform((date) => toZonedTime(date, "Europe/Rome"))
      .refine(
        (date) => date >= startOfDay(new Date()),
        "Data dell'allenamento invalida"
      ),
    description: z
      .string()
      .max(400, "La descrizione non può superare i 400 caratteri")
      .optional(),
  })
  .merge(imageSchema);
