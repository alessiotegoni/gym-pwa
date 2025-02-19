import { getEventsTrainings } from "@/app/(private)/admin/trainings/page";
import { dailyTrainings, events, subscriptions, users } from "@/drizzle/schema";
import { getBookings } from "@/lib/queries";
import { signupSchema } from "@/lib/schema/auth";
import { dailyTrainingSchema } from "@/lib/schema/dailyTraining";
import { eventSchema } from "@/lib/schema/event";
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

export type EventsTrainings = Awaited<ReturnType<typeof getEventsTrainings>>;
