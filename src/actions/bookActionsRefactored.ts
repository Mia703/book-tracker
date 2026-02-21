/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db/drizzle";
import {
  books as booksTable,
  readingProgress as readingProgressTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Types
type BookInfo = {
  title: string;
  subtitle?: string;
  authors?: string;
  description?: string;
  categories?: string;
  isbn?: string;
  bookImage?: string;
  pageCount?: string | number | null;
  publishedDate?: string | Date | null;
  publisher?: string;
};

type ReaderInfo = {
  readingProgress?: string;
  rating?: string;
  readingFormat?: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  comments?: string;
};

type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

type ActionResult<T = Record<string, unknown>> =
  | { status: "success"; message: string; data?: T }
  | { status: "failed"; message: string; clientMessage?: string };

// Helpers
function normalizeList(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

function parsePageCount(input?: string | number | null): number | null {
  if (input == null || input === "") return null;
  const n = Number(input);
  if (Number.isFinite(n) && n >= 0) return Math.trunc(n);
  return null;
}

function parseDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(String(input));
  return isNaN(d.getTime()) ? null : d;
}

function isValidEnum(value: unknown, allowed: string[]) {
  if (typeof value !== "string") return false;
  return allowed.includes(value);
}

// Allowed enums
const READING_PROGRESS = ["reading", "finished", "dnf", "wishlist"];
const RATING = ["masterpiece", "great", "good", "average", "appalling"];
const READING_FORMAT = ["audio", "paper", "e-book", "library loan"];

// Normalizer
function normalizeBookInput(book: BookInfo) {
  return {
    title: book.title?.trim() ?? "",
    subtitle: book.subtitle?.trim() ?? null,
    authors: normalizeList(book.authors),
    description: book.description?.trim() ?? null,
    categories: normalizeList(book.categories),
    isbn: book.isbn?.trim() ?? null,
    bookImage: book.bookImage?.trim() ?? null,
    pageCount: parsePageCount(book.pageCount),
    publishedDate: parseDate(book.publishedDate),
    publisher: book.publisher?.trim() ?? null,
  };
}

// Read (get) book: prefer ISBN when present, otherwise title
export async function getBook(
  bookInfo: BookInfo,
  user: UserInfo,
): Promise<ActionResult<{ bookId: number }>> {
  try {
    const normalized = normalizeBookInput(bookInfo);

    let rows: any[] = [];

    if (normalized.isbn) {
      rows = await db
        .select()
        .from(booksTable)
        .where(
          and(
            eq(booksTable.userId, user.id),
            eq(booksTable.isbn, normalized.isbn),
          ),
        );
    } else if (normalized.title) {
      rows = await db
        .select()
        .from(booksTable)
        .where(
          and(
            eq(booksTable.userId, user.id),
            eq(booksTable.title, normalized.title),
          ),
        );
    } else {
      return {
        status: "failed",
        message: "No identifying book information provided",
        clientMessage: "Provide an ISBN or title.",
      };
    }

    if (rows.length === 0) {
      return {
        status: "failed",
        message: "Book does not exist",
        clientMessage: "Book not found.",
      };
    }

    const id = rows[0]?.id;
    if (!id)
      return {
        status: "failed",
        message: "Invalid DB result",
        clientMessage: "Unexpected database response.",
      };

    return { status: "success", message: "Got book", data: { bookId: id } };
  } catch (error) {
    console.error("getBook", error);
    return {
      status: "failed",
      message: "Error getting book from database",
      clientMessage: "There was an error getting the book, please try again.",
    };
  }
}

export async function addBook(
  bookInfo: BookInfo,
  user: UserInfo,
): Promise<ActionResult<{ bookId: number }>> {
  try {
    const existing = await getBook(bookInfo, user);
    if (existing.status === "success") {
      return {
        status: "failed",
        message: "Book already exists",
        clientMessage: "This book already exists in your library.",
      };
    }

    const n = normalizeBookInput(bookInfo);

    const inserted = await db
      .insert(booksTable)
      .values({
        title: n.title,
        subtitle: n.subtitle,
        authors: n.authors,
        description: n.description,
        categories: n.categories,
        isbn: n.isbn,
        bookImage: n.bookImage,
        pageCount: n.pageCount,
        publishedDate: n.publishedDate,
        publisher: n.publisher,
        userId: user.id,
      })
      .returning();

    if (!inserted || inserted.length === 0 || !inserted[0]?.id) {
      return {
        status: "failed",
        message: "Failed to add book to database",
        clientMessage: "There was an error saving the book, please try again.",
      };
    }

    return {
      status: "success",
      message: "Added book to database",
      data: { bookId: inserted[0].id },
    };
  } catch (error: any) {
    console.error("addBook", error);
    // Handle unique-constraint style errors gracefully if the DB provides details
    return {
      status: "failed",
      message: "Error adding book to database",
      clientMessage: "There was an error saving the book, please try again.",
    };
  }
}

// FIXME: include updates to this function or add in book form component
// Transactional helper: add book and reading progress in one atomic operation
export async function addBookWithReadingProgress(
  bookInfo: BookInfo,
  readerInfo: ReaderInfo,
  user: UserInfo,
): Promise<ActionResult<{ bookId?: number; readingProgressId?: number }>> {
  try {
    const normalizedBook = normalizeBookInput(bookInfo);

    // Validate reader enums if provided
    if (
      readerInfo.readingProgress &&
      !isValidEnum(readerInfo.readingProgress, READING_PROGRESS)
    ) {
      return {
        status: "failed",
        message: "Invalid reading progress value",
        clientMessage: "Invalid reading progress selected.",
      };
    }
    if (readerInfo.rating && !isValidEnum(readerInfo.rating, RATING)) {
      return {
        status: "failed",
        message: "Invalid rating value",
        clientMessage: "Invalid rating selected.",
      };
    }
    if (
      readerInfo.readingFormat &&
      !isValidEnum(readerInfo.readingFormat, READING_FORMAT)
    ) {
      return {
        status: "failed",
        message: "Invalid reading format value",
        clientMessage: "Invalid reading format selected.",
      };
    }

    // No transaction support in current driver; perform sequential operations
    // Try to find book by isbn/title
    let bookId: number;
    const existingBook = await getBook(bookInfo, user);
    if (existingBook.status === "success") {
      bookId = existingBook.data!.bookId as number;
    } else {
      const inserted = await db
        .insert(booksTable)
        .values({
          title: normalizedBook.title,
          subtitle: normalizedBook.subtitle,
          authors: normalizedBook.authors,
          description: normalizedBook.description,
          categories: normalizedBook.categories,
          isbn: normalizedBook.isbn,
          bookImage: normalizedBook.bookImage,
          pageCount: normalizedBook.pageCount,
          publishedDate: normalizedBook.publishedDate,
          publisher: normalizedBook.publisher,
          userId: user.id,
        })
        .returning();

      if (!inserted || inserted.length === 0 || !inserted[0]?.id) {
        return {
          status: "failed",
          message: "Failed to insert book",
          clientMessage:
            "There was an error saving the book, please try again.",
        };
      }
      bookId = inserted[0].id;
    }

    // Validate and normalize reader dates
    const start = parseDate(readerInfo.startDate);
    const end = parseDate(readerInfo.endDate);
    if (start && end && start > end) {
      return {
        status: "failed",
        message: "Invalid dates",
        clientMessage: "Start date must be before end date",
      };
    }

    // Check existing reading progress for this user+book
    const existingProgress = await db
      .select()
      .from(readingProgressTable)
      .where(
        and(
          eq(readingProgressTable.bookId, bookId),
          eq(readingProgressTable.userId, user.id),
        ),
      );

    if (existingProgress.length > 0) {
      return {
        status: "success",
        message: "Reading progress already exists",
        data: { bookId, readingProgressId: existingProgress[0].id },
      };
    }

    const insertedProgress = await db
      .insert(readingProgressTable)
      .values({
        readingProgress: readerInfo.readingProgress as any,
        rating: readerInfo.rating as any,
        readingFormat: readerInfo.readingFormat as any,
        startDate: start,
        endDate: end,
        comments: readerInfo.comments?.trim() ?? null,
        bookId,
        userId: user.id,
      })
      .returning();

    if (
      !insertedProgress ||
      insertedProgress.length === 0 ||
      !insertedProgress[0]?.id
    ) {
      return {
        status: "failed",
        message: "Failed to insert reading progress",
        clientMessage:
          "There was an error saving the reading progress, please try again.",
      };
    }

    return {
      status: "success",
      message: "Added book and reading progress",
      data: { bookId, readingProgressId: insertedProgress[0].id },
    };
  } catch (error: any) {
    console.error("addBookWithReadingProgress", error);
    if (String(error).includes("Start date must be before end date")) {
      return {
        status: "failed",
        message: "Invalid dates",
        clientMessage: "Start date must be the same or before the end date.",
      };
    }
    return {
      status: "failed",
      message: "Error adding book and reading progress",
      clientMessage: "There was an error saving the data, please try again.",
    };
  }
}

// Reading progress helpers
export async function getReadingProgress(
  bookInfo: BookInfo,
  user: UserInfo,
): Promise<ActionResult<{ readingProgressId: number }>> {
  try {
    const book = await getBook(bookInfo, user);
    if (book.status === "failed")
      return {
        status: "failed",
        message: "Failed to get book",
        clientMessage: "Book not found.",
      };

    const bookId = book.data?.bookId as number;

    const rows = await db
      .select()
      .from(readingProgressTable)
      .where(
        and(
          eq(readingProgressTable.bookId, bookId),
          eq(readingProgressTable.userId, user.id),
        ),
      );

    if (!rows || rows.length === 0) {
      return {
        status: "failed",
        message: "Reading progress does not exist",
        clientMessage: "No reading progress found for this book.",
      };
    }

    return {
      status: "success",
      message: "Got reading progress",
      data: { readingProgressId: rows[0].id },
    };
  } catch (error) {
    console.error("getReadingProgress", error);
    return {
      status: "failed",
      message: "Error getting reading progress from database",
      clientMessage:
        "There was an error getting the reading progress, please try again.",
    };
  }
}

export async function updateReadingProgress(
  bookInfo: BookInfo,
  readerInfo: ReaderInfo,
  user: UserInfo,
): Promise<ActionResult<{ readingProgressId?: number }>> {
  try {
    const progress = await getReadingProgress(bookInfo, user);
    if (progress.status === "failed") return progress;

    const id = progress.data?.readingProgressId as number;

    // Validate enums
    if (
      readerInfo.readingProgress &&
      !isValidEnum(readerInfo.readingProgress, READING_PROGRESS)
    ) {
      return {
        status: "failed",
        message: "Invalid reading progress value",
        clientMessage: "Invalid reading progress selected.",
      };
    }

    if (readerInfo.rating && !isValidEnum(readerInfo.rating, RATING)) {
      return {
        status: "failed",
        message: "Invalid rating value",
        clientMessage: "Invalid rating selected.",
      };
    }

    if (
      readerInfo.readingFormat &&
      !isValidEnum(readerInfo.readingFormat, READING_FORMAT)
    ) {
      return {
        status: "failed",
        message: "Invalid reading format value",
        clientMessage: "Invalid reading format selected.",
      };
    }

    const start = parseDate(readerInfo.startDate);
    const end = parseDate(readerInfo.endDate);
    if (start && end && start > end) {
      return {
        status: "failed",
        message: "Invalid dates",
        clientMessage: "Start date must be the same or before the end date.",
      };
    }

    const updated = await db
      .update(readingProgressTable)
      .set({
        readingProgress: readerInfo.readingProgress as any,
        rating: readerInfo.rating as any,
        readingFormat: readerInfo.readingFormat as any,
        startDate: start,
        endDate: end,
        comments: readerInfo.comments?.trim() ?? null,
      })
      .where(eq(readingProgressTable.id, id))
      .returning();

    if (!updated || updated.length === 0 || !updated[0]?.id) {
      return {
        status: "failed",
        message: "Failed to update reading progress",
        clientMessage:
          "There was an error updating the reading progress, please try again.",
      };
    }

    return {
      status: "success",
      message: "Updated reading progress",
      data: { readingProgressId: updated[0].id },
    };
  } catch (error) {
    console.error("updateReadingProgress", error);
    return {
      status: "failed",
      message: "Error updating reading progress in database",
      clientMessage:
        "There was an error updating the reading progress, please try again.",
    };
  }
}
