import { z } from "zod";
import { isValidImage } from "../utils";

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const imageSchema = z.object({
  img: z.union([
    z
      .instanceof(File, { message: "Immagine dell'allenamento obbligatoria" })
      .superRefine((file, ctx) => {
        const { isValid, message } = isValidImage(file);
        if (!isValid) ctx.addIssue({ code: "custom", message });
      }),

    z.string().url("Url dell'immagine invalido"),
  ]),
});
