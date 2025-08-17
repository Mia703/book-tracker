import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userEmail, readingProgress } = await request.json();

    if (!userEmail || !readingProgress) {
      return NextResponse.json(
        { message: "getAllBooks: User email and readingProgress is required" },
        { status: 404 },
      );
    }

    const getAllBooksByReadingProgress = await xata.db.Books.filter({
      user: userEmail,
      readingProgress,
    })
      .sort("xata_updatedat", "desc") // sort by newest first
      .getAll();

    if (!getAllBooksByReadingProgress) {
      return NextResponse.json(
        {
          message: `getAllBooksByReadingProgress: There are no books for type: ${readingProgress}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          message: `getAllBooksByReadingProgress: Get books success for type: ${readingProgress}`,
          booksList: JSON.stringify(getAllBooksByReadingProgress),
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
