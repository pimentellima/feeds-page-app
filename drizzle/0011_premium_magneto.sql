DO $$ BEGIN
 CREATE TYPE "public"."layouEnum" AS ENUM('grid1x1', 'grid2x2', 'grid3x3', 'list');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "layout" "layouEnum";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "gridSize";