ALTER TABLE "userLinks" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "userLinks" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "userLinks" ADD COLUMN "showThumbnail" boolean;