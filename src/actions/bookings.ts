"use server";

import { db } from "@/drizzle/db";
import { bookings } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBooking() {
  const session = await auth();

  if (!session?.userId) return { error: true };
}

export async function deleteBooking(id: number, path: string) {
  const session = await auth();

  if (!session?.userId) return { error: true };

  if (isNaN(id)) return { error: true };

  await db
    .delete(bookings)
    .where(
      and(
        eq(bookings.id, id),
        !session.isAdmin ? eq(bookings.userId, session.userId) : undefined
      )
    );

  revalidatePath(path, "page");
}
