"use server";

import { and, count, eq, gte, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { bookings, eventSchedules } from "@/drizzle/schema";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { eventScheduleSchema } from "@/lib/schema/schedule";
import { startOfDay } from "date-fns";
import { BatchItem } from "drizzle-orm/batch";

export async function isScheduleOperable(scheduleId: number) {
  const session = await auth();
  if (!session?.userId || !session.isAdmin || !scheduleId) return;

  const [res] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        eq(bookings.scheduleId, scheduleId),
        gte(bookings.bookingDate, startOfDay(new Date()))
      )
    );

  return !res.count;
}

export async function updateEventSchedule(
  values: EventScheduleSchemaType,
  scheduleEventId: number
) {
  const session = await auth();
  if (!session?.userId || !session.isAdmin) return { error: true };

  const { success, data } = eventScheduleSchema.safeParse(values);
  if (!success) return;

  const existingSchedules = await db.query.eventSchedules.findMany({
    where: ({ eventId }, { eq }) => eq(eventId, scheduleEventId),
    with: {
      bookings: {
        columns: { id: true },
        where: ({ bookingDate }, { gte }) =>
          gte(bookingDate, startOfDay(new Date())),
      },
    },
  });

  const existingSchedulesMap = new Map(existingSchedules.map((s) => [s.id, s]));

  const newSchedules: {
    eventId: number;
    day: WeekDay;
    startTime: string;
    isActive: boolean;
  }[] = [];
  const schedulesToUpdate: {
    id: number;
    startTime: string;
    isActive: boolean;
    hasBookings: boolean;
  }[] = [];
  const schedulesToKeep = new Set<number>();

  for (const [day, daySchedules] of Object.entries(data)) {
    for (const { scheduleId: id, startTime, isActive } of daySchedules) {
      if (id && existingSchedulesMap.has(id)) {
        const existingSchedule = existingSchedulesMap.get(id)!;
        if (
          existingSchedule.startTime.slice(0, -3) !== startTime ||
          existingSchedule.isActive !== isActive
        ) {
          schedulesToUpdate.push({
            id,
            startTime,
            isActive,
            hasBookings: !!existingSchedule.bookings.length,
          });
        }
        schedulesToKeep.add(id);
      } else {
        newSchedules.push({
          eventId: scheduleEventId,
          day: day as WeekDay,
          startTime,
          isActive,
        });
      }
    }
  }

  const schedulesToDelete = existingSchedules.filter(
    (s) => !schedulesToKeep.has(s.id)
  );

  const queries: BatchItem<"pg">[] = [];

  if (schedulesToDelete.length) {
    queries.push(
      db.delete(eventSchedules).where(
        inArray(
          eventSchedules.id,
          schedulesToDelete
            .filter((std) => !std.bookings.length)
            .map((s) => s.id)
        )
      )
    );
  }

  if (schedulesToUpdate.length) {
    for (const { id, startTime, isActive, hasBookings } of schedulesToUpdate) {
      if (hasBookings) continue;
      queries.push(
        db
          .update(eventSchedules)
          .set({ startTime, isActive })
          .where(eq(eventSchedules.id, id))
      );
    }
  }

  if (newSchedules.length) {
    queries.push(db.insert(eventSchedules).values(newSchedules));
  }

  if (queries.length)
    await db.batch(queries as [BatchItem<"pg">, ...BatchItem<"pg">[]]);

  const errorSchedulesIds = existingSchedules
    .filter(
      (es) =>
        (schedulesToUpdate.some((s) => es.id === s.id) ||
          schedulesToDelete.some((s) => es.id === s.id)) &&
        !!es.bookings.length
    )
    .map(({ id }) => id);

  if (errorSchedulesIds.length) return { errorSchedulesIds };
}
