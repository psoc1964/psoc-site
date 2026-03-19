CREATE TYPE "public"."request_type" AS ENUM('RESET_PASSWORD', 'VERIFY_EMAIL');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'stu');--> statement-breakpoint
CREATE TABLE "album" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"album_url" text,
	"thumbnail_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"flagship_event" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request" (
	"id" serial NOT NULL,
	"user" integer NOT NULL,
	"type" "request_type" NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "request_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'stu' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "album_search_name_index" ON "album" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "user_search_name_index" ON "user" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "email_idx" ON "user" USING btree ("email");