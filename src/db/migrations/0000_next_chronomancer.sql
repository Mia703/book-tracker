CREATE TYPE "public"."rating" AS ENUM('masterpiece', 'great', 'good', 'average', 'appalling');--> statement-breakpoint
CREATE TYPE "public"."reading_format" AS ENUM('e-book', 'paper', 'library loan', 'audio');--> statement-breakpoint
CREATE TYPE "public"."reading_status" AS ENUM('reading', 'finished', 'dnf', 'wishlist');--> statement-breakpoint
CREATE TABLE "books" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"authors" text[],
	"categories" text[],
	"isbn" varchar(32),
	"book_image" text,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"page_count" integer,
	"published_date" timestamp,
	"publisher" varchar(255),
	"reading_progress" "reading_status" NOT NULL,
	"reading_format" "reading_format" NOT NULL,
	"rating" "rating",
	"start_date" timestamp,
	"end_date" timestamp,
	"comments" text,
	"book_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;