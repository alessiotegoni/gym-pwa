import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email({
    message: "Inserisci un indirizzo email valido.",
  }),
  password: z.string().min(8, {
    message: "La password deve essere di almeno 8 caratteri.",
  }),
});

export const fullNameSchema = z.object({
  firstName: z.string().min(2, {
    message: "Il nome deve essere di almeno 2 caratteri.",
  }),
  lastName: z.string().min(2, {
    message: "Il cognome deve essere di almeno 2 caratteri.",
  }),
});

export const signupSchema = signinSchema.merge(fullNameSchema);
