ALTER TABLE "eventSchedule" RENAME TO "eventSchedules";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_scheduleId_eventSchedule_id_fk";
--> statement-breakpoint
ALTER TABLE "eventSchedules" DROP CONSTRAINT "eventSchedule_eventId_events_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scheduleId_eventSchedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."eventSchedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventSchedules" ADD CONSTRAINT "eventSchedules_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;