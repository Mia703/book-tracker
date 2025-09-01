import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "deleteBook: Book is required",
            clientMessage: "The book is required. Please try again.",
            messageType: "bad",
          },
        },
        { status: 404 },
      );
    }

    const deleteBook = await xata.db.Books.delete(bookId);

    if (!deleteBook) {
      return NextResponse.json(
        {
          message: {
            developerMessage:
              "deleteBook: Could not delete book. Not found in db.",
            clientMessage: "There was an error. Please try again.",
            messageType: "bad",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "Success",
          clientMessage: "Book successfully removed",
        },
        messageType: "good",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        message: {
          developerMessage: "deleteBook: Internal server error.",
          clientMessage: "There was an error. Please try again.",
          messageType: "bad",
        },
      },
      { status: 500 },
    );
  }
}
