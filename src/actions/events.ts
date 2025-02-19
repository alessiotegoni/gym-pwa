"use server";

import { db } from "@/drizzle/db";
import { events } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eventSchema } from "@/lib/schema/event";
import { uploadImg } from "@/lib/utils";
import { EventSchemaType } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createEvent(values: EventSchemaType) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin) return;

  const { success, data } = eventSchema.safeParse(values);

  if (!success) return { error: true };

  const { img, ...restData } = data;

  if (!(img instanceof File)) return { error: true };

  const eventExist = await db.query.events.findFirst({
    columns: { id: true },
    where: ({ name }, { eq, sql }) =>
      eq(sql`lower(${name})`, restData.name.toLowerCase()),
  });

  if (eventExist)
    return {
      error: true,
      message: `Esiste gia' un evento col nome ${data.name}`,
    };

  const imageUrl = await uploadImg(img);

  if (!imageUrl) return { error: true };

  await db.insert(events).values({ ...restData, imageUrl });
}

export async function editEvent(values: EventSchemaType, eventId: number) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin) return;

  const { success, data } = eventSchema.safeParse(values);

  if (!success || isNaN(eventId)) return { error: true };

  const { img, ...restData } = data;

  const eventExist = await db.query.events.findFirst({
    columns: { id: true },
    where: ({ id }, { eq }) => eq(id, eventId),
  });

  if (!eventExist) return { error: true };

  let imageUrl = img as string;
  if (img instanceof File) {
    imageUrl = await uploadImg(img);
    if (!imageUrl) return { error: true };
  }

  await db
    .update(events)
    .set({ ...restData, imageUrl })
    .where(eq(events.id, eventId));
}

export async function deleteEvent(formData: FormData) {
  const eventId = parseInt(formData.get("id") as string);

  if (isNaN(eventId)) return;

  await db.delete(events).where(eq(events.id, eventId));

  revalidatePath("/admin/events");
}
