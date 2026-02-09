ALTER TABLE "books" ADD COLUMN "page_count" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "published_date" timestamp;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "publisher" varchar(255);--> statement-breakpoint
ALTER TABLE "reading_progress" DROP COLUMN "page_count";--> statement-breakpoint
ALTER TABLE "reading_progress" DROP COLUMN "published_date";--> statement-breakpoint
ALTER TABLE "reading_progress" DROP COLUMN "publisher";