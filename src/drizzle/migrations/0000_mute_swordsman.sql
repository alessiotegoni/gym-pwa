CREATE TYPE "public"."days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."subcription_status" AS ENUM('active', 'canceled', 'trial', 'expired');--> statement-breakpoint
CREATE TABLE "accounts" (
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"scheduleId" integer NOT NULL,
	"userId" integer NOT NULL,
	"bookingDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dailyTrainingImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventId" integer NOT NULL,
	"imageUrl" text NOT NULL,
	"trainingDate" date NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "eventSchedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventId" integer NOT NULL,
	"day" "days" NOT NULL,
	"startTime" time NOT NULL,
	"isActive" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"imageUrl" text NOT NULL,
	"description" text,
	"durationMinutes" integer NOT NULL,
	"capacity" integer NOT NULL,
	"bookingCutoffMinutes" integer,
	"cancellationCutoffMinutes" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"stripePaymentId" text,
	"status" "subcription_status" NOT NULL,
	"endDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripePaymentId_unique" UNIQUE("stripePaymentId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scheduleId_eventSchedule_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."eventSchedule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dailyTrainingImages" ADD CONSTRAINT "dailyTrainingImages_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventSchedule" ADD CONSTRAINT "eventSchedule_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_user_id_index" ON "bookings" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "daily_training_images_index" ON "dailyTrainingImages" USING btree ("eventId");--> statement-breakpoint
CREATE INDEX "daily_workouts_date_index" ON "dailyTrainingImages" USING btree ("trainingDate");--> statement-breakpoint
CREATE INDEX "event_schedule_event_id_index" ON "eventSchedule" USING btree ("eventId");--> statement-breakpoint
CREATE INDEX "events_id_index" ON "events" USING btree ("id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_index" ON "subscriptions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "users_id_index" ON "users" USING btree ("id");