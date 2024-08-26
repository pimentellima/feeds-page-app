CREATE TABLE IF NOT EXISTS "promoCodes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text DEFAULT gen_random_uuid(),
	"valid" boolean DEFAULT true
);
