import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { dailyTrainings, events, subscriptions, users } from "@/drizzle/schema";
import {
  getBookings,
  getEventSchedule,
  getEventsTrainings,
  getEventsWithSchedules,
} from "@/lib/queries";
import { signupSchema } from "@/lib/schema/auth";
import { dailyTrainingSchema } from "@/lib/schema/dailyTraining";
import { eventSchema } from "@/lib/schema/event";
import { eventScheduleSchema } from "@/lib/schema/schedule";
import { createSubscriptionSchema } from "@/lib/schema/subscription";
import { editUserSchema } from "@/lib/schema/user";
import { groupBookings } from "@/lib/utils";
import { z } from "zod";

export type SignupSchemaType = z.infer<typeof signupSchema>;
export type EditUserSchemaType = z.infer<typeof editUserSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type SubscriptionStatus = (typeof subscriptions.$inferSelect)["status"];
export type CreateSubscriptionType = z.infer<typeof createSubscriptionSchema>;

export type User = typeof users.$inferSelect;

export type Bookings = Awaited<ReturnType<typeof getBookings>>;
export type GroupedBookings = ReturnType<typeof groupBookings>;

export type Training = Omit<DailyTraining, "eventId">;
export type DailyTraining = typeof dailyTrainings.$inferSelect;
export type DailyTrainingSchemaType = z.infer<typeof dailyTrainingSchema>;

export type Event = typeof events.$inferSelect;
export type EventSchemaType = z.infer<typeof eventSchema>;

export type EventSchedules = Awaited<ReturnType<typeof getEventSchedule>>;
export type EventScheduleSchemaType = z.infer<typeof eventScheduleSchema>;
export type EventsWithSchedules = Awaited<
  ReturnType<typeof getEventsWithSchedules>
>;

export type EventsTrainings = Awaited<ReturnType<typeof getEventsTrainings>>;

export type WeekDay = (typeof DAYS_OF_WEEK_IN_ORDER)[number];
