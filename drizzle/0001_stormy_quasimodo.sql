ALTER TABLE "widgets" DROP CONSTRAINT "widgets_integrationTokenId_integrationTokens_id_fk";
--> statement-breakpoint
ALTER TABLE "widgets" DROP COLUMN IF EXISTS "integrationTokenId";