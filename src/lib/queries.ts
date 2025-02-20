"server-only";

import { db } from "@/drizzle/db";
import { startOfDay } from "date-fns";

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

export async function getEvent(eventId: number) {
  const result = await db.query.events.findFirst({
    where: ({ id }, { eq }) => eq(id, eventId),
  });

  return result;
}

export async function getEventsWithSchedules() {
  const results = await db.query.events.findMany({
    columns: {
      id: true,
      name: true,
      durationMinutes: true,
    },
    with: {
      schedules: {
        orderBy: ({ startTime }, { asc }) => asc(startTime),
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

export async function getTraining({
  eventId,
  date,
  trainingId,
}: {
  eventId?: number;
  date?: string;
  trainingId?: number;
}) {
  const result = await db.query.dailyTrainings.findFirst({
    where: ({ id, eventId: trainingEventId, trainingDate }, { and, eq }) =>
      and(
        eventId ? eq(trainingEventId, eventId) : undefined,
        trainingId ? eq(id, trainingId) : undefined,
        date ? eq(trainingDate, date) : undefined
      ),
  });

  return result;
}
