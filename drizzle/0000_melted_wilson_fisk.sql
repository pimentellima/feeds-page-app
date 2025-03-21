DO $$ BEGIN
 CREATE TYPE "public"."integrationType" AS ENUM('tiktokIntegration', 'instagramIntegration', 'xIntegration', 'youtubeIntegration', 'socialLink');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."socialLinksEnum" AS ENUM('tiktok', 'instagram', 'x', 'youtube');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrationTokens" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accessToken" text NOT NULL,
	"expiresAt" timestamp,
	"userId" text NOT NULL,
	"type" "integrationType" NOT NULL,
	"refreshToken" text,
	"refreshExpiresAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "links" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"showThumbnail" boolean,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refreshTokens" (
	"token" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"username" text,
	"bio" text,
	"theme" text,
	"email" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"imageUrl" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "widgets" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"type" "integrationType" NOT NULL,
	"pos" serial NOT NULL,
	"integrationTokenId" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integrationTokens" ADD CONSTRAINT "integrationTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets" ADD CONSTRAINT "widgets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets" ADD CONSTRAINT "widgets_integrationTokenId_integrationTokens_id_fk" FOREIGN KEY ("integrationTokenId") REFERENCES "public"."integrationTokens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
