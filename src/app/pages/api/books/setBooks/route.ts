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

    // TODO: check that book doesn't already exist in db - crateOrUpdate
    const setBook = await xata.db.Books.create({
      readingProgress,
      rating: rating === "empty" ? null : rating,
      readingFormat: readingFormat === "empty" ? null : readingFormat,
      startDate: startDate === "empty" ? null : startDate,
      endDate: endDate === "empty" ? null : endDate,
      comments: comments === "empty" ? null : comments,
      bookImage: bookImage === "empty" ? null : bookImage,
      isbn: isbn === "empty" ? null : isbn,
      user: userEmail,
    });

    if (!setBook) {
      return NextResponse.json(
        { message: "setBook: unable to save book" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "setBook: book saved" },
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
