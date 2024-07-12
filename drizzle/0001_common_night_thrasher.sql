CREATE TABLE IF NOT EXISTS "userLinks" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text,
	"url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userLinks" ADD CONSTRAINT "userLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
