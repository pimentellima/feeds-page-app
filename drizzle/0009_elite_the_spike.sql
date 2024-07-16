ALTER TABLE "accountLinks" ADD COLUMN "expiresAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "accountLinks" ADD COLUMN "refreshExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "accountLinks" DROP COLUMN IF EXISTS "expiresIn";--> statement-breakpoint
ALTER TABLE "accountLinks" DROP COLUMN IF EXISTS "refresh_expiresIn";