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

    const getAllBooksByType = await xata.db.Books.filter({
      user: userEmail,
      readingProgress,
    })
      .sort("xata_updatedat", "desc") // sort by newest first
      .getAll();

    if (!getAllBooksByType) {
      return NextResponse.json(
        {
          message: `getAllBooksByType: There are no books for type: ${readingProgress}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          message: `getAllBooksByType: Get books success for type: ${readingProgress}`,
          booksList: JSON.stringify(getAllBooksByType),
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
