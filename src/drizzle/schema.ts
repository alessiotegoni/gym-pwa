import { DAYS_OF_WEEK_IN_ORDER, SUBSCRIPTION_STATUSES } from "@/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  pgEnum,
  time,
  index,
  date,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

const timestampObj = {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    ...timestampObj,
  },
  (table) => ({ idIndex: index("users_id_index").on(table.id) })
);

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  accounts: many(accounts),
  subscriptions: many(subscriptions),
}));

export const accounts = pgTable(
  "accounts",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    imageUrl: text("imageUrl").notNull(),
    description: text("description"),
    durationMinutes: integer("durationMinutes").notNull(),
    capacity: integer("capacity").notNull(),
    bookingCutoffMinutes: integer("bookingCutoffMinutes"),
    cancellationCutoffMinutes: integer("cancellationCutoffMinutes"),
    ...timestampObj,
  },
  (table) => ({ idIndex: index("events_id_index").on(table.id) })
);

export const eventsRelations = relations(events, ({ many }) => ({
  eventSchedules: many(eventSchedule),
  dailyTrainings: many(dailyTrainings),
}));

export const daysEnum = pgEnum("days", DAYS_OF_WEEK_IN_ORDER);

export const eventSchedule = pgTable(
  "eventSchedule",
  {
    id: serial("id").primaryKey(),
    eventId: integer("eventId")
      .notNull()
      .references(() => events.id),
    day: daysEnum("day").notNull(),
    startTime: time("startTime").notNull(),
    isActive: boolean("isActive").default(true),
  },
  (table) => ({
    eventIdIndex: index("event_schedule_event_id_index").on(table.eventId),
  })
);

export const eventScheduleRelations = relations(
  eventSchedule,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventSchedule.eventId],
      references: [events.id],
    }),
    bookings: many(bookings),
    trainingImages: many(dailyTrainings),
  })
);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    scheduleId: integer("scheduleId")
      .references(() => eventSchedule.id)
      .notNull(),
    userId: integer("userId")
      .references(() => users.id)
      .notNull(),
    bookingDate: timestamp("bookingDate").notNull(),
    createdAt: timestampObj.createdAt,
  },
  (table) => ({ userIdIndex: index("bookings_user_id_index").on(table.userId) })
);

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  schedule: one(eventSchedule, {
    fields: [bookings.scheduleId],
    references: [eventSchedule.id],
  }),
}));

export const subscriptionStatusesEnum = pgEnum(
  "subcription_status",
  SUBSCRIPTION_STATUSES
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripePaymentId").unique(),
    status: subscriptionStatusesEnum("status").notNull(),
    endDate: timestamp("endDate").notNull(),
    ...timestampObj,
  },
  (table) => ({
    userIdIndex: index("subscriptions_user_id_index").on(table.userId),
  })
);

export const subscriptionsRelation = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const dailyTrainings = pgTable(
  "dailyTrainings",
  {
    id: serial("id").primaryKey(),
    eventId: integer("eventId")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    imageUrl: text("imageUrl").notNull(),
    trainingDate: date("trainingDate").notNull(),
    description: text("description"),
  },
  (table) => ({
    eventIdIndex: index("daily_training_images_index").on(table.eventId),
    dateIndex: index("daily_workouts_date_index").on(table.trainingDate),
  })
);

export const dailyTrainingsRelations = relations(
  dailyTrainings,
  ({ one }) => ({
    event: one(events, {
      fields: [dailyTrainings.eventId],
      references: [events.id],
    }),
  })
);
