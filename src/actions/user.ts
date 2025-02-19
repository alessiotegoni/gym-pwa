"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { EditUserSchemaType } from "@/types";
import { editUserSchema } from "@/lib/schema/user";
import { uploadImg } from "@/lib/utils";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { redirect } from "next/navigation";

export async function updateUserProfile(values: EditUserSchemaType) {
  const session = await auth();
  if (!session?.userId) return { error: true };

  const { success, data } = editUserSchema.safeParse(values);

  if (!success) return { error: true };

  const { img, ...restData } = data;

  let image = (img as string) ?? null;
  if (img instanceof File) {
    image = await uploadImg(img);
    if (!image) return { error: true };
  }

  await db
    .update(users)
    .set({ ...restData, image })
    .where(eq(users.id, session.userId));

  redirect("/user/profile");
}
