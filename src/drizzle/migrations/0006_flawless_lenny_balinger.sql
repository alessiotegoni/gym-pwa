ALTER TABLE "bookings" DROP CONSTRAINT "bookings_scheduleId_eventSchedules_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scheduleId_eventSchedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."eventSchedules"("id") ON DELETE set null ON UPDATE no action;