CREATE TABLE "pushNotifications" (
	"userId" integer NOT NULL,
	"endpoint" text NOT NULL,
	"auth" text NOT NULL,
	"p256dh" text NOT NULL,
	"expirationTime" integer,
	CONSTRAINT "pushNotifications_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "pushNotifications" ADD CONSTRAINT "pushNotifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;