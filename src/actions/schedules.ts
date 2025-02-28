"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { eventSchedules } from "@/drizzle/schema";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { eventScheduleSchema } from "@/lib/schema/schedule";

export async function updateEventSchedule(
  values: EventScheduleSchemaType,
  eventId: number
) {
  const session = await auth();
  if (!session?.userId || !session.isAdmin) return { error: true };

  const { success, data } = eventScheduleSchema.safeParse(values);

  if (!success) return { error: true };

  await db.delete(eventSchedules).where(eq(eventSchedules.eventId, eventId));

  const scheduleToInsert = Object.entries(data).flatMap(([day, daySchedules]) =>
    daySchedules.map(({ startTime, isActive }) => ({
      eventId,
      day: day as WeekDay,
      startTime,
      isActive,
    }))
  );

  const result = await db.insert(eventSchedules).values(scheduleToInsert)
    .onConflictDoUpdate({ target: [eventSchedules.id], set: {   } });

  if (!result.rowCount) return { error: true };
}
