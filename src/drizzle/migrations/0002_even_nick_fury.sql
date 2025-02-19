ALTER TABLE "dailyTrainingImages" RENAME TO "dailyTrainings";--> statement-breakpoint
ALTER TABLE "dailyTrainings" DROP CONSTRAINT "dailyTrainingImages_eventId_events_id_fk";
--> statement-breakpoint
ALTER TABLE "dailyTrainings" ADD CONSTRAINT "dailyTrainings_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;