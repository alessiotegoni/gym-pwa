"server-only";

import { db } from "@/drizzle/db";
import { bookings, subscriptions } from "@/drizzle/schema";
import { addDays, startOfDay } from "date-fns";
import { and, count, eq, lte, gte, ne } from "drizzle-orm";

export async function getUser({
  userId,
  userEmail,
}: {
  userId?: number;
  userEmail?: string;
}) {
  const result = await db.query.users.findFirst({
    where: ({ id, email }, { eq }) =>
      userId ? eq(id, userId) : userEmail ? eq(email, userEmail) : undefined,
  });

  return result;
}

export async function hasSubscription(userId: number) {
  const [{ subscriptionCount }] = await db
    .select({ subscriptionCount: count() })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        lte(subscriptions.createdAt, new Date()),
        gte(subscriptions.endDate, new Date()),
        ne(subscriptions.status, "canceled"),
        ne(subscriptions.status, "expired")
      )
    );

  return !!subscriptionCount;
}

export async function getActiveSubscriptions(userId: number) {
  const results = await db.query.subscriptions.findFirst({
    where: (sub, { and, eq, lte, gte, ne }) =>
      and(
        eq(sub.userId, userId),
        lte(sub.createdAt, new Date()),
        gte(sub.endDate, new Date()),
        ne(sub.status, "canceled"),
        ne(sub.status, "expired")
      ),
  });

  return results;
}

export async function getBookings() {
  const results = await db.query.bookings.findMany({
    where: ({ bookingDate }, { gte }) =>
      gte(bookingDate, startOfDay(new Date())),
    orderBy: ({ bookingDate }, { asc }) => asc(bookingDate),
    with: {
      user: {
        columns: { firstName: true, lastName: true, email: true, image: true },
      },
      schedule: {
        columns: { id: true, startTime: true },
        with: {
          event: {
            columns: {
              id: true,
              name: true,
              capacity: true,
              durationMinutes: true,
            },
          },
        },
      },
    },
  });

  return results;
}

export async function getUserBookings(id: number) {
  const results = await db.query.bookings.findMany({
    where: ({ userId, bookingDate }, { and, gte, eq }) =>
      and(eq(userId, id), gte(bookingDate, new Date())),
    with: {
      schedule: {
        columns: { startTime: true },
        with: {
          bookings: {
            where: ({ bookingDate }, { gte }) => gte(bookingDate, new Date()),
            columns: { id: true },
            with: {
              user: {
                columns: { id: true },
              },
            },
          },
          event: {
            columns: {
              id: true,
              name: true,
              imageUrl: true,
              capacity: true,
              durationMinutes: true,
            },
          },
        },
      },
    },
    orderBy: (bookings, { asc }) => [asc(bookings.bookingDate)],
  });

  return results;
}

export async function getBookingsCount(scheduleId: number, bookingDate: Date) {
  const [result] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        eq(bookings.scheduleId, scheduleId),
        eq(bookings.bookingDate, bookingDate)
      )
    );

  return result.count;
}

export async function getEvent(eventId: number) {
  const result = await db.query.events.findFirst({
    where: ({ id }, { eq }) => eq(id, eventId),
  });

  return result;
}

export async function getEventsWithSchedules() {
  const now = startOfDay(new Date());

  const results = await db.query.events.findMany({
    with: {
      schedules: {
        columns: {
          id: true,
          day: true,
          startTime: true,
        },
        where: ({ isActive }, { eq }) => eq(isActive, true),
        orderBy: ({ startTime }, { asc }) => asc(startTime),
        with: {
          bookings: {
            columns: {
              id: true,
              bookingDate: true,
            },
            where: ({ bookingDate }, { and, lte, gte }) =>
              and(gte(bookingDate, now), lte(bookingDate, addDays(now, 7))),

            orderBy: ({ bookingDate }, { asc }) => asc(bookingDate),
            with: {
              user: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return results;
}

export async function getEventSchedule(scheduleEventId: number) {
  const schedules = await db.query.eventSchedules.findMany({
    columns: {
      id: false,
      eventId: false,
    },
    where: ({ eventId }, { eq }) => eq(eventId, scheduleEventId),
  });

  return schedules;
}
