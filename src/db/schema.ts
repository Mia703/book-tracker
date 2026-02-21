import {
  bigserial,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** ============ ENUMS =  domain constraints */
export const readingStatusEnum = pgEnum("reading_status", [
  "reading",
  "finished",
  "dnf",
  "wishlist",
]);

export const readingFormatEnum = pgEnum("reading_format", [
  "e-book",
  "paper",
  "library loan",
  "audio",
]);

export const ratingEnum = pgEnum("rating", [
  "masterpiece",
  "great",
  "good",
  "average",
  "appalling",
]);

/** ============ TABLES = table definitions */
export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  authors: text("authors").array(),
  description: text("description"),
  categories: text("categories").array(),
  isbn: varchar("isbn", { length: 32 }),
  bookImage: text("book_image"),
  pageCount: integer("page_count"),
  publishedDate: timestamp("published_date"),
  publisher: varchar("publisher", { length: 255 }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const readingProgress = pgTable("reading_progress", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  readingProgress: readingStatusEnum("reading_progress").notNull(),
  rating: ratingEnum("rating"),
  readingFormat: readingFormatEnum("reading_format").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  comments: text("comments"),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
