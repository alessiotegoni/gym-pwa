ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_stripePaymentId_unique";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "scheduleId" DROP NOT NULL;