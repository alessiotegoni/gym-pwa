import { fullNameSchema } from "./auth";
import { imageSchema } from "./image";

export const editUserSchema = fullNameSchema.merge(imageSchema.partial());
