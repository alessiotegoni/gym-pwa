import * as z from "zod";
import { imageSchema } from "./image";

export const eventSchema = z
  .object({
    name: z.string().min(1, "Il nome è obbligatorio"),
    description: z.string().min(1, "La descrizione è obbligatoria").nullable(),
    durationMinutes: z
      .number({ message: "Numero invalido" })
      .positive("La durata deve essere maggiore di 0"),
    capacity: z
      .number({ message: "Numero invalido" })
      .positive("La capacità deve essere maggiore di 0"),
    bookingCutoffMinutes: z
      .number({ message: "Numero invalido" })
      .positive("Il limite di prenotazione deve essere maggiore a 0")
      .nullable(),
    cancellationCutoffMinutes: z
      .number({ message: "Numero invalido" })
      .positive("Il limite di cancellazione deve essere maggiore a 0")
      .nullable(),
  })
  .merge(imageSchema);
