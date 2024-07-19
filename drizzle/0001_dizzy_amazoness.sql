ALTER TABLE "integrationTokens" ALTER COLUMN "accessToken" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userWidgetTypeIndex" ON "widgets" USING btree ("userId","type");