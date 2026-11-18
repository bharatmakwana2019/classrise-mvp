CREATE TABLE "onboarding_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institute_name" text NOT NULL,
	"subdomain" text NOT NULL,
	"owner_name" text NOT NULL,
	"owner_email" text NOT NULL,
	"modules" jsonb NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"order_id" text,
	"payment_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"institute_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "onboarding_payments_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "onboarding_payments_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
ALTER TABLE "onboarding_payments" ADD CONSTRAINT "onboarding_payments_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE set null ON UPDATE no action;