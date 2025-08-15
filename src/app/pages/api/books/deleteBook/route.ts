import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userEmail, isbn, bookImage } = await request.json();

    if (!userEmail || !isbn || !bookImage) {
      return NextResponse.json(
        {
          message: "deleteBook: User email and book isbn or image are required",
        },
        { status: 404 },
      );
    }

    // option 1
    // const response = await fetch("/pages/api/books/getBook", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     userEmail,
    //     isbn,
    //     bookImage,
    //   }),
    // });

    // if (response.ok) {
    //   const data = await response.json();
    //   const book = JSON.parse(data.message.bookData);
    // }

    // option 2
    const getBook = await xata.db.Books.filter({
      user: userEmail,
      bookImage: bookImage === "empty" ? null : bookImage,
      isbn: isbn === "empty" ? null : isbn,
    }).getFirst();

    const deleteBook = await xata.db.Books.delete([`${getBook?.xata_id}`]);

    if (!deleteBook) {
      return NextResponse.json(
        { message: "deleteBook: Could not delete book" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "deleteBook: Deleted book" },
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
