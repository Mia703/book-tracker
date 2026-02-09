"use server";

// CRUD OPERATIONS -- CREATE, READ, UPDATE, DELETE

// ------ CREATE
export const addBook = async (
  bookInformation: {
    title: string;
    subtitle: string;
    authors: string[];
    description: string;
    categories: string[];
    isbn: string;
    bookImage: string;
    pageCount: number;
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
  } catch (error) {
    console.error("addBook", error);
    return {
      status: "failed",
      message: "Error adding book to database",
      clientMessage: "There was an error saving the book, please try again.",
    };
  }
};
