"use server";

import { db } from "@/db/drizzle";
import { readingProgress as readingProgressTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBook } from "./bookActions";

// CRUD OPERATIONS -- CREATE, READ, UPDATE, DELETE

// ------ CREATE
export const addReadingProgress = async (
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
  readerInformation: {
    readingProgress: string;
    rating: string;
    readingFormat: string;
    startDate: string;
    endDate: string;
    comments: string;
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
      const readingProgress = await getReadingProgress(bookInformation, user);

      if (
        readingProgress.status == "failed" &&
        readingProgress.message == "Reading progress does not exist"
      ) {
        const createReadingProgress = await db
          .insert(readingProgressTable)
          .values({
            readingProgress: readerInformation.readingProgress as
              | "reading"
              | "finished"
              | "dnf"
              | "wishlist",
            rating: readerInformation.rating as
              | "masterpiece"
              | "great"
              | "good"
              | "average"
              | "appalling",
            readingFormat: readerInformation.readingFormat as
              | "audio"
              | "paper"
              | "e-book"
              | "library loan",
            startDate: new Date(readerInformation.startDate),
            endDate: new Date(readerInformation.endDate),
            comments: readerInformation.comments,
            bookId: book.bookId,
            userId: user.id,
          })
          .returning();

        if (createReadingProgress[0].id > 0) {
          return {
            status: "success",
            message: "Added reading progress to database",
            readingProgressId: createReadingProgress[0].id,
          };
        } else {
          return {
            status: "failed",
            message: "Failed to add reading progress to database",
            readingProgressId: null,
          };
        }
      }
    }
  } catch (error) {
    console.error("addBook", error);
    return {
      status: "failed",
      message: "Error adding book and/or reading progress to database",
      clientMessage: "There was an error saving the book, please try again.",
    };
  }
};

// ----- READ
export const getReadingProgress = async (
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
      const readingProgress = await db
        .select()
        .from(readingProgressTable)
        .where(eq(readingProgressTable.bookId, book.bookId as number));

      if (readingProgress.length > 0) {
        return {
          status: "success",
          message: "Got reading progress",
          readingProgressId: readingProgress[0].id,
        };
      } else {
        return {
          status: "failed",
          message: "Reading progress does not exist",
          readingProgressId: null,
        };
      }
    } else {
      return {
        status: "failed",
        message: "Failed to get book",
        bookId: null,
      };
    }
  } catch (error) {
    console.error("getReadingProgress", error);
    return {
      status: "failed",
      message: "Error getting reading progress from database",
      clientMessage:
        "There was an error getting the reading progress, please try again.",
    };
  }
};

// ------ UPDATE
export const updateReadingProgress = async (
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
  readerInformation: {
    readingProgress: string;
    rating: string;
    readingFormat: string;
    startDate: string;
    endDate: string;
    comments: string;
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
    const readingProgress = await getReadingProgress(bookInformation, user);

    if (
      readingProgress.status == "success" &&
      readingProgress.readingProgressId != null
    ) {
      const updateReadingProgress = await db
        .update(readingProgressTable)
        .set({
          readingProgress: readerInformation.readingProgress as
            | "reading"
            | "finished"
            | "dnf"
            | "wishlist",
          rating: readerInformation.rating as
            | "masterpiece"
            | "great"
            | "good"
            | "average"
            | "appalling",
          readingFormat: readerInformation.readingFormat as
            | "audio"
            | "paper"
            | "e-book"
            | "library loan",
          startDate: new Date(readerInformation.startDate),
          endDate: new Date(readerInformation.endDate),
          comments: readerInformation.comments,
        })
        .where(
          eq(
            readingProgressTable.id,
            readingProgress.readingProgressId as number,
          ),
        )
        .returning();

      if (updateReadingProgress[0].id > 0) {
        return {
          status: "success",
          message: "Updated reading progress",
          bookId: updateReadingProgress[0].id,
        };
      } else {
        return {
          status: "failed",
          message: "Failed to update reading progress",
          bookId: updateReadingProgress[0].id,
        };
      }
    }
  } catch (error) {
    console.error("updateReadingProgress", error);
    return {
      status: "failed",
      message: "Error updating reading progress in database",
      clientMessage:
        "There was an error updating the reading progress, please try again.",
    };
  }
};

// ----- DELETE
