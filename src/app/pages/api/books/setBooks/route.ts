import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      readingProgress,
      rating,
      readingFormat,
      startDate,
      endDate,
      comments,
      bookImage,
      isbn,
      userEmail,
    } = await request.json();

    if (
      !readingProgress ||
      !rating ||
      !readingFormat ||
      !startDate ||
      !endDate ||
      !comments ||
      !bookImage ||
      !isbn ||
      !userEmail
    ) {
      return NextResponse.json(
        {
          message: "setBook: User info and book image and isbn are required",
        },
        { status: 404 },
      );
    }

    // check if book exists in db
    const getBook = await xata.db.Books.filter({
      user: userEmail,
      isbn: isbn === "empty" ? null : isbn,
      bookImage: bookImage === "empty" ? null : bookImage,
    }).getFirst();

    const setBook = await xata.db.Books.createOrUpdate(getBook?.xata_id, {
      readingProgress,
      rating: rating === "empty" ? null : rating,
      readingFormat: readingFormat === "empty" ? null : readingFormat,
      startDate: startDate === "empty" ? null : new Date(startDate),
      endDate: endDate === "empty" ? null : new Date(endDate),
      comments: comments === "empty" ? null : comments,
      bookImage: bookImage === "empty" ? null : bookImage,
      isbn: isbn === "empty" ? null : isbn,
      user: userEmail,
    });

    if (!setBook) {
      return NextResponse.json(
        {
          message: {
            message: "setBook: unable to save book",
            type: "error",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: {
          message: "setBook: Book saved",
          type: getBook ? "update" : "new entry",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
