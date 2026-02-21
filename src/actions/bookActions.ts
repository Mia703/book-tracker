"use server";

import { db } from "@/db/drizzle";
import {
  books as booksTable,
  readingProgress as readingProgressTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// CRUD OPERATIONS -- CREATE, READ, UPDATE, DELETE

function capitaliseSentence(string: string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ------ CREATE
export const addBook = async (
  bookInformation: {
    title: string;
    subtitle: string;
    authors: string;
    description: string;
    categories: string;
    isbn: string;
    bookImage: string;
    pageCount: string;
    publishedDate: string;
    publisher: string;
  },
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  },
) => {
  try {
    const book = await getBook(bookInformation, user);

    if (book.status == "failed" && book.bookId == null) {
      const createBook = await db
        .insert(booksTable)
        .values({
          title: bookInformation.title,
          subtitle: bookInformation.subtitle,
          authors: bookInformation.authors
            .split(", ")
            .map((author) => capitaliseSentence(author)),
          description: bookInformation.description,
          categories: bookInformation.categories
            .split(", ")
            .map((category) => capitaliseSentence(category)),
          isbn: bookInformation.isbn,
          bookImage: bookInformation.bookImage,
          pageCount: Number(bookInformation.pageCount),
          publishedDate: new Date(bookInformation.publishedDate),
          publisher: bookInformation.publisher,
          userId: user.id,
        })
        .returning();

      if (createBook[0].id > 0) {
        return {
          status: "success",
          message: "Added book to database",
          bookId: createBook[0].id,
        };
      } else {
        return {
          status: "failed",
          message: "Failed to add book to database",
          bookId: null,
        };
      }
    }
  } catch (error) {
    console.error("addBook", error);
    return {
      status: "failed",
      message: "Error adding book to database",
      clientMessage: "There was an error saving the book, please try again.",
    };
  }
};
// ------ READ
export const getBook = async (
  bookInformation: {
    title: string;
    subtitle: string;
    authors: string;
    description: string;
    categories: string;
    isbn: string;
    bookImage: string;
    pageCount: string;
    publishedDate: string;
    publisher: string;
  },
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  },
) => {
  try {
    const book = await db
      .select()
      .from(booksTable)
      .where(
        and(
          eq(booksTable.userId, user.id),
          eq(booksTable.title, bookInformation.title),
          eq(booksTable.isbn, bookInformation.isbn),
        ),
      );

    if (book[0].id > 0) {
      return {
        status: "success",
        message: "Got book",
        bookId: book[0].id,
      };
    } else {
      return {
        status: "failed",
        message: "Failed to get book",
        bookId: null,
      };
    }
  } catch (error) {
    console.error("getBook", error);
    return {
      status: "failed",
      message: "Error getting book from database",
      clientMessage: "There was an error getting the book, please try again.",
    };
  }
};

export const getAllBooksByReadingStatus = async (
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  },
  readingStatus: "reading" | "finished" | "dnf" | "wishlist",
) => {
  const booksList = await db
    .select()
    .from(booksTable)
    .fullJoin(
      readingProgressTable,
      eq(booksTable.id, readingProgressTable.bookId),
    )
    .where(eq(booksTable.userId, user.id));

  if (booksList.length > 0) {
    booksList.map((book) => {
      if (book.books == null || book.reading_progress == null) {
        return {
          status: "failed",
          message: "Either book or reading progress is missing",
          clientMessage: "Error getting all books for user",
        };
      }
    });

    const filteredBooksList = booksList.filter(
      (book) => book.reading_progress?.readingProgress == readingStatus,
    );

    const sortedBooksList = filteredBooksList.sort((a, b) => {
      // if some items have no reading progress
      if (!a.reading_progress) return 1;
      if (!b.reading_progress) return -1;

      const dateA = a.reading_progress?.createdAt
        ? new Date(a.reading_progress.createdAt).getTime()
        : 0;

      const dateB = b.reading_progress?.createdAt
        ? new Date(b.reading_progress.createdAt).getTime()
        : 0;

      return dateB - dateA; // descenting -- newest first
    });

    return {
      status: "success",
      message: "Got all books by reading status for user.",
      clientMessage: "Got all books",
      books: JSON.stringify(sortedBooksList),
    };
  }
  return {
    status: "failed",
    message: "Either book or reading progress is missing",
    clientMessage: "Error getting all books for user",
  };
};

// ------ UPDATE
export const updateBook = async (
  bookInformation: {
    title: string;
    subtitle: string;
    authors: string;
    description: string;
    categories: string;
    isbn: string;
    bookImage: string;
    pageCount: string;
    publishedDate: string;
    publisher: string;
  },
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  },
) => {
  try {
    const book = await getBook(bookInformation, user);

    if (book.status == "success" && book.bookId != null) {
      const updateBook = await db
        .update(booksTable)
        .set({
          title: bookInformation.title,
          subtitle: bookInformation.subtitle,
          authors: bookInformation.authors
            .split(", ")
            .map((author) => capitaliseSentence(author)),
          description: bookInformation.description,
          categories: bookInformation.categories
            .split(", ")
            .map((category) => capitaliseSentence(category)),
          isbn: bookInformation.isbn,
          bookImage: bookInformation.bookImage,
          pageCount: Number(bookInformation.pageCount),
          publishedDate: new Date(bookInformation.publishedDate),
          publisher: bookInformation.publisher,
        })
        .where(eq(booksTable.id, book.bookId))
        .returning();

      if (updateBook[0].id > 0) {
        return {
          status: "success",
          message: "Updated book",
          bookId: updateBook[0].id,
        };
      } else {
        return {
          status: "failed",
          message: "Failed to update book",
          bookId: updateBook[0].id,
        };
      }
    }
  } catch (error) {
    console.error("updateBook", error);
    return {
      status: "failed",
      message: "Error updating book from database",
      clientMessage: "There was an error updating the book, please try again.",
    };
  }
};

// ------ DELETE
