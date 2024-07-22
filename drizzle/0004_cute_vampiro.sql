ALTER TYPE "socialLinksEnum" ADD VALUE 'linkedin';--> statement-breakpoint
ALTER TYPE "socialLinksEnum" ADD VALUE 'github';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "socialLinks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "socialLinksEnum" NOT NULL,
	"url" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "links";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "socialLinks" ADD CONSTRAINT "socialLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
