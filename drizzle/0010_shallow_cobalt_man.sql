ALTER TYPE "accountLinkType" ADD VALUE 'youtube';--> statement-breakpoint
ALTER TABLE "accountLinks" ALTER COLUMN "accessToken" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accountLinks" ALTER COLUMN "expiresAt" DROP NOT NULL;