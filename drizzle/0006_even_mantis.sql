DO $$ BEGIN
 CREATE TYPE "public"."accountLinkType" AS ENUM('tiktok', 'instagram', 'Blue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accountLinks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"type" "accountLinkType" NOT NULL,
	"accessToken" text NOT NULL,
	"expiresIn" numeric NOT NULL,
	"refreshToken" text,
	"refresh_expires_in" numeric
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accountLinks" ADD CONSTRAINT "accountLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
