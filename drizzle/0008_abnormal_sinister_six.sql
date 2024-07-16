ALTER TABLE "accountLinks" RENAME COLUMN "refresh_expires_in" TO "refresh_expiresIn";--> statement-breakpoint
ALTER TABLE "accountLinks" ALTER COLUMN "expiresIn" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "accountLinks" ALTER COLUMN "refresh_expiresIn" SET DATA TYPE integer;