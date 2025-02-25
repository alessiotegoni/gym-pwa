"use server";

import { db } from "@/drizzle/db";
import { bookings } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { isBookingOperable } from "@/lib/utils";
import { startOfDay } from "date-fns";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBookedUsers(id: number, date: Date) {
  const session = await auth();

  if (!session?.userId || isNaN(id) || date < startOfDay(new Date())) return;

  const results = await db.query.bookings.findMany({
    where: ({ scheduleId, bookingDate }, { and, eq }) =>
      and(eq(scheduleId, id), eq(bookingDate, date)),
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
    },
  });

  return results.map((booking) => booking.user);
}

export async function createBooking(
  scheduleId: number,
  bookingDate: Date,
  bookingCutoffMinutes: number | null
) {
  const session = await auth();

  if (!session?.userId || isNaN(scheduleId)) return { error: true };
  if (!isBookingOperable(bookingDate, bookingCutoffMinutes, "create"))
    return { error: true, message: "Prenotazioni chiuse" };

  const { rowCount } = await db
    .insert(bookings)
    .values({ scheduleId, userId: session.userId, bookingDate });

  if (!rowCount) return { error: true };

  revalidatePath("/schedule", "page");
}

export async function deleteBooking(
  id: number,
  bookingDate: Date,
  cancellationCutoffMinutes: number | null,
  path: string
) {
  const session = await auth();

  if (!session?.userId || isNaN(id)) return { error: true };
  if (!isBookingOperable(bookingDate, cancellationCutoffMinutes, "create"))
    return {
      error: true,
      message: cancellationCutoffMinutes
        ? `Puoi cancellarti solo ${cancellationCutoffMinutes} minuti prima dell'inizio del corso`
        : "Non puoi cancellarti dopo l'inizio o la fine del corso",
    };

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
