import { relations } from "drizzle-orm";
import { users, books, readingProgress } from "./schema";

/** ============ RELATIONS = table relationships */
export const usersRelations = relations(users, ({ many }) => ({
  books: many(books),
  readingProgress: many(readingProgress),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  user: one(users, {
    fields: [books.userId],
    references: [users.id],
  }),
  readingProgress: many(readingProgress),
}));

export const readingProgressRelations = relations(
  readingProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [readingProgress.userId],
      references: [users.id],
    }),
    book: one(books, {
      fields: [readingProgress.bookId],
      references: [books.id],
    }),
  }),
);
