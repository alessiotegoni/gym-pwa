"server-only";

import { TrainingSearchParams } from "@/app/(private)/admin/trainings/page";
import { db } from "@/drizzle/db";
import { bookings, subscriptions } from "@/drizzle/schema";
import {
  addDays,
  endOfMonth,
  format,
  getMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { and, count, eq, lte, gte, ne } from "drizzle-orm";
import { formatDate } from "./utils";
import { it } from "date-fns/locale";

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
        gte(subscriptions.endDate, formatDate(new Date())),
        ne(subscriptions.status, "canceled"),
        ne(subscriptions.status, "expired")
      )
    );

  return !!subscriptionCount;
}

export async function getActiveSubscription(userId: number) {
  const results = await db.query.subscriptions.findFirst({
    where: (sub, { and, eq, lte, gte, ne }) =>
      and(
        eq(sub.userId, userId),
        lte(sub.createdAt, new Date()),
        gte(sub.endDate, formatDate(new Date())),
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
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
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
      and(eq(userId, id), gte(bookingDate, startOfDay(new Date()))),
    with: {
      schedule: {
        columns: { startTime: true },
        with: {
          bookings: {
            where: ({ bookingDate }, { gte }) =>
              gte(bookingDate, startOfDay(new Date())),
            columns: { id: true },
            with: {
              user: {
                columns: { id: true },
              },
            },
          },
          event: {
            columns: {
              description: false,
              createdAt: false,
              updatedAt: false,
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
      eventId: false,
    },
    where: ({ eventId }, { eq }) => eq(eventId, scheduleEventId),
    orderBy: ({ startTime }, { asc }) => asc(startTime),
  });

  return schedules;
}

export async function getEventsTrainings({
  search,
  date,
}: TrainingSearchParams) {
  const results = await db.query.events.findMany({
    columns: { id: true, name: true },
    with: {
      dailyTrainings: {
        columns: { eventId: false },
        where: ({ trainingDate, description }, { and, eq, ilike }) =>
          and(
            date ? eq(trainingDate, date) : undefined,
            search ? ilike(description, `%${search}%`) : undefined
          ),
        orderBy: ({ trainingDate }, { desc }) => desc(trainingDate),
        limit: 10,
      },
    },
    where: search
      ? (events, { ilike }) => ilike(events.name, `%${search}%`)
      : undefined,
  });

  return results;
}

export async function getUserWorkoutStats(userId: number) {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    [{ totalWorkouts }],
    [{ currentMonthWorkouts }],
    [{ lastMonthWorkouts }],
    monthlyData,
  ] = await Promise.all([
    db
      .select({ totalWorkouts: count() })
      .from(bookings)
      .where(eq(bookings.userId, userId)),
    db
      .select({ currentMonthWorkouts: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userId),
          gte(bookings.bookingDate, startOfCurrentMonth),
          lte(bookings.bookingDate, endOfCurrentMonth)
        )
      ),
    db
      .select({ lastMonthWorkouts: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userId),
          gte(bookings.bookingDate, lastMonthStart),
          lte(bookings.bookingDate, lastMonthEnd)
        )
      ),
    getMonthlyWorkoutData(userId, 6),
  ]);

  return {
    totalWorkouts,
    currentMonthWorkouts,
    lastMonthWorkouts,
    monthlyData,
  };
}

async function getMonthlyWorkoutData(userId: number, monthsCount: number) {
  const now = new Date();
  const promises = Array.from({ length: monthsCount }, (_, i) => {
    const monthDate = subMonths(now, i);
    return db
      .select({ workouts: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userId),
          gte(bookings.bookingDate, startOfMonth(monthDate)),
          lte(bookings.bookingDate, endOfMonth(monthDate))
        )
      )
      .then(([{ workouts }]) => ({
        name: format(monthDate, "MMM", { locale: it }),
        workouts,
        month: getMonth(monthDate) + 1 * 0.1,
      }));
  });

  return await Promise.all(promises);
}
