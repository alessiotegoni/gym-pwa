"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { EditUserSchemaType } from "@/types";
import { editUserSchema } from "@/lib/schema/user";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { uploadImg } from "./uploadimages";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(values: EditUserSchemaType) {
  const session = await auth();
  if (!session?.userId) return { error: true };

  const { success, data } = editUserSchema.safeParse(values);

  if (!success) return { error: true };

  const { img, ...restData } = data;

  let image = (img as string) ?? null;
  if (img instanceof File) {
    image = await uploadImg(img, { folder: "usersAvatar", isProfilePic: true });
    if (!image) return { error: true };
  }

  await db
    .update(users)
    .set({ ...restData, image })
    .where(eq(users.id, session.userId));

  revalidatePath("/user/profile", "page");
}
